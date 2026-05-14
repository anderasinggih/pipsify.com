<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('strategy_id')->nullable()->constrained()->onDelete('set null');
            
            $table->string('ticker');
            $table->enum('direction', ['long', 'short']);
            $table->enum('status', ['open', 'win', 'loss', 'breakeven']);
            
            $table->decimal('entry_price', 15, 4);
            $table->decimal('exit_price', 15, 4)->nullable();
            $table->integer('quantity');
            $table->decimal('net_pnl', 15, 4)->nullable();
            
            $table->enum('pre_trade_emotion', ['calm', 'fomo', 'anxious', 'greedy', 'neutral']);
            $table->enum('post_trade_emotion', ['satisfied', 'frustrated', 'relieved', 'regretful', 'neutral'])->nullable();
            
            $table->json('mistakes_made')->nullable();
            $table->string('chart_image_path')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();

            // Indexes for performance (as requested by user)
            $table->index('ticker');
            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};
