<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ConstructionJobController;
use App\Http\Controllers\ProfileController;
use App\Models\ConstructionJob;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Naye controllers ke liye use statements
use App\Http\Controllers\Admin\LeadGeneratorController;
use App\Http\Controllers\Admin\SurveyorController;
use App\Http\Controllers\Admin\InstallationSupervisorController;
use App\Http\Controllers\Admin\MeasureInstallerController;
use App\Http\Controllers\UserJobController; // Naya controller import karein
use App\Http\Controllers\ComplaintController;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Admin panel ke routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', ['jobs' => ConstructionJob::all()]);
    })->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('jobs', ConstructionJobController::class);
    Route::resource('lead-generators', LeadGeneratorController::class);
    Route::resource('surveyors', SurveyorController::class);
    Route::resource('installation-supervisors', InstallationSupervisorController::class);
    Route::resource('measure-installers', MeasureInstallerController::class);
});

// User dashboard aur job management ke routes
Route::middleware(['auth', 'verified', 'user'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        $jobs = ConstructionJob::where('assigned_person_id', $user->id)->latest()->get();
        return Inertia::render('Users/Dashboard', ['jobs' => $jobs]);
    })->name('dashboard');

    // User ke liye job edit aur update ke naye routes
    Route::get('/jobs/{job}/edit', [UserJobController::class, 'edit'])->name('jobs.edit');
    
    // Purana PATCH route (ise rakha ja sakta hai agar kahin aur istemal ho raha ho)
    Route::patch('/jobs/{job}', [UserJobController::class, 'update'])->name('jobs.update');
    
    // File uploads ke liye naya POST route
    Route::post('/jobs/{job}', [UserJobController::class, 'update'])->name('jobs.update.post');
    // SIGNATURES UPDATE KARNE KE LIYE NAYA ROUTE YAHAN ADD KAREIN
    Route::put('/jobs/{job}/signatures', [UserJobController::class, 'updateSignatures'])->name('jobs.signatures.update');
});
// ...
Route::post('/jobs/{job}/complaints', [ComplaintController::class, 'store'])->name('complaints.store');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';