<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateSignals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'signals:generate';

    protected $description = 'Generate an AI trading signal using Gemini';

    public function handle(\App\Services\GeminiSignalService $service)
    {
        $this->info('Generating signal...');
        
        $data = $service->generateSignal();
        
        if ($data) {
            \App\Models\Signal::create([
                'pair' => $data['pair'],
                'direction' => $data['direction'],
                'entry_price' => $data['entry_price'],
                'tp_1' => $data['tp_1'],
                'tp_2' => $data['tp_2'] ?? null,
                'stop_loss' => $data['stop_loss'],
                'reasoning' => $data['reasoning'],
                'status' => 'pending',
            ]);
            
            $this->info("Successfully generated a {$data['direction']} signal for {$data['pair']}.");
        } else {
            $this->error('Failed to generate signal.');
        }
    }
}
