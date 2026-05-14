<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Strategy;
use App\Models\Trade;
use App\Models\TradeAccount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a Pro User for demo
        $proUser = User::factory()->create([
            'name' => 'Pro Trader',
            'email' => 'pro@pipsify.com',
            'password' => Hash::make('password'),
            'is_pro' => true,
        ]);

        // Create a Free User for demo
        $freeUser = User::factory()->create([
            'name' => 'Free Trader',
            'email' => 'free@pipsify.com',
            'password' => Hash::make('password'),
            'is_pro' => false,
        ]);

        foreach ([$proUser, $freeUser] as $user) {
            // Create Trade Accounts
            $usdAccount = TradeAccount::create([
                'user_id' => $user->id,
                'name' => 'Main USD Account',
                'currency' => 'USD',
                'initial_balance' => 1000,
            ]);

            $idrAccount = TradeAccount::create([
                'user_id' => $user->id,
                'name' => 'Indo Stocks (IDR)',
                'currency' => 'IDR',
                'initial_balance' => 10000000,
            ]);

            // Create strategies for user
            $strategies = Strategy::factory()->count(4)->create([
                'user_id' => $user->id
            ]);

            // Create trades for each account
            foreach ([$usdAccount, $idrAccount] as $account) {
                foreach ($strategies as $strategy) {
                    Trade::factory()->count(rand(3, 5))->create([
                        'user_id' => $user->id,
                        'strategy_id' => $strategy->id,
                        'trade_account_id' => $account->id,
                        'entry_price' => $account->currency === 'IDR' ? rand(500, 5000) : rand(50, 500),
                    ]);
                }
            }
        }
    }
}
