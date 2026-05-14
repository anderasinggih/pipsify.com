<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Setting;
use App\Models\Signal;
use Carbon\Carbon;
use Inertia\Inertia;

class SignalController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $freeLimit = (int) Setting::where('key', 'free_limit')->value('value') ?: 3;
        $proLimit = (int) Setting::where('key', 'pro_limit')->value('value') ?: 10;
        
        $limit = $user->is_pro ? $proLimit : $freeLimit;

        // Fetch today's signals, ordered by creation time
        $signals = Signal::whereDate('created_at', Carbon::today())
            ->orderBy('created_at', 'asc')
            ->take($limit)
            ->get();
            
        // Also get historical results (only won/lost) for statistics
        $history = Signal::whereIn('status', ['won', 'lost'])
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

        return Inertia::render('Signals', [
            'signals' => $signals,
            'history' => $history,
            'limit_reached' => false, // We can determine this in frontend if signals.length >= limit
            'free_limit' => $freeLimit,
            'pro_limit' => $proLimit
        ]);
    }
}

