<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'strategy_id',
        'trade_account_id',
        'ticker',
        'direction',
        'status',
        'entry_price',
        'exit_price',
        'quantity',
        'net_pnl',
        'pre_trade_emotion',
        'post_trade_emotion',
        'mistakes_made',
        'notes',
        'chart_image_path',
    ];

    protected $casts = [
        'mistakes_made' => 'array',
        'net_pnl' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($trade) {
            if ($trade->status !== 'open' && $trade->exit_price && $trade->entry_price && $trade->quantity) {
                $pnl = ($trade->exit_price - $trade->entry_price) * $trade->quantity;
                if ($trade->direction === 'short') {
                    $pnl = ($trade->entry_price - $trade->exit_price) * $trade->quantity;
                }
                $trade->net_pnl = $pnl;
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function strategy(): BelongsTo
    {
        return $this->belongsTo(Strategy::class);
    }

    public function tradeAccount(): BelongsTo
    {
        return $this->belongsTo(TradeAccount::class);
    }
}
