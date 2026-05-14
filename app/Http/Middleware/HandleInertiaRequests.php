<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $tradeAccounts = $user ? $user->tradeAccounts()->orderBy('name')->get() : [];
        
        // Determine active account (store in session for now)
        $activeAccountId = session('active_trade_account_id');
        $activeAccount = null;
        
        if ($user) {
            if ($activeAccountId) {
                $activeAccount = $tradeAccounts->where('id', $activeAccountId)->first();
            }
            
            if (!$activeAccount && $tradeAccounts->count() > 0) {
                $activeAccount = $tradeAccounts->first();
                session(['active_trade_account_id' => $activeAccount->id]);
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'trade_accounts' => $tradeAccounts,
                'active_trade_account' => $activeAccount,
                'locale' => app()->getLocale(),
                'is_admin' => $request->session()->get('admin_authenticated') === true,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ];
    }
}
