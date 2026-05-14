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
            <header>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Language Settings
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Choose your preferred language for the application interface.
                </p>
            </header>

            <div className="mt-6 space-y-4 max-w-xl">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Language</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant={currentLocale === 'en' ? 'default' : 'outline'}
                            onClick={() => submit('en')}
                            className={cn(
                                "flex-1 h-12 font-bold rounded-2xl",
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
                                "flex-1 h-12 font-bold rounded-2xl",
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
