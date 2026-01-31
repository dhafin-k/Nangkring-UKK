import React, { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, CheckCircle2, XCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react'

interface Props {
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Area Parkir',
        href: '/admin/area-parkir'
    },
    {
        title: 'Tambah Area Parkir',
        href: '/admin/area-parkir/create'
    }
]

export default function AreaParkirCreate({ errors, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const { data, setData, post, processing } = useForm({
        nama_area: '',
        kapasitas: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Data yang dikirim:', data);

        post('/admin/area-parkir', {
            onError: (errors) => {
                console.log('Error:', errors);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Tambah Area Parkir' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-linear-to-br from-background to-muted/20'>

                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Tambah Area Parkir Baru</h1>
                        <p className='text-muted-foreground mt-1'>Isi form berikut untuk menambahkan area parkir baru</p>
                    </div>
                    <Button
                        variant='outline'
                        onClick={() => router.visit('/admin/area-parkir')}
                    >
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Kembali
                    </Button>
                </div>

                {/* Form Card */}
                <Card className=' w-full'>
                    <CardHeader>
                        <CardTitle>Informasi Area Parkir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Nama Area */}
                            <div className='space-y-2'>
                                <Label htmlFor='nama_area'>
                                    Nama Area <span className='text-destructive'>*</span>
                                </Label>
                                <Input
                                    id='nama_area'
                                    value={data.nama_area}
                                    onChange={(e) => setData('nama_area', e.target.value)}
                                    placeholder='Contoh: Area A, Lantai 1, dll'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.nama_area && (
                                    <p className='text-destructive text-sm'>{errors.nama_area}</p>
                                )}
                            </div>

                            {/* Kapasitas */}
                            <div className='space-y-2'>
                                <Label htmlFor='kapasitas'>
                                    Kapasitas <span className='text-destructive'>*</span>
                                </Label>
                                <Input
                                    id='kapasitas'
                                    type='number'
                                    min='1'
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', e.target.value)}
                                    placeholder='Masukkan jumlah kapasitas'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.kapasitas && (
                                    <p className='text-destructive text-sm'>{errors.kapasitas}</p>
                                )}
                                <p className='text-xs text-muted-foreground'>Jumlah maksimal kendaraan yang dapat parkir di area ini</p>
                            </div>

                            {/* Buttons */}
                            <div className='flex gap-3 pt-4 justify-end'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => router.visit('/admin/area-parkir')}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={processing}
                                    className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                >
                                    <Save className='h-4 w-4 mr-2' />
                                    {processing ? 'Menyimpan...' : 'Simpan Area Parkir'}
                                </Button>

                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
