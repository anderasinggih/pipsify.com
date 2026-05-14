<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\StrategyController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TradeAccountController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\SignalController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('trades', TradeController::class);
    Route::get('/journal', [TradeController::class, 'index'])->name('journal');
    
    Route::post('/strategies', [StrategyController::class, 'store'])->name('strategies.store');
    
    Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade'])->name('subscription.upgrade');

    // Signals
    Route::get('/signals', [SignalController::class, 'index'])->name('signals.index');

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
        Route::post('/signals/generate', [AdminController::class, 'generateSignal'])->name('signals.generate');
        Route::patch('/signals/{signal}', [AdminController::class, 'updateSignal'])->name('signals.update');
    });

    // Trade Accounts
    Route::post('/trade-accounts/switch', [TradeAccountController::class, 'switch'])->name('trade-accounts.switch');
    Route::post('/trade-accounts', [TradeAccountController::class, 'store'])->name('trade-accounts.store');

    Route::post('/locale', function(\Illuminate\Http\Request $request) {
        $request->validate(['locale' => 'required|in:en,id']);
        session(['locale' => $request->locale]);
        return back();
    })->name('locale.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Admin Auth Routes (Standalone)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminAuthController::class, 'create'])->name('login');
    Route::post('login', [AdminAuthController::class, 'store'])->name('login.store');
    Route::post('logout', [AdminAuthController::class, 'destroy'])->name('logout');
});
