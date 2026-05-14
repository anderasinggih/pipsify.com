<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Signal;
use App\Services\MarketDataService;

class CheckSignals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'signals:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check active signals against current market prices to automatically update their status (won/lost)';

    /**
     * Execute the console command.
     */
    public function handle(MarketDataService $marketData)
    {
        $activeSignals = Signal::where('status', 'active')->get();

        if ($activeSignals->isEmpty()) {
            $this->info('No active signals to check.');
            return;
        }

        $this->info("Checking {$activeSignals->count()} active signals...");

        foreach ($activeSignals as $signal) {
            $currentPrice = $marketData->getCurrentPrice($signal->pair);

            if ($currentPrice === null) {
                $this->warn("Could not fetch price for {$signal->pair}, skipping...");
                continue;
            }

            $this->line("{$signal->pair} ({$signal->direction}) | Entry: {$signal->entry_price} | Current: {$currentPrice}");

            $status = 'active';
            $pnl = 0; // simplistic PnL calculation based on raw price diff

            if ($signal->direction === 'long') {
                if ($currentPrice <= $signal->stop_loss) {
                    $status = 'lost';
                    $pnl = $currentPrice - $signal->entry_price;
                } elseif ($signal->tp_2 && $currentPrice >= $signal->tp_2) {
                    $status = 'won_tp2';
                    $pnl = $signal->tp_2 - $signal->entry_price;
                } elseif ($currentPrice >= $signal->tp_1) {
                    $status = 'won_tp1';
                    $pnl = $signal->tp_1 - $signal->entry_price;
                }
            } else { // short
                if ($currentPrice >= $signal->stop_loss) {
                    $status = 'lost';
                    $pnl = $signal->entry_price - $currentPrice;
                } elseif ($signal->tp_2 && $currentPrice <= $signal->tp_2) {
                    $status = 'won_tp2';
                    $pnl = $signal->entry_price - $signal->tp_2;
                } elseif ($currentPrice <= $signal->tp_1) {
                    $status = 'won_tp1';
                    $pnl = $signal->entry_price - $signal->tp_1;
                }
            }

            if ($status !== 'active') {
                // If the migration used 'won' and 'lost', we map 'won_tp1' and 'won_tp2' to 'won' if needed,
                // but since we updated the enum to string, we can store 'won_tp1' and 'won_tp2' directly!
                // However, for UI simplicity, if the frontend only checks === 'won', we might just save 'won'
                // and maybe store a note. Let's just save the specific status so the UI can show "WON (TP1)"
                $signal->update([
                    'status' => $status,
                    'pnl' => $pnl,
                ]);
                $this->info("Signal #{$signal->id} updated to {$status} with PnL {$pnl}");
            }
        }
        
        $this->info('Done checking signals.');
    }
}
