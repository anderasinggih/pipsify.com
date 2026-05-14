<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MarketDataService
{
    /**
     * Map common symbols to Yahoo Finance symbols.
     */
    protected $symbolMap = [
        'XAUUSD' => 'GC=F',
        'BTCUSD' => 'BTC-USD',
        'EURUSD' => 'EURUSD=X',
        'GBPUSD' => 'GBPUSD=X',
        'USDJPY' => 'JPY=X', // JPY=X in Yahoo is USD/JPY
        'ETHUSD' => 'ETH-USD',
    ];

    /**
     * Fetch the current market price for a given pair.
     */
    public function getCurrentPrice(string $pair): ?float
    {
        $yahooSymbol = $this->symbolMap[$pair] ?? $pair;

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ])->get("https://query1.finance.yahoo.com/v8/finance/chart/{$yahooSymbol}");

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['chart']['result'][0]['meta']['regularMarketPrice'])) {
                    return (float) $data['chart']['result'][0]['meta']['regularMarketPrice'];
                }
            } else {
                Log::warning("Yahoo Finance API failed for {$yahooSymbol}: " . $response->status());
            }
        } catch (\Exception $e) {
            Log::error("Exception fetching price for {$yahooSymbol}: " . $e->getMessage());
        }

        return null;
    }
}
