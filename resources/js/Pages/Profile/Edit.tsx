import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SubscriptionForm from './Partials/SubscriptionForm';
import UpdateLanguageForm from './Partials/UpdateLanguageForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Settings</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Manage your account and preferences</p>
                </div>
            }
        >
            <Head title="Settings" />

            <div className="py-4 md:py-12 space-y-4 md:space-y-8">
                <div className="bg-card p-4 md:p-8 rounded-3xl border border-border shadow-md">
                    <SubscriptionForm className="max-w-xl" />
                </div>

                <div className="bg-card p-4 md:p-8 rounded-3xl border border-border shadow-md">
                    <UpdateLanguageForm className="max-w-xl" />
                </div>

                <div className="bg-card p-4 md:p-8 rounded-3xl border border-border shadow-md">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-card p-4 md:p-8 rounded-3xl border border-border shadow-md">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="bg-card p-4 md:p-8 rounded-3xl border border-border shadow-md border-rose-500/20">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
