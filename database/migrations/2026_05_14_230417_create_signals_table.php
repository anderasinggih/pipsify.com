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
        Schema::create('signals', function (Blueprint $table) {
            $table->id();
            $table->string('pair');
            $table->enum('direction', ['long', 'short']);
            $table->decimal('entry_price', 15, 5);
            $table->decimal('take_profit', 15, 5);
            $table->decimal('stop_loss', 15, 5);
            $table->text('reasoning')->nullable();
            $table->enum('status', ['active', 'won', 'lost'])->default('active');
            $table->decimal('pnl', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signals');
    }
};
