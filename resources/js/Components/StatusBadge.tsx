import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variants: any = {
    win: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    loss: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
    breakeven: "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20",
    open: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  };

  return (
    <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[11px] font-semibold", variants[status], className)}>
      {status}
    </Badge>
  );
}
