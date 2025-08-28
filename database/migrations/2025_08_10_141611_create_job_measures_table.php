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
        // Measures ki details ke liye ek nayi table banayein
        Schema::create('job_measures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('construction_job_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., 'EWI', 'Ventilation'
            $table->boolean('is_active')->default(true);
            $table->string('installer_name')->nullable();
            $table->date('pre_install_date')->nullable();
            $table->time('pre_install_time')->nullable();
            $table->date('post_install_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_measures');
    }
};
