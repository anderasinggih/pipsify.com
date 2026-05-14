import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Settings, BrainCircuit, Activity, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard({ settings, signals }: any) {
    const { data, setData, post, processing } = useForm({
        gemini_api_key: settings?.gemini_api_key || '',
        allowed_pairs: settings?.allowed_pairs || '["XAUUSD", "BTCUSD", "EURUSD", "GBPUSD"]',
        free_limit: settings?.free_limit || 3,
        pro_limit: settings?.pro_limit || 10,
    });

    const submitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Settings saved successfully!'),
        });
    };

    const generateSignal = () => {
        router.post(route('admin.signals.generate'), {}, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                if (page.props.flash.success) toast.success(page.props.flash.success);
                if (page.props.flash.error) toast.error(page.props.flash.error);
            }
        });
    };

    const updateSignalStatus = (id: number, status: string, pnl: string = '') => {
        router.patch(route('admin.signals.update', id), { status, pnl }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Signal status updated.')
        });
    };

    return (
        <AdminLayout
            header={<h2 className="text-xl font-bold leading-tight text-foreground">Admin Control Center</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                
                {/* Settings Card */}
                <Card className="bg-card border-border rounded-3xl shadow-lg">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Settings className="w-5 h-5" />
                            Platform AI Configuration
                        </CardTitle>
                        <CardDescription className="text-xs">Configure the Gemini AI parameters and subscription limits.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={submitSettings} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Gemini API Key</Label>
                                    <Input 
                                        type="password"
                                        value={data.gemini_api_key}
                                        onChange={e => setData('gemini_api_key', e.target.value)}
                                        className="h-10 bg-background border-border rounded-xl focus:ring-primary text-sm"
                                        placeholder="AIzaSy..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Allowed Pairs (JSON Array)</Label>
                                    <Input 
                                        value={data.allowed_pairs}
                                        onChange={e => setData('allowed_pairs', e.target.value)}
                                        className="h-10 bg-background border-border rounded-xl focus:ring-primary text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Free Tier Daily Limit</Label>
                                    <Input 
                                        type="number"
                                        value={data.free_limit}
                                        onChange={e => setData('free_limit', parseInt(e.target.value))}
                                        className="h-10 bg-background border-border rounded-xl focus:ring-primary text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Pro Tier Daily Limit</Label>
                                    <Input 
                                        type="number"
                                        value={data.pro_limit}
                                        onChange={e => setData('pro_limit', parseInt(e.target.value))}
                                        className="h-10 bg-background border-border rounded-xl focus:ring-primary text-sm"
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-10 rounded-xl font-bold mt-4 shadow-primary/20 shadow-lg">
                                Save Configuration
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Signals Log */}
                <Card className="bg-card border-border rounded-3xl shadow-lg">
                    <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-emerald-500">
                                <Activity className="w-5 h-5" />
                                Signals Log
                            </CardTitle>
                            <CardDescription className="text-xs">History of all AI generated signals.</CardDescription>
                        </div>
                        <Button 
                            onClick={generateSignal}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold flex items-center gap-2 h-9 text-xs"
                        >
                            <BrainCircuit className="w-4 h-4" />
                            <span className="hidden sm:inline">Generate Now</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-0 p-0">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] uppercase text-muted-foreground bg-secondary/50 border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Pair</th>
                                        <th className="px-4 py-3 font-medium">Direction</th>
                                        <th className="px-4 py-3 font-medium">Entry</th>
                                        <th className="px-4 py-3 font-medium">Stop Loss</th>
                                        <th className="px-4 py-3 font-medium">Take Profit (1 & 2)</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {signals.data.map((sig: any) => (
                                        <tr key={sig.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(sig.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 font-bold">{sig.pair}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sig.direction === 'long' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                    {sig.direction.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">{sig.entry_price}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-rose-500">{sig.stop_loss}</td>
                                            <td className="px-4 py-3 font-mono text-[10px] text-emerald-500">
                                                <span className="block font-bold">TP1: {sig.tp_1}</span>
                                                {sig.tp_2 && <span className="block text-emerald-500/70">TP2: {sig.tp_2}</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                {sig.status === 'active' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">ACTIVE</span>}
                                                {sig.status === 'won' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">WON</span>}
                                                {sig.status === 'won_tp1' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">WON (TP1)</span>}
                                                {sig.status === 'won_tp2' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">WON (TP2)</span>}
                                                {sig.status === 'lost' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500">LOST</span>}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {sig.status === 'active' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => updateSignalStatus(sig.id, 'won')} className="p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => updateSignalStatus(sig.id, 'lost')} className="p-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`font-bold text-xs ${sig.pnl > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {sig.pnl ? `${sig.pnl > 0 ? '+' : ''}${sig.pnl}` : '-'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {signals.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                                                No signals generated yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AdminLayout>
    );
}
