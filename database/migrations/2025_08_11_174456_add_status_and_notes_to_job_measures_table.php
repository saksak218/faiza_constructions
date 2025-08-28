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
        Schema::table('job_measures', function (Blueprint $table) {
            $table->string('status')->nullable()->after('post_install_date');
            $table->string('invoice_status')->nullable()->after('status');
            $table->text('notes')->nullable()->after('invoice_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_measures', function (Blueprint $table) {
            $table->dropColumn(['status', 'invoice_status', 'notes']);
        });
    }
};