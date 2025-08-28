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
        Schema::table('construction_jobs', function (Blueprint $table) {
            // Purane ENUM values mein 'Ready to Book' add kar dein
            $table->enum('status', [
                'Booked',
                'pending',
                'in_progress',
                'completed',
                'cancelled',
                'Ready to Book' // Naya status yahan add karein
            ])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            // Agar rollback karna ho to purane values par wapas le jayein
            $table->enum('status', [
                'Booked',
                'pending',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('Booked')->change();
        });
    }
};
