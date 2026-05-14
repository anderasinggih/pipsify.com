<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Setting;
use App\Models\Signal;
use App\Services\GeminiSignalService;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $signals = Signal::orderBy('created_at', 'desc')->paginate(20);
        
        return Inertia::render('Admin/Dashboard', [
            'settings' => $settings,
            'signals' => $signals
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'gemini_api_key' => 'nullable|string',
            'allowed_pairs' => 'required|string', // Expecting JSON string array
            'free_limit' => 'required|integer|min:0',
            'pro_limit' => 'required|integer|min:1',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Settings updated successfully.');
    }

    public function generateSignal(GeminiSignalService $service)
    {
        $data = $service->generateSignal();
        
        if ($data) {
            Signal::create([
                'pair' => $data['pair'],
                'direction' => $data['direction'],
                'entry_price' => $data['entry_price'],
                'tp_1' => $data['tp_1'],
                'tp_2' => $data['tp_2'],
                'stop_loss' => $data['stop_loss'],
                'reasoning' => $data['reasoning'],
                'status' => 'active',
            ]);
            
            return back()->with('success', 'AI Signal generated successfully.');
        }

        return back()->with('error', 'Failed to generate signal. Check API key and logs.');
    }

    public function updateSignal(Request $request, Signal $signal)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,won,lost',
            'pnl' => 'nullable|numeric',
        ]);

        $signal->update($validated);

        return back()->with('success', 'Signal status updated.');
    }
}

