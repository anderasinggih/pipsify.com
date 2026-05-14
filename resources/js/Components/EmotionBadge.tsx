import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import { Smile, Frown, Meh, Zap, AlertCircle } from "lucide-react";

export function EmotionBadge({ emotion, className }: { emotion: string; className?: string }) {
  const configs: any = {
    calm: { color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", icon: Smile },
    satisfied: { color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", icon: Smile },
    fomo: { color: "text-amber-400 border-amber-500/20 bg-amber-500/5", icon: Zap },
    greedy: { color: "text-amber-400 border-amber-500/20 bg-amber-500/5", icon: Zap },
    anxious: { color: "text-rose-400 border-rose-500/20 bg-rose-500/5", icon: AlertCircle },
    frustrated: { color: "text-rose-400 border-rose-500/20 bg-rose-500/5", icon: Frown },
    relieved: { color: "text-sky-400 border-sky-500/20 bg-sky-500/5", icon: Meh },
    regretful: { color: "text-slate-400 border-slate-500/20 bg-slate-500/5", icon: Frown },
    neutral: { color: "text-slate-400 border-slate-500/20 bg-slate-500/5", icon: Meh },
  };

  const config = configs[emotion] || configs.neutral;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("capitalize flex items-center gap-1.5 px-2 py-0.5 text-[11px]", config.color, className)}>
      <Icon className="h-3 w-3" />
      {emotion}
    </Badge>
  );
}
