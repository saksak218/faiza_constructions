<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            // Change all signature-related columns to LONGTEXT to store large Base64 strings.
            $table->longText('installer_signature')->nullable()->change();
            $table->longText('surveyor_signature')->nullable()->change();
            $table->longText('surveyor_signature_2')->nullable()->change();
            $table->longText('electrical_installer_signature')->nullable()->change();
            $table->longText('coordinator_signature')->nullable()->change();
            
            // Also change the additional_signatures and signature_undertaking columns just to be safe
            $table->longText('additional_signatures')->nullable()->change();
            $table->longText('signature_general')->nullable()->change();
            $table->longText('signature_undertaking_overall')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            // This will revert the changes if you ever need to rollback the migration.
            $table->string('installer_signature')->nullable()->change();
            $table->string('surveyor_signature')->nullable()->change();
            $table->string('surveyor_signature_2')->nullable()->change();
            $table->string('electrical_installer_signature')->nullable()->change();
            $table->string('coordinator_signature')->nullable()->change();
            $table->text('additional_signatures')->nullable()->change();
            $table->string('signature_general')->nullable()->change();
            $table->string('signature_undertaking_overall')->nullable()->change();
        });
    }
};