<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use GuzzleHttp\Psr7\Query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $roleFilter = $request->input('role', 'all');

        $users = User::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($roleFilter !== 'all', function ($query) use ($roleFilter) {
                $query->where('role', $roleFilter);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $roles = [
            ['id' => 1, 'nama_role' => 'admin'],
            ['id' => 2, 'nama_role' => 'petugas'],
            ['id' => 3, 'nama_role' => 'owner'],
        ];

        return Inertia::render('admin/user/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
            ],
            'roles' => $roles,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create(){
        $roles = [
            ['id' => 1, 'nama_role' => 'admin'],
            ['id' => 2, 'nama_role' => 'petugas'],
            ['id' => 3, 'nama_role' => 'owner'],
        ];

        return Inertia::render('admin/user/create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request){

        $validated = $request->validate([
            'name'=> 'required|string|max:255',
            'email'=> 'required|string|email|max:255|unique:users',
            'password'=> 'required|string|min:8|confirmed',
            'role'=> 'required|in:admin,petugas,owner',
        ],[
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
        ]);

        User::create([
            'name'=> $validated['name'],
            'email'=> $validated['email'],
            'password'=>Hash::make($validated['password']),
            'role'=> $validated['role'],
        ]);

        return redirect()->route('admin.users.index')->with('success', ' User berhasil ditambahkan.');
    }

    public function destroy(User $user)
    {
        // Cek jangan hapus diri sendiri
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Tidak bisa menghapus akun sendiri! ⚠️');
        }

        // Hapus user
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User berhasil dihapus! 🗑️');
    }

    public function edit(User $user)
    {
        $roles = [
            ['id' => 1, 'nama_role' => 'admin'],
            ['id' => 2, 'nama_role' => 'petugas'],
            ['id' => 3, 'nama_role' => 'owner'],
        ];

        return Inertia::render('admin/user/update', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'=> 'required|string|max:255',
            'email'=> 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password'=> 'nullable|string|min:8|confirmed',
            'role'=> 'required|in:admin,petugas,owner',
        ],[
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.min' => 'Password minimal 8 karakter',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'User berhasil diperbarui.');
    }
}
