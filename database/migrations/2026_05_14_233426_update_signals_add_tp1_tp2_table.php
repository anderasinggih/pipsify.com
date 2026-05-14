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
        Schema::table('signals', function (Blueprint $table) {
            $table->renameColumn('take_profit', 'tp_1');
        });

        Schema::table('signals', function (Blueprint $table) {
            $table->decimal('tp_2', 15, 5)->nullable()->after('tp_1');
            $table->string('status', 20)->default('active')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signals', function (Blueprint $table) {
            $table->dropColumn('tp_2');
            $table->renameColumn('tp_1', 'take_profit');
        });
    }
};
