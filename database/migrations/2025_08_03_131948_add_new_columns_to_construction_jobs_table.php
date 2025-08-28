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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->dropForeign(['assigned_person_id']);
            $table->dropColumn('assigned_person_id');
            $table->dropColumn('measures');
            $table->dropColumn('client_phone_number');
            $table->dropColumn('client_name');
        });
    }
};

