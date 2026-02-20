import type { Layer3Result } from "@/lib/types"

interface ModeratorSynthesisProps {
    result: Layer3Result
}

export function ModeratorSynthesis({ result }: ModeratorSynthesisProps) {
    return (
        <div className={`animate-fade-in-up rounded-xl border p-5 ${result.finalVerdict === "VERIFIED"
                ? "border-success/20 bg-success/5"
                : result.finalVerdict === "UNCERTAIN"
                    ? "border-warning/20 bg-warning/5"
                    : "border-destructive/20 bg-destructive/5"
            }`}>
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Moderator Synthesis</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${result.finalVerdict === "VERIFIED"
                        ? "bg-success/10 text-success"
                        : result.finalVerdict === "UNCERTAIN"
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                    }`}>
                    {result.finalVerdict}
                </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {result.moderatorSummary}
            </p>
        </div>
    )
}
