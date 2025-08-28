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
                if (!Schema::hasColumn('construction_jobs', 'property_proof_docs')) {
                    $table->json('property_proof_docs')->nullable()->after('additional_signatures');
                }
                if (!Schema::hasColumn('construction_jobs', 'erp_docs')) {
                    $table->json('erp_docs')->nullable()->after('property_proof_docs');
                }
                if (!Schema::hasColumn('construction_jobs', 'extra_docs')) {
                    $table->json('extra_docs')->nullable()->after('erp_docs');
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
