<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\MarketDataService;

class GeminiSignalService
{
    /**
     * Generate a new trading signal using Gemini AI
     */
    public function generateSignal()
    {
        $apiKey = Setting::where('key', 'gemini_api_key')->value('value');
        $allowedPairsJson = Setting::where('key', 'allowed_pairs')->value('value') ?? '["XAUUSD", "BTCUSD", "EURUSD"]';
        $language = Setting::where('key', 'language')->value('value') ?? 'en';
        
        if (empty($apiKey)) {
            Log::error('Gemini API Key is not set in Settings.');
            return null;
        }

        $allowedPairs = json_decode($allowedPairsJson, true);
        if (empty($allowedPairs)) {
            $allowedPairs = ["XAUUSD"];
        }

        // Randomly select a pair from the allowed pairs
        $pair = $allowedPairs[array_rand($allowedPairs)];

        // Fetch the REAL live price
        $marketData = new MarketDataService();
        $currentPrice = $marketData->getCurrentPrice($pair);
        
        $priceContext = "";
        if ($currentPrice) {
            $priceContext = "CRITICAL INSTRUCTION: The CURRENT EXACT REAL-TIME PRICE of {$pair} is {$currentPrice}. Your `entry_price` MUST be almost identical to {$currentPrice} (within 1-2 pips max) for an immediate market execution. Do NOT set pending orders far from this price.";
        } else {
            $priceContext = "CRITICAL INSTRUCTION: Ensure the `entry_price` reflects a highly realistic market level for 2026. Do NOT use outdated historical prices.";
        }

        $prompt = "You are an expert institutional trader operating in the year 2026. Analyze the current hypothetical market conditions for {$pair} and generate a highly probable trading signal. 
        {$priceContext}
        STRICT MATHEMATICAL RULES:
        1. Entry Price: Must be a market execution (nearly identical to the current price).
        2. Stop Loss (SL): MUST be strictly between 20 to 50 pips away from the entry price. Calculate this accurately based on the asset type (e.g. standard pip calculation for forex, absolute dollar distance for commodities/crypto).
        3. Risk/Reward (RR): MUST be between 1:1.5 minimum and 1:3 maximum. 
        4. TP1 should aim for a 1:1 or 1:1.5 RR, while TP2 aims for the maximum RR.

        You MUST respond ONLY with a raw JSON object (no markdown formatting, no backticks, no explanations outside the JSON) with the following strictly defined keys:
        - pair: (string, the asset you analyzed, e.g., '{$pair}')
        - direction: (string, strictly 'long' or 'short')
        - entry_price: (number, a highly realistic entry price for this asset right now in 2026)
        - tp_1: (number, a realistic, safer first take profit target respecting the RR rules)
        - tp_2: (number, a realistic, more aggressive second take profit target respecting the RR rules)
        - stop_loss: (number, a realistic stop loss level strictly 20-50 pips from entry)
        - reasoning: (string, 2-3 sentences explaining the technical/fundamental reasoning for this trade. Respond strictly in the following language: " . ($language === 'id' ? 'Indonesian (Bahasa Indonesia)' : 'English') . ")";

        try {
            // Using the requested model
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                ]
            ]);

            if ($response->successful()) {
                $result = $response->json();
                
                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    $text = $result['candidates'][0]['content']['parts'][0]['text'];
                    
                    // Clean up potential markdown formatting block if the AI ignored the prompt
                    $text = str_replace(['```json', '```'], '', $text);
                    $text = trim($text);
                    
                    $data = json_decode($text, true);
                    
                    if (json_last_error() === JSON_ERROR_NONE) {
                        return $data;
                    } else {
                        Log::error('Failed to parse Gemini JSON response: ' . json_last_error_msg(), ['text' => $text]);
                    }
                }
            } else {
                Log::error('Gemini API request failed: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Exception during Gemini API request: ' . $e->getMessage());
        }

        return null;
    }
}
