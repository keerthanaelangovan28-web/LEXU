import { NextRequest, NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { LLMGraphTransformer } from "@langchain/community/experimental/graph_transformers/llm"
import { Document } from "@langchain/core/documents"
import { VERIFICATION_SYSTEM_PROMPT } from "@/lib/prompts"

// Force dynamic to avoid static generation issues with environment variables
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    try {
        const { sourceText, query } = await req.json()

        if (!sourceText || !query) {
            return NextResponse.json({ error: "Missing sourceText or query" }, { status: 400 })
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 })
        }

        const model = new ChatOpenAI({
            modelName: "gpt-4o",
            temperature: 0,
        })

        // 1. Knowledge Graph Extraction (Simplified for Demo)
        // We demonstrate that we CAN extract the graph, but for the actual verification,
        // we will use the text + graph context to answer the query.
        const llmTransformer = new LLMGraphTransformer({ llm: model })
        const documents = [new Document({ pageContent: sourceText })]
        const graphDocuments = await llmTransformer.convertToGraphDocuments(documents)

        // Extract nodes and relationships to include in the context
        let graphContext = ""
        if (graphDocuments.length > 0) {
            const nodes = graphDocuments[0].nodes.map(n => `${n.type}:${n.id}`).join(", ")
            const relationships = graphDocuments[0].relationships.map(r =>
                `${r.source.id} -[${r.type}]-> ${r.target.id}`
            ).join("\n")

            graphContext = `
Knowledge Graph Context:
Nodes: ${nodes}
Relationships:
${relationships}
`
        }

        // 2. Strict Verification
        const finalPrompt = `
Source Document Content:
${sourceText}

${graphContext}

User Query: "${query}"

Verify the claim based STRICTLY on the Source Document Content and Knowledge Graph Context above.
Follow the Output Format in the System Prompt.
`

        const response = await model.invoke([
            new SystemMessage(VERIFICATION_SYSTEM_PROMPT),
            new HumanMessage(finalPrompt),
        ])

        const responseText = response.content as string

        // Parse the response to extract the parts (Simplified parsing)
        // We assume the LLM follows the format strictly as instructed.

        // Extract "Logical Classification"
        const classificationMatch = responseText.match(/Logical Classification:\s*(Entailed|Contradicted|Not Stated)/i)
        const classification = classificationMatch ? classificationMatch[1] : "Not Stated"

        // Map to VerdictType
        let verdict: "VERIFIED" | "UNCERTAIN" | "HALLUCINATION" = "UNCERTAIN"
        if (classification.toLowerCase() === "entailed") verdict = "VERIFIED"
        else if (classification.toLowerCase() === "contradicted") verdict = "HALLUCINATION"
        else verdict = "UNCERTAIN" // Not Stated -> Uncertain/Hallucination depending on interpretation, usually Uncertain for "not found"

        return NextResponse.json({
            moderatorSummary: responseText,
            finalVerdict: verdict,
            graphData: {
                nodes: graphDocuments[0]?.nodes || [],
                relationships: graphDocuments[0]?.relationships || []
            }
        })

    } catch (error: any) {
        console.error("Verification API Error:", error)
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            details: error.toString()
        }, { status: 500 })
    }
}
