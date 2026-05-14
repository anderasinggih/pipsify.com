import { PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, LogOut, TrendingUp, Settings, Activity } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Toaster } from '@/Components/ui/sonner';

export default function AdminLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <div className="min-h-screen bg-background text-foreground antialiased dark">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground hidden sm:block">
                            Pipsify Admin
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button 
                            asChild 
                            variant="ghost" 
                            className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                        >
                            <Link href={route('admin.logout')} method="post" as="button">
                                <LogOut className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Logout Admin</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main>
                {children}
            </main>

            <Toaster theme="dark" position="top-right" richColors />
        </div>
    );
}
