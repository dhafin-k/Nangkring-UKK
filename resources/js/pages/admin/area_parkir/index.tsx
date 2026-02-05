import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Search, MapPin, Users, Save } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface AreaParkir {
    id: number;
    nama_area: string;
    kapasitas: number;
    terisi: number;
    created_at: string;
}

interface Props {
    areaParkir: {
        data: AreaParkir[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
    };
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
    }
];

export default function AreaParkirIndex({ areaParkir, filters, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        nama_area: '',
        kapasitas: '',
    });

    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate} = useForm ({
        nama_area: '',
        kapasitas:''
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

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/admin/area-parkir', {
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/area-parkir', {
            page,
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        resetCreate();
        setIsCreateModalOpen(true);
    }

    const handleStore = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/area-parkir', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal menambahkan area parkir';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    }

    const handleEdit = (area: AreaParkir) => {
        setEditId(area.id);
        setData({
            nama_area: area.nama_area,
            kapasitas: area.kapasitas.toString(),
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/area-parkir/${editId}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal memperbarui area parkir';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    const handleDelete = (areaId: number) => {
        setDeleteId(null);
        router.delete(`/admin/area-parkir/${areaId}`, {
            onSuccess: () => {
                setToastMessage('Area parkir berhasil dihapus!');
                setToastType('success');
                setShowToast(true);
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal menghapus area parkir';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    const getStatusBadge = (terisi: number, kapasitas: number) => {
        const sisaSlot = kapasitas - terisi;

        // Jika penuh (terisi >= kapasitas)
        if (terisi >= kapasitas) {
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
        // Jika sisa slot <= 2 atau sisa slot <= 10% dari kapasitas
        else if (sisaSlot <= 2 || sisaSlot <= kapasitas * 0.1) {
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        }
        // Jika terisi > 0 (ada yang parkir)
        else if (terisi > 0) {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        }
        // Jika kosong (terisi = 0)
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    };

    const getStatusText = (terisi: number, kapasitas: number) => {
        const sisaSlot = kapasitas - terisi;

        // Jika penuh (terisi >= kapasitas)
        if (terisi >= kapasitas) {
            return 'Penuh';
        }
        // Jika sisa slot <= 2 atau sisa slot <= 10% dari kapasitas
        else if (sisaSlot <= 2 || sisaSlot <= kapasitas * 0.1) {
            return 'Hampir Penuh';
        }
        // Jika terisi > 0 (ada yang parkir)
        else if (terisi > 0) {
            return 'Tersedia';
        }
        // Jika kosong (terisi = 0)
        return 'Kosong';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Area Parkir' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-linear-to-br from-background to-muted/20'>

                {/* Toast Notification */}
                {showToast && (
                    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white animate-in fade-in slide-in-from-top-5`}>
                        {toastType === 'success' ? (
                            <CheckCircle2 className='h-5 w-5' />
                        ) : (
                            <XCircle className='h-5 w-5' />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className='md:flex md:flex-col md:gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='md:text-3xl text-xl font-bold tracking-tight'>Area Parkir</h1>
                        <Button
                            onClick={handleCreate}
                            className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                        >
                            <Plus className='md:h-4 md:w-4 h-1 w-1 md:mr-2 mr-0' />
                            Tambah Data
                        </Button>
                    </div>
                    <p className='text-muted-foreground sm:text-base text-sm'>Kelola area parkir dan kapasitas</p>
                </div>

                {/* Search */}
                <div className='flex gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Cari Area Parkir...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10'
                        />
                    </form>
                </div>

                <div className='rounded-md border'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>No</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Nama Area</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Kapasitas</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Terisi</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Status</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Dibuat</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {areaParkir.data.map((area, index) => (
                                    <tr key={area.id} className='border-b transition-colors hover:bg-muted/50'>
                                        <td className='p-4 align-middle font-medium'>{index + 1}</td>
                                        <td className='p-4 align-middle font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <MapPin className='h-4 w-4 text-muted-foreground' />
                                                {area.nama_area}
                                            </div>
                                        </td>

                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <Users className='h-4 w-4 text-muted-foreground' />
                                                {area.kapasitas}
                                            </div>
                                        </td>

                                        <td className='p-4 align-middle'>
                                            {area.terisi}
                                        </td>

                                        <td className='p-4 align-middle'>
                                            <Badge className={`${getStatusBadge(area.terisi, area.kapasitas)}`}>
                                                {getStatusText(area.terisi, area.kapasitas)}
                                            </Badge>
                                        </td>

                                        <td className='p-4 align-middle'>
                                            {new Date(area.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>

                                        <td className='p-4 align-middle'>
                                            <div className='flex justify-center gap-2'>
                                                <Button
                                                    size='icon'
                                                    variant='ghost'
                                                    onClick={() => handleEdit(area)}
                                                    className='hover:bg-primary/10 hover:text-primary'
                                                >
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size="icon"
                                                    onClick={() => setDeleteId(area.id)}
                                                    className='hover:bg-destructive/10 hover:text-destructive'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {areaParkir.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className='p-12'>
                                            <div className='flex flex-col items-center justify-center gap-4'>
                                                <div className='rounded-full bg-muted p-4'>
                                                    <MapPin className='h-8 w-8 text-muted-foreground' />
                                                </div>
                                                <div className='text-center'>
                                                    <h3 className='font-semibold text-lg mb-1'>Belum Ada Area Parkir</h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        Mulai dengan menambahkan area parkir pertama Anda
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => router.visit('/admin/area-parkir/create')}
                                                    className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                                >
                                                    <Plus className='h-4 w-4 mr-2' />
                                                    Tambahkan Data
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className='flex flex-col items-center justify-center gap-4 px-2 py-4'>
                    <div className='text-sm text-muted-foreground'>
                        Menampilkan {areaParkir.from || 0} sampai {areaParkir.to || 0} dari {areaParkir.total} hasil
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(areaParkir.current_page - 1);
                                    }}
                                    className={areaParkir.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {(() => {
                                const pages = [];
                                const startPage = Math.max(1, areaParkir.current_page - 1);
                                const endPage = Math.min(areaParkir.last_page, areaParkir.current_page + 1);
                                let lastRenderedPage = 0;

                                for (let page = startPage; page <= endPage; page++) {
                                    if (page > lastRenderedPage + 1) {
                                        pages.push(<PaginationItem key={`ellipsis-${lastRenderedPage}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>);
                                    }
                                    pages.push(
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === areaParkir.current_page}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(page);
                                                }}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                    lastRenderedPage = page;
                                }

                                return pages;
                            })()}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(areaParkir.current_page + 1);
                                    }}
                                    className={areaParkir.current_page === areaParkir.last_page ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                    if (!open) {
                        setIsEditModalOpen(false);
                        reset();
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Area Parkir</DialogTitle>
                            <DialogDescription>
                                Perbarui informasi area parkir di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_nama_area">Nama Area</Label>
                                <Input
                                    id="edit_nama_area"
                                    value={data.nama_area}
                                    onChange={(e) => setData('nama_area', e.target.value)}
                                    placeholder="Contoh: Area A, Lantai 1"
                                />
                                {errors.nama_area && <p className="text-sm text-red-500">{errors.nama_area}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_kapasitas">Kapasitas</Label>
                                <Input
                                    id="edit_kapasitas"
                                    type="number"
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', e.target.value)}
                                    placeholder="Masukkan kapasitas"
                                />
                                {errors.kapasitas && <p className="text-sm text-red-500">{errors.kapasitas}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700">
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Create */}
                <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
                    if(!open) {
                        setIsCreateModalOpen(false);
                        resetCreate();
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Area Parkir Baru</DialogTitle>
                            <DialogDescription>Isi informasi area parkir di bawah ini.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleStore} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor='create_nama_area'>
                                    Nama Area <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id="create_nama_area"
                                    value={createData.nama_area}
                                    onChange={(e) => setCreateData('nama_area', e.target.value)}
                                    placeholder='Contoh: Area A, Lantai 1'
                                />
                                {createErrors.nama_area && <p className="text-sm text-red-500">{createErrors.nama_area}</p>}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='create_kapasitas'>
                                    Kapasitas <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id="create_kapasitas"
                                    type="number"
                                    min={1}
                                    value={createData.kapasitas}
                                    onChange={(e) => setCreateData('kapasitas', e.target.value)}
                                    placeholder='Masukkan kapasitas'
                                />
                                {createErrors.kapasitas && <p className="text-sm text-red-500">{createErrors.kapasitas}</p>}
                                <p className='md:text-xs text-muted-foreground'>
                                    Kapasitas maksimal adalah 100
                                </p>
                            </div>
                            <DialogFooter>
                                <Button type='button' variant='outline' onClick={() =>setIsCreateModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type='submit' variant='outline' className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'>
                                    <Save className='md:h-4 md:w-4 mr-0 md:mr-2 h-2 w-2'/>
                                    {createProcessing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Alert Dialog Delete */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Area Parkir?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus area parkir ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && handleDelete(deleteId)}
                                className='bg-destructive text-white hover:bg-destructive/90'
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
