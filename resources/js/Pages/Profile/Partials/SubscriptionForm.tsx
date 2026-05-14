import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { router, usePage } from '@inertiajs/react';
import { ShieldCheck, Zap, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SubscriptionForm({ className = '' }: { className?: string }) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const locale = auth.locale || 'en';
    const [processing, setProcessing] = useState(false);

    const translations: any = {
        en: {
            title: 'Plan Management',
            desc: 'Manage your subscription and unlock premium features.',
            pro: 'Pipsify Pro',
            free: 'Free Plan',
            active: 'ACTIVE',
            pro_desc: 'You have full access to all psychology analytics and chart tracking.',
            free_desc: 'Limited to 20 trades and basic tracking features.',
            benefit1: 'Unlimited trade logging',
            benefit2: 'Advanced emotional analytics',
            benefit3: 'Chart screenshot attachments',
            btn: 'Simulate Pro Upgrade',
            thanks: 'Thank you for being a Pro member! Your account is fully unlocked.'
        },
        id: {
            title: 'Manajemen Paket',
            desc: 'Kelola langganan Anda dan buka fitur premium.',
            pro: 'Pipsify Pro',
            free: 'Paket Gratis',
            active: 'AKTIF',
            pro_desc: 'Anda memiliki akses penuh ke semua analitik psikologi dan pelacakan chart.',
            free_desc: 'Terbatas untuk 20 trade dan fitur pelacakan dasar.',
            benefit1: 'Pencatatan trade tanpa batas',
            benefit2: 'Analitik emosi tingkat lanjut',
            benefit3: 'Lampiran tangkapan layar chart',
            btn: 'Simulasi Upgrade ke Pro',
            thanks: 'Terima kasih telah menjadi member Pro! Akun Anda telah terbuka sepenuhnya.'
        }
    };

    const t = translations[locale] || translations.en;

    const upgrade = () => {
        setProcessing(true);
        router.post(route('subscription.upgrade'), {}, {
            onSuccess: () => {
                setProcessing(false);
            },
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-foreground">{t.title}</h2>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
            </header>

            <Card className={cn(
                "mt-6 border shadow-xl rounded-3xl overflow-hidden",
                user.is_pro ? "bg-primary/5 border-primary/20" : "bg-card border-border"
            )}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2 text-foreground font-bold tracking-tight">
                                {user.is_pro ? t.pro : t.free}
                                {user.is_pro && <Badge className="bg-primary text-primary-foreground font-bold rounded-full scale-90">PRO</Badge>}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground text-xs">
                                {user.is_pro ? t.pro_desc : t.free_desc}
                            </CardDescription>
                        </div>
                        <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center border shadow-inner transition-colors shrink-0",
                            user.is_pro ? "bg-primary/20 border-primary/30" : "bg-secondary border-border"
                        )}>
                            {user.is_pro ? <ShieldCheck className="h-6 w-6 text-primary" /> : <Zap className="h-6 w-6 text-muted-foreground/30" />}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    {!user.is_pro ? (
                        <div className="space-y-6">
                            <ul className="space-y-3">
                                {[t.benefit1, t.benefit2, t.benefit3].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                onClick={upgrade} 
                                disabled={processing}
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-full shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t.btn}
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <p className="text-sm text-emerald-400 font-bold">
                                {t.thanks}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
