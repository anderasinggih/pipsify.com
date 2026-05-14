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
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
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
                <p className="text-sm text-muted-foreground text-center mt-2">Sign in with your administrator credentials.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-emerald-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-6">
                    <PrimaryButton className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white" disabled={processing}>
                        Access Control Center
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
