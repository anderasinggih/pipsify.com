<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiSignalService
{
    /**
     * Generate a new trading signal using Gemini AI
     */
    public function generateSignal()
    {
        $apiKey = Setting::where('key', 'gemini_api_key')->value('value');
        $allowedPairsJson = Setting::where('key', 'allowed_pairs')->value('value') ?? '["XAUUSD", "BTCUSD", "EURUSD"]';
        
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

        $prompt = "You are an expert institutional trader operating in the year 2026. Analyze the current hypothetical market conditions for {$pair} and generate a highly probable trading signal. 
        CRITICAL INSTRUCTION: Ensure the `entry_price` reflects a realistic market level for 2026. Do NOT use outdated historical prices (e.g., if XAUUSD is historically around $2300-$2600, do not use $2000. If BTCUSD is $60k-$90k, do not use $20k).
        You MUST respond ONLY with a raw JSON object (no markdown formatting, no backticks, no explanations outside the JSON) with the following strictly defined keys:
        - pair: (string, the asset you analyzed, e.g., '{$pair}')
        - direction: (string, strictly 'long' or 'short')
        - entry_price: (number, a highly realistic entry price for this asset right now in 2026)
        - take_profit: (number, a realistic take profit target)
        - stop_loss: (number, a realistic stop loss level)
        - reasoning: (string, 2-3 sentences explaining the technical/fundamental reasoning for this trade)";

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
