import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { User, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const locale = auth.locale || 'en';

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const translations: any = {
        en: {
            title: 'Profile Information',
            desc: "Update your account's profile information and email address.",
            name: 'Full Name',
            email: 'Email Address',
            save: 'Save Changes',
            saved: 'Saved successfully!',
            verify: 'Your email address is unverified.',
            click_verify: 'Click here to re-send the verification email.',
            sent: 'A new verification link has been sent to your email address.'
        },
        id: {
            title: 'Informasi Profil',
            desc: "Perbarui informasi profil dan alamat email akun Anda.",
            name: 'Nama Lengkap',
            email: 'Alamat Email',
            save: 'Simpan Perubahan',
            saved: 'Berhasil disimpan!',
            verify: 'Alamat email Anda belum diverifikasi.',
            click_verify: 'Klik di sini untuk mengirim ulang email verifikasi.',
            sent: 'Tautan verifikasi baru telah dikirim ke alamat email Anda.'
        }
    };

    const t = translations[locale] || translations.en;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => toast.success(t.saved),
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-foreground leading-none">{t.title}</h2>
                    <p className="text-[10px] text-muted-foreground mt-1">{t.desc}</p>
                </div>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-bold text-muted-foreground">{t.name}</Label>
                        <div className="relative">
                            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                                id="name"
                                className="pl-8 bg-background border-border rounded-lg h-9 focus:ring-primary text-[11px]"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                            />
                        </div>
                        {errors.name && <p className="text-[10px] text-destructive font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-bold text-muted-foreground">{t.email}</Label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-8 bg-background border-border rounded-lg h-9 focus:ring-primary text-[11px]"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>
                        {errors.email && <p className="text-[10px] text-destructive font-medium">{errors.email}</p>}
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-sm text-amber-500 font-medium">
                            {t.verify}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 underline hover:text-amber-400 transition-colors"
                            >
                                {t.click_verify}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1 uppercase">
                                <CheckCircle2 className="h-3 w-3" />
                                {t.sent}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                    <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-9 px-5 rounded-full shadow-lg shadow-primary/20 text-[10px]"
                        disabled={processing}
                    >
                        {processing && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        {t.save}
                    </Button>
                </div>
            </form>
        </section>
    );
}
