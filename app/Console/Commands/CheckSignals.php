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
        $signals = Signal::whereIn('status', ['pending', 'active'])->get();

        if ($signals->isEmpty()) {
            $this->info('No pending or active signals to check.');
            return;
        }

        $this->info("Checking {$signals->count()} signals...");

        foreach ($signals as $signal) {
            $currentPrice = $marketData->getCurrentPrice($signal->pair);

            if ($currentPrice === null) {
                $this->warn("Could not fetch price for {$signal->pair}, skipping...");
                continue;
            }

            $this->line("{$signal->pair} ({$signal->direction}) | Status: {$signal->status} | Entry: {$signal->entry_price} | Current: {$currentPrice}");

            $status = $signal->status;
            $pnl = 0;

            if ($status === 'pending') {
                // Check expiry
                if ($signal->created_at->diffInMinutes(now()) >= 15) {
                    $status = 'invalid';
                } else {
                    // Check if entry triggered. A simplistic approach: 
                    // If it's a long, and price dropped to or below entry.
                    // If it's a short, and price rose to or above entry.
                    // Or if current price is just within 0.1% of entry.
                    // For simplicity, we assume if it crosses the entry, it's active.
                    if ($signal->direction === 'long' && $currentPrice <= $signal->entry_price) {
                        $status = 'active';
                    } elseif ($signal->direction === 'short' && $currentPrice >= $signal->entry_price) {
                        $status = 'active';
                    } else {
                        // For breakout strategies (buy stop/sell stop):
                        if ($signal->direction === 'long' && $currentPrice >= $signal->entry_price && $signal->entry_price > $marketData->getCurrentPrice($signal->pair) /* we don't have historical so we just use a small buffer */) {
                            $buffer = $signal->entry_price * 0.001; // 0.1% buffer
                            if (abs($currentPrice - $signal->entry_price) <= $buffer) {
                                $status = 'active';
                            }
                        }
                        
                        // Simplest: If price is within 0.1% of entry, trigger it!
                        $diffPercent = abs($currentPrice - $signal->entry_price) / $signal->entry_price;
                        if ($diffPercent <= 0.001) {
                            $status = 'active';
                        }
                    }
                }
            } elseif ($status === 'active') {
                // Check TP / SL
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
            }

            if ($status !== $signal->status) {
                $updateData = ['status' => $status];
                if ($status === 'won_tp1' || $status === 'won_tp2' || $status === 'lost') {
                    $updateData['pnl'] = $pnl;
                }
                
                $signal->update($updateData);
                $this->info("Signal #{$signal->id} updated to {$status}");
            }
        }
        
        $this->info('Done checking signals.');
    }
}
