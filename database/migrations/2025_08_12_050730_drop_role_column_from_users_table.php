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
        Schema::table('users', function (Blueprint $table) {
            // Pehle check karein ke purana 'role' column mojood hai ya nahi
            if (Schema::hasColumn('users', 'role')) {
                // Usay delete kar dein
                $table->dropColumn('role');
            }
        });
    }

    /**
     * Reverse the migrations.
     * (Hum isay wapas nahi lana chahte, isliye down() function khali rahega)
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
