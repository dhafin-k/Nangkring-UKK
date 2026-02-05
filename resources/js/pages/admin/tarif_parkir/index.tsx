import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Search, MapPin, Save, DollarSign } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface TarifParkir {
    id: number;
    jenis_kendaraan_id: number;
    jenis_kendaraan?: {
        id: number;
        nama_jenis_kendaraan: string;
    };
    tarif_per_jam: number;
    created_at: string;
}

interface JenisKendaraan {
    id: number;
    nama_jenis_kendaraan: string;
}

interface Props {
    tarifParkir: {
        data: TarifParkir[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    jenisKendaraan: JenisKendaraan[];
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
        title: 'Manage Tarif Parkir',
        href: '/admin/tarif-parkir'
    }
];

// Helper function to format Rupiah with dot separator
const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Helper function to parse formatted input back to number
const parseFormattedNumber = (value: string): string => {
    return value.replace(/\./g, '');
};

// Helper function to format input as user types
const formatInputValue = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return formatRupiah(parseInt(numericValue));
};

export default function TarifParkirIndex({ tarifParkir, filters, flash, jenisKendaraan }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        jenis_kendaraan_id: '',
        tarif_per_jam: '',
    });

    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        jenis_kendaraan_id: '',
        tarif_per_jam: ''
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

    // Debounced search effect
    useEffect(() => {
        // Skip on initial render if search is empty
        if (searchTerm === filters.search) return;

        setIsSearching(true);
        const debounceTimer = setTimeout(() => {
            router.get('/admin/tarif-parkir', {
                search: searchTerm,
            }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            });
        }, 1500); // 2 second delay

        return () => {
            clearTimeout(debounceTimer);
            setIsSearching(false);
        };
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Form submit will trigger immediate search
        router.get('/admin/tarif-parkir', {
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/tarif-parkir', {
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
        const numericTarif = parseFormattedNumber(createData.tarif_per_jam);

        // Create clean data object
        const submitData = {
            jenis_kendaraan_id: createData.jenis_kendaraan_id,
            tarif_per_jam: numericTarif
        };

        // Submit using router.post with clean data
        router.post('/admin/tarif-parkir', submitData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            },
            onError: (errors) => {
                // Errors will be handled automatically
                console.error('Validation errors:', errors);
            }
        });
    }


    const handleEdit = (item: TarifParkir) => {
        setEditId(item.id);
        setData({
            jenis_kendaraan_id: item.jenis_kendaraan_id.toString(),
            tarif_per_jam: formatRupiah(item.tarif_per_jam),
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const numericTarif = parseFormattedNumber(data.tarif_per_jam);

        // Create clean data object
        const submitData = {
            jenis_kendaraan_id: data.jenis_kendaraan_id,
            tarif_per_jam: numericTarif
        };

        // Submit using router.put with clean data
        router.put(`/admin/tarif-parkir/${editId}`, submitData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
            onError: (errors) => {
                // Errors will be handled automatically
                console.error('Validation errors:', errors);
            }
        });
    };

    const handleDelete = (tarifParkirId: number) => {
        setDeleteId(null);
        router.delete(`/admin/tarif-parkir/${tarifParkirId}`, {
            onSuccess: () => {
                setToastMessage('Tarif parkir berhasil dihapus!');
                setToastType('success');
                setShowToast(true);
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal menghapus tarif parkir';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    const handleTarifInputChange = (value: string, isCreate: boolean = false) => {
        const formatted = formatInputValue(value);
        if (isCreate) {
            setCreateData('tarif_per_jam', formatted);
        } else {
            setData('tarif_per_jam', formatted);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Tarif Parkir' />
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
                        <h1 className='md:text-3xl text-xl font-bold tracking-tight'>Tarif Parkir</h1>
                        <Button
                            onClick={handleCreate}
                            className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                        >
                            <Plus className='md:h-4 md:w-4 h-4 w-4 md:mr-2' />
                            <span className='hidden md:inline'>Tambah Data</span>
                            <span className='inline md:hidden'>Tambah</span>
                        </Button>
                    </div>
                    <p className='text-muted-foreground sm:text-base text-sm'>Kelola tarif parkir untuk setiap jenis kendaraan</p>
                </div>

                {/* Search */}
                <div className='flex gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Cari Jenis Kendaraan...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10'
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </form>
                </div>

                <div className='rounded-md border bg-card'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>No</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Jenis Kendaraan</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Tarif Per Jam</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Dibuat</th>
                                    <th className='h-12 px-4 text-center align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {tarifParkir.data.map((item, index) => (
                                    <tr key={item.id} className='border-b transition-colors hover:bg-muted/50'>
                                        <td className='p-4 align-middle'>{(tarifParkir.current_page - 1) * tarifParkir.per_page + index + 1}</td>
                                        <td className='p-4 align-middle font-medium'>
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                {item.jenis_kendaraan?.nama_jenis_kendaraan || 'Unknown'}
                                            </Badge>
                                        </td>

                                        <td className='p-4 align-middle font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <DollarSign className='h-4 w-4 text-muted-foreground' />
                                                <span className="font-mono">Rp {formatRupiah(item.tarif_per_jam)}</span>
                                            </div>
                                        </td>

                                        <td className='p-4 align-middle text-muted-foreground'>
                                            {new Date(item.created_at).toLocaleDateString('id-ID', {
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
                                                    onClick={() => handleEdit(item)}
                                                    className='hover:bg-primary/10 hover:text-primary transition-colors'
                                                >
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size="icon"
                                                    onClick={() => setDeleteId(item.id)}
                                                    className='hover:bg-destructive/10 hover:text-destructive transition-colors'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tarifParkir.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className='p-12'>
                                            <div className='flex flex-col items-center justify-center gap-4'>
                                                <div className='rounded-full bg-muted p-4'>
                                                    <MapPin className='h-8 w-8 text-muted-foreground' />
                                                </div>
                                                <div className='text-center'>
                                                    <h3 className='font-semibold text-lg mb-1'>Belum Ada Tarif Parkir</h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        Mulai dengan menambahkan tarif parkir pertama Anda
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => setIsCreateModalOpen(true)}
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
                        Menampilkan {tarifParkir.from || 0} sampai {tarifParkir.to || 0} dari {tarifParkir.total} hasil
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(tarifParkir.current_page - 1);
                                    }}
                                    className={tarifParkir.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {(() => {
                                const pages = [];
                                const startPage = Math.max(1, tarifParkir.current_page - 1);
                                const endPage = Math.min(tarifParkir.last_page, tarifParkir.current_page + 1);
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
                                                isActive={page === tarifParkir.current_page}
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
                                        handlePageChange(tarifParkir.current_page + 1);
                                    }}
                                    className={tarifParkir.current_page === tarifParkir.last_page ? 'pointer-events-none opacity-50' : ''}
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
                    <DialogContent className="sm:max-w-100">
                        <DialogHeader>
                            <DialogTitle>Edit Tarif Parkir</DialogTitle>
                            <DialogDescription>
                                Perbarui informasi tarif parkir di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_jenis_kendaraan">Jenis Kendaraan</Label>
                                <Select
                                    value={data.jenis_kendaraan_id}
                                    onValueChange={(value) => setData('jenis_kendaraan_id', value)}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Pilih Jenis Kendaraan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jenisKendaraan.map((jenis) => (
                                            <SelectItem key={jenis.id} value={jenis.id.toString()}>
                                                {jenis.nama_jenis_kendaraan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.jenis_kendaraan_id && <p className="text-sm text-red-500">{errors.jenis_kendaraan_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_tarif">Tarif Per Jam</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">Rp</span>
                                    <Input
                                        id="edit_tarif"
                                        type="text"
                                        value={data.tarif_per_jam}
                                        onChange={(e) => handleTarifInputChange(e.target.value, false)}
                                        placeholder="0"
                                        className="pl-10 font-mono"
                                    />
                                </div>
                                {errors.tarif_per_jam && <p className="text-sm text-red-500">{errors.tarif_per_jam}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700">
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Create */}
                <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateModalOpen(false);
                        resetCreate();
                    }
                }}>
                    <DialogContent className="sm:max-w-100">
                        <DialogHeader>
                            <DialogTitle>Tambah Tarif Parkir Baru</DialogTitle>
                            <DialogDescription>Isi informasi tarif parkir di bawah ini.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleStore} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="create_jenis_kendaraan">
                                    Jenis Kendaraan <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={createData.jenis_kendaraan_id}
                                    onValueChange={(value) => setCreateData('jenis_kendaraan_id', value)}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Pilih Jenis Kendaraan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jenisKendaraan.map((jenis) => (
                                            <SelectItem key={jenis.id} value={jenis.id.toString()}>
                                                {jenis.nama_jenis_kendaraan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createErrors.jenis_kendaraan_id && <p className="text-sm text-red-500">{createErrors.jenis_kendaraan_id}</p>}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='create_tarif'>
                                    Tarif Per Jam <span className='text-red-500'>*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">Rp</span>
                                    <Input
                                        id="create_tarif"
                                        type="text"
                                        value={createData.tarif_per_jam}
                                        onChange={(e) => handleTarifInputChange(e.target.value, true)}
                                        placeholder='0'
                                        className="pl-10 font-mono"
                                    />
                                </div>
                                {createErrors.tarif_per_jam && <p className="text-sm text-red-500">{createErrors.tarif_per_jam}</p>}
                            </div>
                            <DialogFooter>
                                <Button type='button' variant='outline' onClick={() => setIsCreateModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type='submit' disabled={createProcessing} className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'>
                                    <Save className='h-4 w-4 mr-2' />
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
                            <AlertDialogTitle>Hapus Tarif Parkir?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus tarif parkir ini? Tindakan ini tidak dapat dibatalkan.
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
