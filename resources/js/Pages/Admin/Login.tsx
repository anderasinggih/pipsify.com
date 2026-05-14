import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: '',
    });

    useEffect(() => {
        return () => {
            reset('token');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.login.store'));
    };

    return (
        <GuestLayout>
            <Head title="Admin Portal" />

            <div className="mb-8 flex flex-col items-center">
                <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
                    <ShieldCheck className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Admin Portal</h2>
                <p className="text-sm text-muted-foreground text-center mt-2">Enter the master secret token to access the control center.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-emerald-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="token" value="Secret Token" />

                    <TextInput
                        id="token"
                        type="password"
                        name="token"
                        value={data.token}
                        className="mt-1 block w-full text-center tracking-widest font-mono"
                        autoComplete="off"
                        isFocused={true}
                        onChange={(e) => setData('token', e.target.value)}
                        placeholder="••••••••••••"
                    />

                    <InputError message={errors.token} className="mt-2 text-center" />
                </div>

                <div className="flex items-center justify-end mt-8">
                    <PrimaryButton className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 py-3 rounded-xl" disabled={processing}>
                        Unlock Control Center
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
