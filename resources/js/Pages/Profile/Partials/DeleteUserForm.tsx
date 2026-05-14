import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/Components/ui/dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const { auth } = usePage().props as any;
    const locale = auth.locale || 'en';
    
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const translations: any = {
        en: {
            title: 'Delete Account',
            desc: 'Once your account is deleted, all of its resources and data will be permanently deleted.',
            btn: 'Delete Account',
            modal_title: 'Are you sure?',
            modal_desc: 'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm.',
            cancel: 'Cancel',
            confirm_btn: 'Permanently Delete'
        },
        id: {
            title: 'Hapus Akun',
            desc: 'Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.',
            btn: 'Hapus Akun Saya',
            modal_title: 'Apakah Anda yakin?',
            modal_desc: 'Setelah akun dihapus, semua data akan hilang selamanya. Masukkan kata sandi Anda untuk mengonfirmasi penghapusan permanen ini.',
            cancel: 'Batal',
            confirm_btn: 'Hapus Secara Permanen'
        }
    };

    const t = translations[locale] || translations.en;

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-foreground leading-none">{t.title}</h2>
                    <p className="text-[10px] text-muted-foreground mt-1">{t.desc}</p>
                </div>
            </header>

            <Button 
                variant="destructive" 
                onClick={confirmUserDeletion}
                className="bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white font-bold h-9 px-6 rounded-full transition-all text-[10px]"
            >
                {t.btn}
            </Button>

            <Dialog open={confirmingUserDeletion} onOpenChange={setIsCreateAccountOpen => confirmingUserDeletion ? closeModal() : confirmUserDeletion()}>
                <DialogContent className="max-w-md bg-card border-border text-foreground rounded-3xl p-6">
                    <form onSubmit={deleteUser}>
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-bold">{t.modal_title}</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                {t.modal_desc}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2 mb-6">
                            <Label htmlFor="password_del" className="sr-only">Password</Label>
                            <Input
                                id="password_del"
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="bg-background border-border rounded-xl h-12 focus:ring-primary"
                                placeholder="Password"
                                required
                            />
                            {errors.password && <p className="text-[10px] text-destructive font-bold uppercase">{errors.password}</p>}
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={closeModal}
                                className="flex-1 h-12 rounded-full border-border hover:bg-secondary font-bold"
                            >
                                {t.cancel}
                            </Button>
                            <Button 
                                type="submit" 
                                variant="destructive" 
                                className="flex-1 h-12 rounded-full font-bold shadow-lg shadow-rose-500/20"
                                disabled={processing}
                            >
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t.confirm_btn}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
