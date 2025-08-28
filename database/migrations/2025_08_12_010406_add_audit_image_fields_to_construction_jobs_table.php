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
            $table->longText('supervisor_audit_images')->nullable();
            $table->longText('inspector_images')->nullable();
            $table->longText('auditor_images')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->dropColumn([
                'supervisor_audit_images',
                'inspector_images',
                'auditor_images'
            ]);
        });
    }
};