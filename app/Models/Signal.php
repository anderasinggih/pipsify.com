<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signal extends Model
{
    protected $fillable = [
        'pair',
        'direction',
        'entry_price',
        'tp_1',
        'tp_2',
        'stop_loss',
        'reasoning',
        'status',
        'pnl',
    ];
}
