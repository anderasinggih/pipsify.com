import { useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Loader2, Check } from 'lucide-react';
import React from 'react';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';

const MISTAKES_EN = [
    { id: 'fomo_entry', label: 'FOMO Entry' },
    { id: 'exited_early', label: 'Exited Early' },
    { id: 'moved_sl', label: 'Moved Stop Loss' },
    { id: 'revenge_trade', label: 'Revenge Trade' },
    { id: 'overleverage', label: 'Overleverage' },
];

const MISTAKES_ID = [
    { id: 'fomo_entry', label: 'Masuk karena FOMO' },
    { id: 'exited_early', label: 'Keluar Terlalu Cepat' },
    { id: 'moved_sl', label: 'Geser Stop Loss' },
    { id: 'revenge_trade', label: 'Balas Dendam (Revenge)' },
    { id: 'overleverage', label: 'Overleverage' },
];

export default function TradeForm({ strategies, trade = null, isPro = false, onSuccess }: any) {
    const { auth } = usePage().props as any;
    const activeAccount = auth.active_trade_account;
    const currency = activeAccount?.currency || 'USD';
    const locale = auth.locale || 'en';

    const { data, setData, post, patch, processing, errors } = useForm({
        ticker: trade?.ticker || '',
        direction: trade?.direction || 'long',
        status: trade?.status || 'open',
        entry_price: trade?.entry_price || '',
        exit_price: trade?.exit_price || '',
        quantity: trade?.quantity || '',
        strategy_id: trade?.strategy_id?.toString() || '',
        pre_trade_emotion: trade?.pre_trade_emotion || 'neutral',
        post_trade_emotion: trade?.post_trade_emotion || 'neutral',
        mistakes_made: trade?.mistakes_made || [],
        notes: trade?.notes || '',
    });

    const translations: any = {
        en: {
            ticker: 'Ticker/Symbol',
            direction: 'Direction',
            entry_price: 'Entry Price',
            exit_price: 'Exit Price',
            qty: 'Quantity/Size',
            strategy: 'Strategy',
            pre_mindset: 'Pre-Trade Mindset',
            pre_label: 'How are you feeling before the entry?',
            post_review: 'Post-Trade Review',
            status: 'Trade Status',
            mistakes: 'Emotional Mistakes',
            notes: 'Journal Notes',
            notes_placeholder: 'Why did you take this trade? What did you learn?',
            btn_save: 'Save Trade',
            btn_update: 'Update Trade',
            success_msg: 'Trade logged successfully!',
            mistakes_list: MISTAKES_EN
        },
        id: {
            ticker: 'Simbol/Aset',
            direction: 'Arah',
            entry_price: 'Harga Masuk',
            exit_price: 'Harga Keluar',
            qty: 'Jumlah/Size',
            strategy: 'Strategi',
            pre_mindset: 'Mental Sebelum Entry',
            pre_label: 'Apa yang Anda rasakan sebelum entry?',
            post_review: 'Review Setelah Trade',
            status: 'Status Trade',
            mistakes: 'Kesalahan Emosional',
            notes: 'Catatan Jurnal',
            notes_placeholder: 'Kenapa Anda mengambil trade ini? Apa yang Anda pelajari?',
            btn_save: 'Simpan Trade',
            btn_update: 'Perbarui Trade',
            success_msg: 'Trade berhasil dicatat!',
            mistakes_list: MISTAKES_ID
        }
    };

    const t = translations[locale] || translations.en;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (trade) {
            patch(route('trades.update', trade.id), { 
                onSuccess: () => {
                    toast.success(t.success_msg);
                    onSuccess?.();
                }
            });
        } else {
            post(route('trades.store'), { 
                onSuccess: () => {
                    toast.success(t.success_msg);
                    onSuccess?.();
                }
            });
        }
    };

    const toggleMistake = (id: string) => {
        const current = [...data.mistakes_made];
        if (current.includes(id)) {
            setData('mistakes_made', current.filter(m => m !== id));
        } else {
            setData('mistakes_made', [...current, id]);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ticker" className="text-foreground text-sm font-bold">{t.ticker}</Label>
                    <Input 
                        id="ticker" 
                        value={data.ticker} 
                        onChange={e => setData('ticker', e.target.value.toUpperCase())}
                        placeholder="e.g. BTC"
                        className="bg-background border-border focus:ring-primary text-foreground rounded-xl h-10"
                        disabled={!!trade}
                        required
                        maxLength={12}
                    />
                    {errors.ticker && <p className="text-[10px] text-destructive font-medium mt-1">{errors.ticker}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="direction" className="text-foreground text-sm font-bold">{t.direction}</Label>
                    <Select value={data.direction} onValueChange={v => setData('direction', v)} disabled={!!trade}>
                        <SelectTrigger className="bg-background border-border focus:ring-primary text-foreground rounded-xl h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground rounded-xl">
                            <SelectItem value="long">Long</SelectItem>
                            <SelectItem value="short">Short</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="entry_price" className="text-foreground text-sm font-bold">{t.entry_price} ({currency})</Label>
                    <Input 
                        id="entry_price" 
                        type="number" 
                        step="any"
                        value={data.entry_price} 
                        onChange={e => setData('entry_price', e.target.value)}
                        className="bg-background border-border text-foreground rounded-xl h-10"
                        disabled={!!trade}
                        required
                        min="0"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-foreground text-sm font-bold">{t.qty}</Label>
                    <Input 
                        id="quantity" 
                        type="number" 
                        step="any"
                        value={data.quantity} 
                        onChange={e => setData('quantity', e.target.value)}
                        className="bg-background border-border text-foreground rounded-xl h-10"
                        disabled={!!trade}
                        required
                        min="0"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="strategy" className="text-foreground text-sm font-bold">{t.strategy}</Label>
                    <Select value={data.strategy_id} onValueChange={v => setData('strategy_id', v)} disabled={!!trade}>
                        <SelectTrigger className="bg-background border-border text-foreground rounded-xl h-10">
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground rounded-xl">
                            {strategies.map((s: any) => (
                                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <h4 className="text-[10px] font-bold text-muted-foreground mb-4">{t.pre_mindset}</h4>
                <div className="space-y-3">
                    <Label className="text-xs font-medium text-foreground">{t.pre_label}</Label>
                    <div className="flex flex-wrap gap-2">
                        {['calm', 'fomo', 'anxious', 'greedy', 'neutral'].map(emotion => (
                            <Button
                                key={emotion}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setData('pre_trade_emotion', emotion)}
                                className={cn(
                                    "capitalize border-border text-xs transition-all flex-1 sm:flex-none rounded-full h-9",
                                    data.pre_trade_emotion === emotion 
                                        ? "bg-primary/20 border-primary text-primary font-bold" 
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                                disabled={!!trade}
                            >
                                {emotion}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <h4 className="text-[10px] font-bold text-muted-foreground mb-4">{t.post_review}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-foreground text-sm font-bold">{t.status}</Label>
                        <Select value={data.status} onValueChange={v => setData('status', v)}>
                            <SelectTrigger className="bg-background border-border text-foreground rounded-xl h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground rounded-xl">
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="win">Win</SelectItem>
                                <SelectItem value="loss">Loss</SelectItem>
                                <SelectItem value="breakeven">Breakeven</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="exit_price" className="text-foreground text-sm font-bold">{t.exit_price} ({currency})</Label>
                        <Input 
                            id="exit_price" 
                            type="number" 
                            step="any"
                            value={data.exit_price} 
                            onChange={e => setData('exit_price', e.target.value)}
                            className="bg-background border-border text-foreground rounded-xl h-10"
                            placeholder="---"
                            min="0"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-xs font-medium text-foreground">{t.mistakes}</Label>
                        <div className="flex flex-wrap gap-2">
                            {t.mistakes_list.map((m: any) => {
                                const active = data.mistakes_made.includes(m.id);
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => toggleMistake(m.id)}
                                        className={cn(
                                            "group flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 text-xs font-bold",
                                            active 
                                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                                                : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center h-4 w-4 rounded border transition-colors",
                                            active ? "bg-white border-white" : "border-muted-foreground/30 group-hover:border-primary"
                                        )}>
                                            {active && <Check className="h-3 w-3 text-primary" strokeWidth={4} />}
                                        </div>
                                        {m.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-foreground text-sm font-bold">{t.notes}</Label>
                        <Textarea 
                            id="notes" 
                            value={data.notes} 
                            onChange={e => setData('notes', e.target.value)}
                            placeholder={t.notes_placeholder}
                            className="bg-background border-border min-h-[80px] text-sm resize-none focus:ring-primary text-foreground rounded-2xl p-4"
                            maxLength={2000}
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold h-12 shadow-lg shadow-primary/20 rounded-full text-base transition-all active:scale-[0.98]" disabled={processing}>
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {trade ? t.btn_update : t.btn_save}
            </Button>
        </form>
    );
}
