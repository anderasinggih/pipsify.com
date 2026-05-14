<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trade>
 */
class TradeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['win', 'loss', 'breakeven', 'open']);
        $entry = $this->faker->randomFloat(4, 50, 500);
        
        // Logical exit price based on status
        $exit = null;
        if ($status !== 'open') {
            if ($status === 'win') {
                $exit = $entry * (1 + $this->faker->randomFloat(2, 0.05, 0.2));
            } elseif ($status === 'loss') {
                $exit = $entry * (1 - $this->faker->randomFloat(2, 0.02, 0.1));
            } else {
                $exit = $entry;
            }
        }

        return [
            'ticker' => $this->faker->randomElement(['BTC', 'ETH', 'SOL', 'AAPL', 'NVDA', 'TSLA', 'META', 'AMZN']),
            'direction' => $this->faker->randomElement(['long', 'short']),
            'status' => $status,
            'entry_price' => $entry,
            'exit_price' => $exit,
            'quantity' => $this->faker->numberBetween(1, 10),
            'pre_trade_emotion' => $this->faker->randomElement(['calm', 'fomo', 'anxious', 'greedy', 'neutral']),
            'post_trade_emotion' => $status === 'open' ? 'neutral' : $this->faker->randomElement(['satisfied', 'frustrated', 'relieved', 'regretful', 'neutral']),
            'mistakes_made' => $status === 'loss' ? $this->faker->randomElements(['fomo_entry', 'exited_early', 'moved_sl', 'revenge_trade', 'overleverage'], rand(1, 2)) : [],
            'notes' => $this->faker->realText(100),
            'chart_image_path' => null,
        ];
    }
}
