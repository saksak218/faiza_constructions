<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
public function index(Request $request)
{
    $query = User::query();

    $sortableColumns = ['name', 'email', 'created_at']; // Define allowed columns
    $sortColumn = $request->input('sort', 'created_at');
    $sortDirection = $request->input('direction', 'desc');

    // Validate sort column and direction
    if (in_array($sortColumn, $sortableColumns)) {
        $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
    }

    $users = $query->paginate(10)->appends($request->query());

    return Inertia::render('Admin/Users/Index', [
        'users' => $users,
        'sort' => $sortColumn,
        'direction' => $sortDirection
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 2,
        ]);

        return redirect()->back()->with('message', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => $request->filled('password') ? [
                'string',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ] : ['nullable'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->back()->with('message', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('message', 'User deleted successfully');
    }

}
