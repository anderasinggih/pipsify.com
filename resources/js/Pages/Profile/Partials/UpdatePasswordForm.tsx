import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Key, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const { auth } = usePage().props as any;
    const locale = auth.locale || 'en';
    
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const translations: any = {
        en: {
            title: 'Security',
            desc: 'Ensure your account is using a long, random password to stay secure.',
            current: 'Current Password',
            new: 'New Password',
            confirm: 'Confirm Password',
            save: 'Update Password',
            saved: 'Password updated successfully!'
        },
        id: {
            title: 'Keamanan',
            desc: 'Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.',
            current: 'Kata Sandi Saat Ini',
            new: 'Kata Sandi Baru',
            confirm: 'Konfirmasi Kata Sandi',
            save: 'Perbarui Kata Sandi',
            saved: 'Kata sandi berhasil diperbarui!'
        }
    };

    const t = translations[locale] || translations.en;

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success(t.saved);
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-foreground">{t.title}</h2>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="current_password" className="text-[10px] font-bold text-muted-foreground">{t.current}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="pl-9 bg-background border-border rounded-xl h-10 focus:ring-primary text-sm"
                            autoComplete="current-password"
                        />
                    </div>
                    {errors.current_password && <p className="text-[10px] text-destructive font-medium">{errors.current_password}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[10px] font-bold text-muted-foreground">{t.new}</Label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="pl-9 bg-background border-border rounded-xl h-10 focus:ring-primary text-sm"
                                autoComplete="new-password"
                            />
                        </div>
                        {errors.password && <p className="text-[10px] text-destructive font-medium">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-[10px] font-bold text-muted-foreground">{t.confirm}</Label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="pl-9 bg-background border-border rounded-xl h-10 focus:ring-primary text-sm"
                                autoComplete="new-password"
                            />
                        </div>
                        {errors.password_confirmation && <p className="text-[10px] text-destructive font-medium">{errors.password_confirmation}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-6 rounded-full shadow-lg shadow-primary/20 text-xs"
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
