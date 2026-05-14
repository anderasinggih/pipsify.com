import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Settings, 
    Users, 
    LogOut, 
    ChevronLeft, 
    ChevronRight,
    ShieldCheck,
    LineChart,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Toaster } from '@/Components/ui/sonner';

export default function AdminLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as any;
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigation = [
        { name: 'Control Center', href: route('admin.dashboard'), icon: LayoutDashboard, active: route().current('admin.dashboard') },
        { name: 'Users Management', href: '#', icon: Users, active: false },
        { name: 'Signal Settings', href: '#', icon: Settings, active: false },
        { name: 'Analytics', href: '#', icon: LineChart, active: false },
    ];

    const SidebarContent = ({ collapsed = false }) => (
        <>
            <div className="flex h-16 items-center px-6">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="h-5 w-5 text-emerald-50 shrink-0" />
                    </div>
                    {!collapsed && <span className="text-xl font-bold tracking-tight text-foreground">Admin Portal</span>}
                </div>
            </div>

            <ScrollArea className="flex-1 px-3 mt-6">
                <nav className="flex flex-col gap-2 py-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                                item.active 
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                item.active ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            {!collapsed && <span className="ml-3">{item.name}</span>}
                        </Link>
                    ))}
                </nav>
            </ScrollArea>

            <div className="border-t border-border p-4">
                <Button 
                    asChild 
                    variant="ghost" 
                    className={cn(
                        "w-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors",
                        collapsed ? "justify-center px-0" : "justify-start px-4"
                    )}
                >
                    <Link href={route('admin.logout')} method="post" as="button">
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="ml-3 font-bold">Logout Admin</span>}
                    </Link>
                </Button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-background text-foreground antialiased overflow-hidden dark">
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex relative flex-col border-r border-border bg-card transition-all duration-300 ease-in-out shadow-xl z-20",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <SidebarContent collapsed={isCollapsed} />
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card shadow-md hover:bg-secondary text-muted-foreground hover:text-foreground z-30"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Desktop Header */}
                <header className="hidden lg:flex h-16 items-center justify-between border-b border-border bg-background/50 backdrop-blur-md px-8 sticky top-0 z-10">
                    <div className="w-full">{header}</div>
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden flex h-14 items-center justify-center px-4 border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-10 pt-[env(safe-area-inset-top)] box-content">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-emerald-50" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Admin Portal</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-background p-3 lg:p-8 pb-32 lg:pb-8 no-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="lg:hidden mb-6">{header}</div>
                        {children}
                    </div>
                </main>

                {/* Floating Mobile Bottom Nav */}
                <div className="lg:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-[94%] max-w-[400px] h-14 bg-card/90 backdrop-blur-3xl border border-border rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between px-2 overflow-hidden">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 rounded-full",
                                item.active 
                                    ? "text-emerald-500" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {item.active && (
                                <motion.div
                                    layoutId="activeAdminTab"
                                    className="absolute inset-x-2 inset-y-1.5 bg-emerald-500/15 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                />
                            )}
                            <item.icon className={cn("h-5 w-5 transition-transform", item.active && "scale-110")} />
                        </Link>
                    ))}
                    <div className="w-[1px] h-8 bg-border mx-1"></div>
                    <Link
                        href={route('admin.logout')}
                        method="post"
                        as="button"
                        className="flex flex-col items-center justify-center flex-1 h-full text-rose-500/70 hover:text-rose-500 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                    </Link>
                </div>
            </div>

            <Toaster theme="dark" position="top-right" richColors />
        </div>
    );
}
