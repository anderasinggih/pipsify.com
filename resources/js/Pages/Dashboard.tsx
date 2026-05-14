import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, TrendingDown, Target, History, Plus, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { StatusBadge } from '@/Components/StatusBadge';
import { EmotionBadge } from '@/Components/EmotionBadge';
import { Badge } from '@/Components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';
import React from 'react';

const COLORS = ['#9333ea', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

const ProGate = ({ isPro, children, locale }: { isPro: boolean; children: React.ReactNode; locale: string }) => {
    if (isPro) return <>{children}</>;

    const t: any = {
        en: { title: 'Pro Analytics Locked', desc: 'Unlock advanced emotional patterns and mistake tracking.', btn: 'Upgrade to Pro' },
        id: { title: 'Analitik Pro Terkunci', desc: 'Buka pola emosi tingkat lanjut dan pelacakan kesalahan.', btn: 'Upgrade ke Pro' }
    };
    const trans = t[locale] || t.en;

    return (
        <div className="relative group min-h-[300px] flex items-center justify-center">
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[6px] rounded-xl border border-dashed border-primary/30 transition-all group-hover:bg-background/70 p-6 text-center">
                <div className="bg-card p-4 rounded-full shadow-2xl mb-4 border border-border">
                    <Lock className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{trans.title}</h3>
                <p className="text-xs text-muted-foreground mb-6 max-w-[200px]">{trans.desc}</p>
                <Button 
                    onClick={() => router.post(route('subscription.upgrade'))}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                >
                    {trans.btn}
                </Button>
            </div>
            <div className="opacity-20 pointer-events-none grayscale blur-[1px] w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default function Dashboard({ stats, recent_trades, analytics }: any) {
    const { auth } = usePage().props as any;
    const isPro = auth.user.is_pro;
    const activeAccount = auth.active_trade_account;
    const currency = activeAccount?.currency || 'USD';
    const locale = auth.locale || 'en';

    const translations: any = {
        en: {
            title: 'Dashboard',
            welcome: 'Overview for',
            log_trade: 'Log New Trade',
            total_trades: 'Total Trades',
            lifetime: 'Lifetime activity',
            win_rate: 'Win Rate',
            net_pnl: 'Total Net PnL',
            realized: 'Realized profit/loss',
            mistakes_title: 'PnL by Mistakes',
            mistakes_desc: 'Impact of trading errors',
            emotion_title: 'Win Rate by Emotion',
            emotion_desc: 'Performance based on psychological state',
            recent: 'Recent Activity',
            recent_desc: 'Trades for current account',
            view_all: 'View All Journal',
            no_trades: 'No trades found for this account.'
        },
        id: {
            title: 'Beranda',
            welcome: 'Ikhtisar untuk',
            log_trade: 'Catat Trade Baru',
            total_trades: 'Total Trade',
            lifetime: 'Aktivitas seumur hidup',
            win_rate: 'Win Rate',
            net_pnl: 'Total Laba/Rugi',
            realized: 'Keuntungan/kerugian terealisasi',
            mistakes_title: 'PnL Berdasarkan Kesalahan',
            mistakes_desc: 'Dampak kesalahan trading',
            emotion_title: 'Win Rate Berdasarkan Emosi',
            emotion_desc: 'Performa berdasarkan kondisi psikologis',
            recent: 'Aktivitas Terbaru',
            recent_desc: 'Trade untuk akun saat ini',
            view_all: 'Lihat Semua Jurnal',
            no_trades: 'Tidak ada trade ditemukan untuk akun ini.'
        }
    };

    const t = translations[locale] || translations.en;
    const isProfit = stats.total_pnl >= 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{t.title}</h2>
                        <p className="text-xs md:text-sm text-muted-foreground">{t.welcome} <span className="text-primary font-bold">{activeAccount?.name}</span></p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full sm:w-auto">
                        <Link href={route('journal')}>
                            <Plus className="mr-2 h-4 w-4" /> {t.log_trade}
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title={t.title} />

            <div className="space-y-4 md:space-y-8 pb-12">
                {/* Quick Stats */}
                <div className="grid gap-3 md:grid-cols-3">
                    <Card className="bg-card border-border shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <History className="h-10 w-10 text-foreground" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold text-muted-foreground">{t.total_trades}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.total_trades}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">{t.lifetime}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Target className="h-10 w-10 text-emerald-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold text-muted-foreground">{t.win_rate}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.win_rate}%</div>
                            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-500" 
                                    style={{ width: `${stats.win_rate}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            {isProfit ? <TrendingUp className="h-10 w-10 text-emerald-500" /> : <TrendingDown className="h-10 w-10 text-rose-500" />}
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold text-muted-foreground">{t.net_pnl}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={cn(
                                "text-2xl md:text-3xl font-bold",
                                isProfit ? "text-emerald-400" : "text-rose-400"
                            )}>
                                {formatCurrency(stats.total_pnl, currency)}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">{t.realized}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Advanced Analytics Section */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="bg-card border-border shadow-md">
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                {t.mistakes_title}
                                {!isPro && <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">PRO</Badge>}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">{t.mistakes_desc} ({currency})</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 pt-4">
                            <ProGate isPro={isPro} locale={locale}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.mistakes_pnl}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="#71717a" 
                                            fontSize={9} 
                                            tickLine={false} 
                                            axisLine={false}
                                        />
                                        <YAxis 
                                            stroke="#71717a" 
                                            fontSize={9} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(val) => currency === 'IDR' ? `${(val/1000000).toFixed(1)}M` : `$${val}`}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                                            formatter={(value: any) => formatCurrency(value, currency)}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {analytics.mistakes_pnl?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ProGate>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-md">
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                {t.emotion_title}
                                {!isPro && <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">PRO</Badge>}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">{t.emotion_desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <ProGate isPro={isPro} locale={locale}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.emotion_win_rate}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {analytics.emotion_win_rate?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                                            formatter={(value: any) => `${value}%`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ProGate>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-card border-border shadow-md overflow-hidden">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 sm:p-6">
                        <div>
                            <CardTitle className="text-base font-bold text-foreground">{t.recent}</CardTitle>
                            <CardDescription className="text-[10px] text-muted-foreground">{t.recent_desc}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild className="border-border hover:bg-secondary text-muted-foreground hover:text-foreground w-full sm:w-auto h-8 text-xs">
                            <Link href={route('journal')}>{t.view_all}</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-4">
                        <div className="space-y-3">
                            {recent_trades.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <AlertCircle className="h-10 w-10 text-muted-foreground/30 mb-4" />
                                    <p className="text-sm text-muted-foreground">{t.no_trades}</p>
                                </div>
                            ) : (
                                recent_trades.map((trade: any) => (
                                    <div key={trade.id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border bg-background hover:bg-secondary/30 transition-colors group">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className={cn(
                                                "h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-inner border border-border/50 shrink-0 transition-all group-hover:scale-110",
                                                trade.status === 'win' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                                                trade.status === 'loss' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : 
                                                "bg-secondary text-muted-foreground border-border"
                                            )}>
                                                {trade.status === 'win' ? (
                                                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                                                ) : trade.status === 'loss' ? (
                                                    <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6" />
                                                ) : (
                                                    <History className="h-5 w-5 sm:h-6 sm:w-6" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-foreground text-sm sm:text-base truncate">{trade.ticker}</span>
                                                    <StatusBadge status={trade.status} className="scale-75 origin-left" />
                                                </div>
                                                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                                    {new Date(trade.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className={cn(
                                                "font-bold text-sm sm:text-base",
                                                parseFloat(trade.net_pnl) >= 0 ? "text-emerald-400" : "text-rose-400"
                                            )}>
                                                {parseFloat(trade.net_pnl) >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl, currency)}
                                            </div>
                                            <div className="flex items-center justify-end gap-2 mt-1 hidden sm:flex">
                                                <EmotionBadge emotion={trade.pre_trade_emotion} className="scale-75 origin-right opacity-80" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
