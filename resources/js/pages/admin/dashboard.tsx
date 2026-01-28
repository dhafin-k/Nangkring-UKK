import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                 <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
                        <p className='text-muted-foreground mt-1'>Selamat datang kembali, berikut tinjauan Anda</p>
                    </div>

                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>

                    <Card className='relative aspect-video md:aspect-auto overflow-hidden bg-linear-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm sm:text-base font-medium text-indigo-500'>
                                Monthly Revenue
                            </CardTitle>
                            <div className='rounded-full bg-indigo-500/20 p-2'>
                                <TrendingUp className='h-5 w-5 text-indigo-500'/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl sm:text-3xl font-bold text-indigo-500'>Rp2,450.000</div>
                            <p className='text-xs text-muted-foreground mt-2'>
                                <span className='text-indigo-500 font-medium'>+18.2%</span> dari bulan lalu
                            </p>
                        </CardContent>
                    </Card>
                    <Card className='relative aspect-video md:aspect-auto overflow-hidden bg-linear-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm sm:text-base font-medium text-indigo-500'>
                                Monthly Revenue
                            </CardTitle>
                            <div className='rounded-full bg-indigo-500/20 p-2'>
                                <TrendingUp className='h-4 w-4 text-indigo-500'/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl sm:text-3xl font-bold text-indigo-500'>Rp2,450.000</div>
                            <p className='text-xs text-muted-foreground mt-2'>
                                <span className='text-indigo-500 font-medium'>+18.2%</span> dari bulan lalu
                            </p>
                        </CardContent>
                    </Card>
                    <Card className='relative aspect-video md:aspect-auto overflow-hidden bg-linear-to-br from-green-500/10 to-green-600/10 border-green-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm sm:text-base font-medium text-green-500'>
                                Monthly Revenue
                            </CardTitle>
                            <div className='rounded-full bg-green-500/20 p-2'>
                                <TrendingUp className='h-4 w-4 text-green-500'/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl sm:text-3xl font-bold text-green-500'>Rp2,450.000</div>
                            <p className='text-xs text-muted-foreground mt-2'>
                                <span className='text-green-500 font-medium'>+18.2%</span> dari bulan lalu
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
