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
            // Text fields ke liye columns
            $table->text('pre_job_conditions')->nullable();
            $table->text('post_job_conditions')->nullable();
            $table->text('materials_used')->nullable();
            $table->text('work_description')->nullable();

            // Image URLs save karne ke liye columns (longText behtar hai)
            $table->longText('pre_job_images')->nullable();
            $table->longText('post_job_images')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->dropColumn([
                'pre_job_conditions',
                'post_job_conditions',
                'materials_used',
                'work_description',
                'pre_job_images',
                'post_job_images'
            ]);
        });
    }
};
