<?php

namespace App\Http\Controllers;

use App\Models\Trade;
use App\Models\Strategy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TradeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $activeAccountId = session('active_trade_account_id');

        $query = $user->trades()->with('strategy')->latest();
        
        if ($activeAccountId) {
            $query->where('trade_account_id', $activeAccountId);
        }

        return Inertia::render('Journal', [
            'trades' => $query->get(),
            'strategies' => $user->strategies()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $activeAccountId = session('active_trade_account_id');

        // Pro check for trade limit
        if (!$user->is_pro && $user->trades()->count() >= 20) {
            return back()->with('error', 'You have reached the 20-trade limit for Free accounts. Upgrade to Pro for unlimited journaling.');
        }

        $validated = $request->validate([
            'ticker' => 'required|string|max:10',
            'direction' => 'required|in:long,short',
            'status' => 'required|in:win,loss,breakeven,open',
            'entry_price' => 'required|numeric',
            'exit_price' => 'nullable|numeric',
            'quantity' => 'required|numeric',
            'strategy_id' => 'nullable|exists:strategies,id',
            'pre_trade_emotion' => 'required|string',
            'post_trade_emotion' => 'nullable|string',
            'mistakes_made' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $trade = new Trade($validated);
        $trade->user_id = $user->id;
        $trade->trade_account_id = $activeAccountId;
        
        if ($request->hasFile('chart_image') && $user->is_pro) {
            $path = $request->file('chart_image')->store('charts', 'public');
            $trade->chart_image_path = $path;
        }

        $trade->save();

        return back()->with('success', 'Trade logged successfully!');
    }

    public function update(Request $request, Trade $trade)
    {
        $this->authorizeTrade($trade);

        $validated = $request->validate([
            'status' => 'required|in:win,loss,breakeven,open',
            'exit_price' => 'nullable|numeric',
            'post_trade_emotion' => 'nullable|string',
            'mistakes_made' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $trade->update($validated);

        return back()->with('success', 'Trade updated successfully!');
    }

    public function destroy(Trade $trade)
    {
        $this->authorizeTrade($trade);
        $trade->delete();
        return back()->with('success', 'Trade deleted.');
    }

    protected function authorizeTrade(Trade $trade)
    {
        if ($trade->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
