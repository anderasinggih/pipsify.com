<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\StrategyController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TradeAccountController;
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
