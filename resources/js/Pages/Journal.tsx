import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/Components/ui/dialog';
import { Plus, Filter, Search, Eye, MoreVertical, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { useState } from 'react';
import { StatusBadge } from '@/Components/StatusBadge';
import { EmotionBadge } from '@/Components/EmotionBadge';
import { Badge } from '@/Components/ui/badge';
import TradeForm from '@/Components/TradeForm';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/Components/ui/sheet';
import { cn, formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/Components/ui/scroll-area';

export default function Journal({ trades, strategies }: any) {
    const { auth } = usePage().props as any;
    const isPro = auth.user.is_pro;
    const activeAccount = auth.active_trade_account;
    const currency = activeAccount?.currency || 'USD';
    
    const [selectedTrade, setSelectedTrade] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const translations: any = {
        en: {
            title: 'Trade Journal',
            account: 'Account',
            new_trade: 'New Trade',
            log_trade: 'Log New Trade',
            log_desc: 'Logging trade for',
            search: 'Search ticker...',
            no_trades: 'No trades found for this account.',
            pnl_label: 'Net Profit/Loss',
            execution: 'Execution',
            psy_review: 'Psychological Review',
            pre_trade: 'Pre-Trade',
            post_trade: 'Post-Trade',
            mistakes: 'Mistakes Made',
            notes_title: 'Journal Notes',
            no_notes: 'No notes provided for this trade.',
            edit_btn: 'Edit Trade',
            delete_btn: 'Delete Trade',
            confirm_del: 'Are you sure?',
            view_trade: 'View Trade'
        },
        id: {
            title: 'Jurnal Trading',
            account: 'Akun',
            new_trade: 'Trade Baru',
            log_trade: 'Catat Trade Baru',
            log_desc: 'Mencatat trade untuk',
            search: 'Cari simbol...',
            no_trades: 'Tidak ada trade ditemukan untuk akun ini.',
            pnl_label: 'Laba/Rugi Bersih',
            execution: 'Eksekusi',
            psy_review: 'Tinjauan Psikologis',
            pre_trade: 'Sebelum Trade',
            post_trade: 'Sesudah Trade',
            mistakes: 'Kesalahan yang Dibuat',
            notes_title: 'Catatan Jurnal',
            no_notes: 'Tidak ada catatan untuk trade ini.',
            edit_btn: 'Edit Trade',
            delete_btn: 'Hapus Trade',
            confirm_del: 'Apakah Anda yakin?',
            view_trade: 'Lihat Trade'
        }
    };

    const locale = auth.locale || 'en';
    const t = translations[locale] || translations.en;

    const filteredTrades = trades.filter((t: any) => 
        filterStatus === 'all' ? true : t.status === filterStatus
    );

    const openTradeDetails = (trade: any) => {
        setSelectedTrade(trade);
        setIsSheetOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg md:text-2xl font-bold tracking-tight text-foreground">{t.title}</h2>
                        <p className="text-[10px] md:text-sm text-muted-foreground">{t.account}: <span className="text-primary font-bold">{activeAccount?.name}</span></p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full sm:w-auto h-10 text-sm rounded-full">
                                <Plus className="mr-2 h-4 w-4" /> {t.new_trade}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-card border-border text-foreground p-0 overflow-hidden sm:rounded-3xl">
                            <div className="p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
                                <DialogHeader className="mb-4">
                                    <DialogTitle>{t.log_trade}</DialogTitle>
                                    <DialogDescription className="text-[10px]">{t.log_desc} {activeAccount?.name} ({currency})</DialogDescription>
                                </DialogHeader>
                                <TradeForm strategies={strategies} isPro={isPro} onSuccess={() => setIsCreateOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        >
            <Head title="Journal" />

            <div className="space-y-6 pb-12">
                <div className="flex flex-col gap-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search ticker..." className="pl-10 bg-card border-border focus:ring-primary h-10 w-full" />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['all', 'win', 'loss', 'open'].map((status) => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "capitalize h-8 px-4 rounded-full",
                                    filterStatus === status ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-secondary"
                                )}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>

                <Card className="bg-card border-border shadow-md overflow-hidden rounded-2xl">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-secondary/20">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="text-[10px] text-muted-foreground font-bold h-9">DATE</TableHead>
                                    <TableHead className="text-[10px] text-muted-foreground font-bold h-9">ASSET</TableHead>
                                    <TableHead className="text-[10px] text-muted-foreground font-bold h-9 hidden sm:table-cell">DIRECTION</TableHead>
                                    <TableHead className="text-[10px] text-muted-foreground font-bold h-9">STATUS</TableHead>
                                    <TableHead className="text-right text-[10px] text-muted-foreground font-bold h-9">PNL</TableHead>
                                    <TableHead className="text-right text-[10px] text-muted-foreground font-bold h-9">VIEW</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTrades.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-40 text-center text-muted-foreground text-sm">
                                            No trades found for this account.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTrades.map((trade: any) => (
                                        <TableRow key={trade.id} className="hover:bg-secondary/30 border-border group transition-colors">
                                            <TableCell className="text-foreground text-[10px] font-medium py-2">
                                                {new Date(trade.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground text-xs">{trade.ticker}</span>
                                                    <span className="text-[8px] text-muted-foreground uppercase truncate max-w-[60px] leading-tight">{trade.strategy?.name || 'Manual'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="outline" className={cn(
                                                    "text-[9px] font-bold px-1.5 py-0 rounded-full",
                                                    trade.direction === 'long' ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" : "border-rose-500/30 text-rose-500 bg-rose-500/5"
                                                )}>
                                                    {trade.direction.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={trade.status} className="scale-75 origin-left" />
                                            </TableCell>
                                            <TableCell className={cn(
                                                "text-right font-bold text-xs py-2",
                                                parseFloat(trade.net_pnl) >= 0 ? "text-emerald-400" : "text-rose-400"
                                            )}>
                                                {formatCurrency(trade.net_pnl, currency)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => openTradeDetails(trade)} className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* Trade Detail Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-card border-l border-border text-foreground p-0 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-4 sm:p-6 pb-24 sm:pb-20">
                            <SheetHeader className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl font-bold tracking-tighter">{selectedTrade?.ticker}</span>
                                    <StatusBadge status={selectedTrade?.status} className="scale-90" />
                                </div>
                                <SheetDescription className="text-[10px] text-muted-foreground">
                                    Executed in {activeAccount?.name} ({currency})
                                </SheetDescription>
                            </SheetHeader>

                            {selectedTrade && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-2xl bg-background border border-border">
                                            <p className="text-[9px] font-bold text-muted-foreground mb-0.5">{t.pnl_label}</p>
                                            <p className={cn("text-lg font-bold", parseFloat(selectedTrade.net_pnl) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                                {formatCurrency(selectedTrade.net_pnl, currency)}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-background border border-border">
                                            <p className="text-[9px] font-bold text-muted-foreground mb-0.5">{t.execution}</p>
                                            <p className="text-lg font-bold text-foreground capitalize">{selectedTrade.direction}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-muted-foreground tracking-tight border-b border-border pb-1.5">{t.psy_review}</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-muted-foreground mb-1.5">{t.pre_trade}</p>
                                                <EmotionBadge emotion={selectedTrade.pre_trade_emotion} className="scale-75 origin-left" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted-foreground mb-1.5">{t.post_trade}</p>
                                                <EmotionBadge emotion={selectedTrade.post_trade_emotion} className="scale-75 origin-left" />
                                            </div>
                                        </div>
                                        
                                        {selectedTrade.mistakes_made?.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-[9px] font-bold text-muted-foreground mb-1.5">{t.mistakes}</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedTrade.mistakes_made.map((m: string) => (
                                                        <Badge key={m} variant="destructive" className="bg-rose-500/10 text-rose-400 border-rose-500/20 capitalize text-[9px] px-2 py-0 h-5 rounded-full">
                                                            {m.replace('_', ' ')}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-muted-foreground tracking-tight border-b border-border pb-1.5">{t.notes_title}</h4>
                                        <p className="text-xs text-foreground leading-relaxed italic bg-secondary/20 p-3 rounded-2xl border border-border">
                                            "{selectedTrade.notes || t.no_notes}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full h-11 text-sm">{t.edit_btn}</Button>
                                        <Button variant="destructive" className="sm:w-11 h-11 px-0 rounded-full" onClick={() => {
                                            if(confirm(t.confirm_del)) {
                                                router.delete(route('trades.destroy', selectedTrade.id));
                                                setIsSheetOpen(false);
                                            }
                                        }}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sm:hidden ml-2">{t.delete_btn}</span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </AuthenticatedLayout>
    );
}
