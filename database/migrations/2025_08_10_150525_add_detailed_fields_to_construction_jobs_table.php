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
            // Address fields
            $table->string('house_no')->nullable()->after('address');
            $table->string('street_name')->nullable()->after('house_no');
            $table->string('city')->nullable()->after('street_name');
            $table->string('county')->nullable()->after('city');
            $table->string('post_code')->nullable()->after('county');

            // Job Workers
            $table->string('lead_generator')->nullable();
            $table->string('surveyor')->nullable();
            $table->date('survey_date')->nullable();
            $table->time('survey_time')->nullable();
            $table->string('survey_status')->nullable();
            $table->string('auditor')->nullable();
            $table->string('installation_supervisor')->nullable();
            $table->string('retrofit_coordinator')->nullable();

            // Status Category
            $table->string('status_category')->nullable();
            $table->text('rejection_note')->nullable();
            $table->string('scheme_type')->nullable();
            $table->string('sub_scheme_type')->nullable();
            $table->string('datamatch_status')->nullable();
            $table->timestamp('datamatch_status_date')->nullable();

            // EPC Rating
            $table->string('epr_floor_area_segment')->nullable();
            $table->decimal('epr_pre_rating', 8, 2)->nullable();
            $table->decimal('epr_post_rating', 8, 2)->nullable();
            $table->decimal('epr_cost_saving', 8, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->dropColumn([
                'house_no', 'street_name', 'city', 'county', 'post_code',
                'lead_generator', 'surveyor', 'survey_date', 'survey_time', 'survey_status',
                'auditor', 'installation_supervisor', 'retrofit_coordinator',
                'status_category', 'rejection_note', 'scheme_type', 'sub_scheme_type',
                'datamatch_status', 'datamatch_status_date', 'epr_floor_area_segment',
                'epr_pre_rating', 'epr_post_rating', 'epr_cost_saving'
            ]);
        });
    }
};