"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, FileText, Car, MapPin, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
  totalTransaksi?: number;
  transaksiMasuk?: number;
  transaksiKeluar?: number;
  totalPendapatan?: number;
  totalKendaraan?: number;
  totalKapasitas?: number;
  totalTerisi?: number;
  kapasitasTersedia?: number;
  statistikArea?: any[];
  chartData?: any[];
  transaksiTerbaru?: any[];
}

export default function Dashboard({
  totalTransaksi = 0,
  transaksiMasuk = 0,
  transaksiKeluar = 0,
  totalPendapatan = 0,
  totalKendaraan = 0,
  totalKapasitas = 0,
  totalTerisi = 0,
  kapasitasTersedia = 0,
  statistikArea = [],
  chartData = [],
  transaksiTerbaru = [],
}: DashboardProps) {
    const percentageTerisi = totalKapasitas > 0 ? (totalTerisi / totalKapasitas) * 100 : 0;

    // Debug log
    console.log('Chart Data Received:', chartData);

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

                {/* Cards Stats */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {/* Total Transaksi */}
                    <Card className='relative aspect-video md:aspect-auto overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400'>
                                Total Transaksi
                            </CardTitle>
                            <div className='rounded-full bg-blue-500/20 p-2'>
                                <FileText className='h-5 w-5 text-blue-600 dark:text-blue-400'/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400'>{totalTransaksi}</div>
                            <p className='text-xs text-muted-foreground mt-2'>
                                <span className='text-yellow-600 dark:text-yellow-400 font-medium'>Masuk: {transaksiMasuk}</span>
                                <span className='mx-2'>•</span>
                                <span className='text-green-600 dark:text-green-400 font-medium'>Keluar: {transaksiKeluar}</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Pendapatan */}
                    <Card className='relative aspect-video md:aspect-auto overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm sm:text-base font-medium text-green-600 dark:text-green-400'>
                                Total Pendapatan
                            </CardTitle>
                            <div className='rounded-full bg-green-500/20 p-2'>
                                <DollarSign className='h-5 w-5 text-green-600 dark:text-green-400'/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400'>
                                Rp {new Intl.NumberFormat('id-ID').format(totalPendapatan)}
                            </div>
                            <p className='text-xs text-muted-foreground mt-2'>
                                Total pendapatan bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Kendaraan */}
                    <Card className='relative aspect-video md:aspect-auto overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm sm:text-base font-medium text-purple-600 dark:text-purple-400'>
                                Total Kendaraan
                            </CardTitle>
                            <div className='rounded-full bg-purple-500/20 p-2'>
                                <Car className='h-5 w-5 text-purple-600 dark:text-purple-400'/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400'>{totalKendaraan}</div>
                            <p className='text-xs text-muted-foreground mt-2'>
                                <span className='text-purple-600 dark:text-purple-400 font-medium'>Terdaftar dalam sistem</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Kapasitas Parkir */}
                    <Card className='relative aspect-video md:aspect-auto overflow-hidden bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm sm:text-base font-medium text-orange-600 dark:text-orange-400'>
                                Kapasitas Tersedia
                            </CardTitle>
                            <div className='rounded-full bg-orange-500/20 p-2'>
                                <MapPin className='h-5 w-5 text-orange-600 dark:text-orange-400'/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400'>{kapasitasTersedia} / {totalKapasitas}</div>
                            <div className='mt-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2'>
                                <div className='bg-orange-600 h-2 rounded-full transition-all duration-300' style={{ width: `${percentageTerisi}%` }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Chart Area */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Transaksi 12 Bulan Terakhir</CardTitle>
                            <CardDescription>
                                Grafik transaksi per bulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData && chartData.length > 0 ? (
                                <div className="w-full h-[300px] bg-white dark:bg-neutral-900 rounded-lg p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" />
                                            <XAxis
                                                dataKey="month"
                                                stroke="currentColor"
                                                className="text-neutral-600 dark:text-neutral-400"
                                            />
                                            <YAxis
                                                stroke="currentColor"
                                                className="text-neutral-600 dark:text-neutral-400"
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(0 0% 100%)',
                                                    border: '1px solid hsl(0 0% 90%)',
                                                    borderRadius: '8px',
                                                }}
                                                wrapperStyle={{
                                                    outline: 'none',
                                                }}
                                                formatter={(value) => [value, 'Transaksi']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="desktop"
                                                stroke="#3b82f6"
                                                fillOpacity={1}
                                                fill="url(#colorDesktop)"
                                                isAnimationActive={true}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                    Belum ada data transaksi
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full items-start gap-2 text-sm">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 leading-none font-medium">
                                        Trending up <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                        Data 12 bulan terakhir
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Area Stats Sidebar */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Statistik Area</CardTitle>
                            <CardDescription>Distribusi per lokasi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[320px] overflow-y-auto">
                                {statistikArea && statistikArea.length > 0 ? (
                                    statistikArea.map((area: any) => (
                                        <div key={area.id} className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{area.nama_area}</span>
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">{area.terisi}/{area.kapasitas}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Transaksi</span>
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{area.total_transaksi}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Pendapatan</span>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">Rp {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(area.pendapatan_area ?? 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center py-4">Belum ada area</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                        <CardDescription>5 transaksi terakhir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-neutral-200 dark:border-neutral-700">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">Plat Nomor</th>
                                        <th className="text-left py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">Area</th>
                                        <th className="text-left py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">Waktu Masuk</th>
                                        <th className="text-left py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                                        <th className="text-right py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">Biaya</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {transaksiTerbaru && transaksiTerbaru.length > 0 ? (
                                        transaksiTerbaru.map((transaksi: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">{transaksi.kendaraan?.plat_nomor}</td>
                                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{transaksi.areaParkir?.nama_area || transaksi.area_parkir?.nama_area}</td>
                                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                                                    {new Date(transaksi.waktu_masuk).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        transaksi.status === 'masuk'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                        {transaksi.status.charAt(0).toUpperCase() + transaksi.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                                                    {transaksi.biaya_total ? 'Rp ' + new Intl.NumberFormat('id-ID').format(transaksi.biaya_total) : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                                                Belum ada transaksi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
