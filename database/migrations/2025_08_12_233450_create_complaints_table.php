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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('construction_job_id')->constrained()->onDelete('cascade');
            $table->string('subject');
            $table->text('message');
            $table->enum('status', ['Pending', 'Completed'])->default('Pending');
            $table->string('assigned_to')->nullable(); // Supervisor Name
            $table->string('resolved_by')->nullable(); // Installer Name
            $table->date('visit_date')->nullable();
            $table->date('close_date')->nullable();
            $table->string('department')->nullable();
            $table->string('measure_name')->nullable();
            $table->enum('priority', ['Low', 'Medium', 'High'])->default('Medium');
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
