<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('construction_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->longText('address')->nullable();
            $table->string('client_name')->nullable();
            $table->string('client_phone_number')->nullable();
            $table->unsignedBigInteger('assigned_person_id')->nullable();
            $table->foreign('assigned_person_id')->references('id')->on('users')->onDelete('set null');
            $table->text('measures')->nullable();
            $table->text('images')->nullable();
            $table->enum('status', ['Booked', 'pending', 'in_progress', 'completed', 'cancelled'])->default('Booked');
            $table->enum('installation_status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->date('date_installed')->nullable();
            $table->date('date_assigned')->nullable();
            $table->string('installation_notes')->nullable();
            $table->string('customer_signature')->nullable();
            $table->string('installer_signature')->nullable();
            $table->string('inspection_image')->nullable();
            $table->date('date_inspection')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('construction_jobs');
    }
};
