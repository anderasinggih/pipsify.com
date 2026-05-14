import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdateLanguageForm({ className = '' }: { className?: string }) {
    const { auth } = usePage().props as any;
    const currentLocale = auth.locale || 'en';

    const { data, setData, post, processing } = useForm({
        locale: currentLocale,
    });

    const submit = (locale: string) => {
        setData('locale', locale);
        router.post(route('locale.update'), { locale }, {
            onSuccess: () => toast.success('Language updated successfully!'),
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Languages className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-foreground leading-none">Language Settings</h2>
                    <p className="text-[10px] text-muted-foreground mt-1">Choose your preferred language for the interface.</p>
                </div>
            </header>

            <div className="mt-4 space-y-3 max-w-xl">
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground">Select Language</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant={currentLocale === 'en' ? 'default' : 'outline'}
                            onClick={() => submit('en')}
                            className={cn(
                                "flex-1 h-9 font-bold rounded-xl text-[11px]",
                                currentLocale === 'en' ? "bg-primary shadow-lg shadow-primary/20" : "border-border hover:bg-secondary"
                            )}
                            disabled={processing}
                        >
                            English (US)
                        </Button>
                        <Button
                            variant={currentLocale === 'id' ? 'default' : 'outline'}
                            onClick={() => submit('id')}
                            className={cn(
                                "flex-1 h-9 font-bold rounded-xl text-[11px]",
                                currentLocale === 'id' ? "bg-primary shadow-lg shadow-primary/20" : "border-border hover:bg-secondary"
                            )}
                            disabled={processing}
                        >
                            Bahasa Indonesia
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
