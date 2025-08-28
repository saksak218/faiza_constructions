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
            $table->string('property_type')->nullable()->after('post_code');
            $table->string('house_type')->nullable()->after('property_type');
            $table->string('bedrooms')->nullable()->after('house_type');
            $table->string('main_heating_source')->nullable()->after('bedrooms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->dropColumn(['property_type', 'house_type', 'bedrooms', 'main_heating_source']);
        });
    }
};