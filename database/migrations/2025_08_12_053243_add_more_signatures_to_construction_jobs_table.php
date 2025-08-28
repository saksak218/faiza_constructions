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
                // Surveyor ke doosre signature ke liye column
                if (!Schema::hasColumn('construction_jobs', 'surveyor_signature_2')) {
                    $table->longText('surveyor_signature_2')->nullable()->after('surveyor_signature');
                }

                // Coordinator ke signature ke liye column
                if (!Schema::hasColumn('construction_jobs', 'coordinator_signature')) {
                    $table->longText('coordinator_signature')->nullable()->after('electrical_installer_signature');
                }

                // Dynamically add hone wale signatures ke liye JSON column
                if (!Schema::hasColumn('construction_jobs', 'additional_signatures')) {
                    $table->json('additional_signatures')->nullable()->after('coordinator_signature');
                }
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            //
        });
    }
};
