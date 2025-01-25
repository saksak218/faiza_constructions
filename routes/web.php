<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ConstructionJobController;
use App\Http\Controllers\ProfileController;
use App\Models\ConstructionJob;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    // Route::view('/dashboard', 'admin/Dashboard')
    //     ->name('admin.dashboard');

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', ['jobs' => ConstructionJob::all()]);
    })->name('admin.dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');



    Route::get('/jobs', [ConstructionJobController::class, 'index'])->name('admin.jobs');
    Route::post('/jobs', [ConstructionJobController::class, 'store'])->name('admin.jobs.store');
    Route::put('/jobs/{job}', [ConstructionJobController::class, 'update'])->name('admin.jobs.update');
    Route::delete('/jobs/{job}', [ConstructionJobController::class, 'destroy'])->name('admin.jobs.destroy');

});

Route::get('/dashboard', function () {
    return Inertia::render('Users/Dashboard');
})->middleware(['auth', 'verified', 'user'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
