<?php

namespace App\Http\Controllers;

use App\Models\TradeAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TradeAccountController extends Controller
{
    public function switch(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:trade_accounts,id',
        ]);

        $account = TradeAccount::where('id', $request->id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        session(['active_trade_account_id' => $account->id]);

        return back()->with('success', "Switched to account: {$account->name}");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'currency' => 'required|string|size:3',
            'initial_balance' => 'required|numeric|min:0',
        ]);

        $account = Auth::user()->tradeAccounts()->create($validated);
        
        session(['active_trade_account_id' => $account->id]);

        return back()->with('success', 'Trade account created successfully.');
    }
}
