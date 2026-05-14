<?php

namespace App\Http\Controllers;

use App\Models\Trade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $activeAccountId = session('active_trade_account_id');
        
        // Filter trades by active account
        $query = $user->trades()->latest();
        if ($activeAccountId) {
            $query->where('trade_account_id', $activeAccountId);
        }
        
        $trades = $query->get();
        
        $totalTrades = $trades->count();
        $wins = $trades->where('status', 'win')->count();
        $winRate = $totalTrades > 0 ? round(($wins / $totalTrades) * 100, 2) : 0;
        $totalNetPnl = $trades->sum('net_pnl');

        $recentTrades = $trades->take(5);

        $analytics = [];
        if ($user->is_pro) {
            // Group PnL by mistakes
            $mistakesData = [];
            foreach ($trades as $trade) {
                if ($trade->mistakes_made) {
                    foreach ($trade->mistakes_made as $mistake) {
                        $mistakesData[$mistake] = ($mistakesData[$mistake] ?? 0) + (float)$trade->net_pnl;
                    }
                }
            }
            $analytics['mistakes_pnl'] = collect($mistakesData)->map(fn($pnl, $name) => [
                'name' => ucwords(str_replace('_', ' ', $name)),
                'value' => $pnl
            ])->values();

            // Win rate by pre-trade emotion
            $analytics['emotion_win_rate'] = $trades->groupBy('pre_trade_emotion')->map(function($group) {
                $total = $group->count();
                $wins = $group->where('status', 'win')->count();
                return [
                    'name' => ucfirst($group->first()->pre_trade_emotion),
                    'value' => round(($wins / $total) * 100, 2)
                ];
            })->values();
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_trades' => $totalTrades,
                'win_rate' => $winRate,
                'total_pnl' => (float)$totalNetPnl,
            ],
            'recent_trades' => $recentTrades,
            'analytics' => $analytics,
        ]);
    }
}
