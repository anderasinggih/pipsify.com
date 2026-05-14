import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { TrendingUp, ShieldCheck, PieChart, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Master Your Trading Psychology" />
            <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground antialiased overflow-hidden dark">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
                    <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full" />
                </div>

                {/* Navbar */}
                <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold tracking-tight">Pipsify</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                <Link href={route('dashboard')}>Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
                                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                    <Link href={route('register')}>Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase mb-8">
                        <Activity className="h-3 w-3" />
                        Now in Open Alpha
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-[1.1]">
                        Stop Trading Your <br /> 
                        <span className="text-primary">Emotions</span>.
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                        Pipsify is the ultimate trading journal designed to help you identify 
                        psychological patterns, eliminate emotional mistakes, and achieve 
                        consistent profitability.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg font-bold group shadow-lg shadow-primary/20">
                            <Link href={route('register')}>
                                Start Tracking Free 
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-border bg-secondary/50 hover:bg-secondary h-14 px-8 text-lg font-bold text-foreground">
                            View Demo
                        </Button>
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="mt-20 relative">
                        <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
                        <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl backdrop-blur-sm overflow-hidden">
                            <div className="h-6 w-full bg-secondary/50 rounded-t-lg flex items-center gap-1.5 px-3 border-b border-border">
                                <div className="h-2 w-2 rounded-full bg-rose-500/50" />
                                <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                                <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                            </div>
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
                                <img 
                                    src="https://images.unsplash.com/photo-1611974717482-58a25a9211c2?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Dashboard Preview" 
                                    className="w-full h-full object-cover grayscale brightness-[0.1] opacity-30"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-background/80 border border-border px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl">
                                        <p className="text-primary font-mono text-sm tracking-tighter">pipsify_dashboard.exe initialized...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Features Section */}
                <section className="bg-card/50 border-y border-border py-24">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-left">
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Journal with Intent</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Track your emotions before and after every trade. Pinpoint exactly which psychological 
                                triggers lead to your biggest losses.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <PieChart className="h-6 w-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Advanced Analytics</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Visualise your performance based on mental state. Discover your "Green Zones" 
                                and learn when you should stay away from the charts.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <TrendingUp className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Consistent Growth</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Transform gambling into a disciplined business. Build a sustainable trading career 
                                by mastering the most important factor: your mind.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 border-t border-border/50">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>© 2026 Pipsify. Trading involves significant risk.</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
