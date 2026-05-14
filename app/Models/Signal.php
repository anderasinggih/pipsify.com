<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signal extends Model
{
    protected $fillable = [
        'pair',
        'direction',
        'entry_price',
        'take_profit',
        'stop_loss',
        'reasoning',
        'status',
        'pnl',
    ];
}
