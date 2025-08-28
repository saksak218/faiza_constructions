<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->text('external_elements')->nullable();
            $table->text('internal_elements_ground_floor')->nullable();
            $table->text('internal_elements_first_floor')->nullable();
            $table->text('occupy_survey')->nullable();
            $table->text('general_details')->nullable();
            $table->text('signy')->nullable(); // Assuming 'signy' is a text field
            $table->json('condition_report_images')->nullable();
           
        });
    }

    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->dropColumn([
                'external_elements', 'internal_elements_ground_floor',
                'internal_elements_first_floor', 'occupy_survey',
                'general_details', 'signy', 'condition_report_images',
                
            ]);
        });
    }
};