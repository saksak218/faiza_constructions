<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_measures', function (Blueprint $table) {
            $table->text('signature_undertaking')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('job_measures', function (Blueprint $table) {
            $table->dropColumn('signature_undertaking');
        });
    }
};
