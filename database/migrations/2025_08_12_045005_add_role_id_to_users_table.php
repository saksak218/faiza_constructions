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
            // Pehle check karein ke column mojood to nahi
            if (!Schema::hasColumn('users', 'role_id')) {
                // 'id' column ke baad 'role_id' ka column add karein
                $table->foreignId('role_id')->after('id')->constrained()->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Foreign key ko drop karein
            $table->dropForeign(['role_id']);
            // Column ko drop karein
            $table->dropColumn('role_id');
        });
    }
};
