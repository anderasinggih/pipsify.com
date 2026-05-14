import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { Link, usePage, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    BookOpen, 
    Settings, 
    LogOut, 
    ChevronLeft, 
    ChevronRight,
    User,
    TrendingUp,
    Menu,
    X,
    PlusCircle,
    Wallet,
    ChevronsUpDown,
    Check,
    Plus,
    Loader2,
    BrainCircuit,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/Components/ui/dropdown-menu';
import { Badge } from '@/Components/ui/badge';
import { Toaster } from '@/Components/ui/sonner';
import { toast } from 'sonner';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;
    const tradeAccounts = auth.trade_accounts || [];
    const activeAccount = auth.active_trade_account;
    const locale = auth.locale || 'en';
    
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        currency: 'USD',
        initial_balance: '0',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const translations: any = {
        en: {
            dashboard: 'Dashboard',
            journal: 'Journal',
            settings: 'Settings',
            switch_account: 'Switch Account',
            create_account: 'Create New Account',
            profile: 'Profile Settings',
            logout: 'Log Out',
            select_account: 'Select Account',
            acc_name: 'Account Name',
            currency: 'Currency',
            init_bal: 'Initial Balance',
            create: 'Create Account',
            add_desc: 'Add a new trading account with its own currency.'
        },
        id: {
            dashboard: 'Beranda',
            journal: 'Jurnal',
            settings: 'Pengaturan',
            switch_account: 'Ganti Akun',
            create_account: 'Buat Akun Baru',
            profile: 'Pengaturan Profil',
            logout: 'Keluar',
            select_account: 'Pilih Akun',
            acc_name: 'Nama Akun',
            currency: 'Mata Uang',
            init_bal: 'Saldo Awal',
            create: 'Buat Akun',
            add_desc: 'Tambahkan akun trading baru dengan mata uangnya sendiri.'
        }
    };

    const t = translations[locale] || translations.en;

    const navigation = [
        { name: t.dashboard, href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
        { name: t.journal, href: route('journal'), icon: BookOpen, active: route().current('journal') },
        { name: 'Signals', href: route('signals.index'), icon: BrainCircuit, active: route().current('signals.index') },
        { name: t.settings, href: route('profile.edit'), icon: Settings, active: route().current('profile.edit') },
    ];

    const switchAccount = (id: number) => {
        router.post(route('trade-accounts.switch'), { id }, {
            preserveScroll: true,
        });
    };

    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('trade-accounts.store'), {
            onSuccess: () => {
                setIsCreateAccountOpen(false);
                reset();
            }
        });
    };

    const SidebarContent = ({ collapsed = false }) => (
        <>
            <div className="flex h-16 items-center px-6">
                <Link href="/" className="flex items-center gap-2 overflow-hidden">
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <TrendingUp className="h-5 w-5 text-primary-foreground shrink-0" />
                    </div>
                    {!collapsed && <span className="text-xl font-bold tracking-tight text-foreground">Pipsify</span>}
                </Link>
            </div>

            {/* Account Switcher */}
            <div className="px-4 mb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={cn(
                            "w-full justify-between bg-secondary/50 border-border hover:bg-secondary transition-all",
                            collapsed ? "px-2" : "px-3 h-12"
                        )}>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Wallet className="h-4 w-4 text-primary shrink-0" />
                                {!collapsed && (
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className="text-xs font-bold truncate w-full">{activeAccount?.name || t.select_account}</span>
                                        <span className="text-[10px] text-muted-foreground">{activeAccount?.currency}</span>
                                    </div>
                                )}
                            </div>
                            {!collapsed && <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border text-foreground shadow-2xl rounded-2xl p-2">
                        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground px-2 py-1.5">{t.switch_account}</DropdownMenuLabel>
                        {tradeAccounts.map((account: any) => (
                            <DropdownMenuItem 
                                key={account.id} 
                                onClick={() => switchAccount(account.id)}
                                className="rounded-xl cursor-pointer focus:bg-secondary flex items-center justify-between"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{account.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{account.currency}</span>
                                </div>
                                {activeAccount?.id === account.id && <Check className="h-4 w-4 text-primary" />}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem 
                            onClick={() => setIsCreateAccountOpen(true)}
                            className="rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary font-bold text-xs"
                        >
                            <Plus className="h-3 w-3 mr-2" /> {t.create_account}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ScrollArea className="flex-1 px-3">
                <nav className="flex flex-col gap-2 py-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                                item.active 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                item.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            {!collapsed && <span className="ml-3">{item.name}</span>}
                        </Link>
                    ))}
                </nav>
            </ScrollArea>

            <div className="border-t border-border p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start px-2 py-8 hover:bg-secondary rounded-2xl transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary shrink-0 border border-border">
                                    <User className="h-5 w-5" />
                                </div>
                                {!collapsed && (
                                    <div className="flex flex-col items-start text-left overflow-hidden">
                                        <span className="text-sm font-bold leading-none text-foreground truncate w-full">{user.name}</span>
                                        <div className="mt-1.5 flex items-center gap-1">
                                            {user.is_pro ? (
                                                <Badge variant="default" className="h-4 px-1.5 text-[9px] bg-primary/20 text-primary border-primary/30 font-bold rounded-full">PRO</Badge>
                                            ) : (
                                                <Badge variant="outline" className="h-4 px-1.5 text-[9px] text-muted-foreground border-border font-bold rounded-full">FREE</Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border text-foreground shadow-2xl rounded-2xl p-2">
                        {user.is_admin && (
                            <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-500 text-emerald-500 mb-1 font-bold">
                                <Link href={route('admin.dashboard')} className="w-full text-left flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    Admin Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-secondary">
                            <Link href={route('profile.edit')} className="w-full text-left">{t.profile}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left">{t.logout}</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                <header className="lg:hidden flex h-10 items-center justify-between px-4 border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-10 pt-[env(safe-area-inset-top)] box-content">
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer active:opacity-70">
                                    <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold tracking-tight">{activeAccount?.name}</span>
                                        <span className="text-[8px] text-muted-foreground">{activeAccount?.currency}</span>
                                    </div>
                                    <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 bg-card border-border shadow-2xl rounded-2xl p-2 mt-2">
                                {tradeAccounts.map((account: any) => (
                                    <DropdownMenuItem 
                                        key={account.id} 
                                        onClick={() => switchAccount(account.id)}
                                        className="rounded-xl cursor-pointer focus:bg-secondary flex items-center justify-between"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{account.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{account.currency}</span>
                                        </div>
                                        {activeAccount?.id === account.id && <Check className="h-4 w-4 text-primary" />}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem 
                                    onClick={() => setIsCreateAccountOpen(true)}
                                    className="rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary font-bold text-xs"
                                >
                                    <Plus className="h-3 w-3 mr-2" /> {t.create_account}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-background p-3 lg:p-8 pb-32 lg:pb-8 no-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="lg:hidden mb-6">{header}</div>
                        {children}
                    </div>
                </main>

                {/* Floating Mobile Bottom Nav */}
                <div className="lg:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-[94%] max-w-[400px] h-12 bg-card/70 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between px-2 border-t border-t-white/10 overflow-hidden">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-300 rounded-full",
                                item.active 
                                    ? "text-primary" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {item.active && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-x-1.5 inset-y-1.5 bg-primary/15 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                />
                            )}
                            <item.icon className={cn("h-4 w-4 transition-transform", item.active && "scale-110")} />
                            <span className="text-[7px] font-bold">{item.name}</span>
                        </Link>
                    ))}
                    
                    <div className="flex items-center justify-center w-12 h-full pr-1">
                        <Link
                            href={route('journal')}
                            className="flex items-center justify-center bg-primary text-primary-foreground w-9 h-9 rounded-full shadow-2xl shadow-primary/40 active:scale-90 transition-all group"
                        >
                            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Create Account Dialog */}
            <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
                <DialogContent className="max-w-sm bg-card border-border text-foreground rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle>{t.create_account}</DialogTitle>
                        <DialogDescription className="text-xs">
                            {t.add_desc}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateAccount} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="account_name" className="text-xs font-bold text-muted-foreground">{t.acc_name}</Label>
                            <Input 
                                id="account_name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Binomo Real, NYSE"
                                className="bg-background border-border rounded-xl focus:ring-primary h-11"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="account_currency" className="text-xs font-bold text-muted-foreground">{t.currency}</Label>
                                <Select value={data.currency} onValueChange={v => setData('currency', v)}>
                                    <SelectTrigger className="bg-background border-border rounded-xl h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border rounded-xl">
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="IDR">IDR (Rp)</SelectItem>
                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                        <SelectItem value="GBP">GBP (£)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account_balance" className="text-xs font-bold text-muted-foreground">{t.init_bal}</Label>
                                <Input 
                                    id="account_balance"
                                    type="number"
                                    value={data.initial_balance}
                                    onChange={e => setData('initial_balance', e.target.value)}
                                    className="bg-background border-border rounded-xl h-11"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-full shadow-lg shadow-primary/20" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t.create}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Toaster theme="dark" position="top-right" richColors />
        </div>
    );
}
