<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            // Surveyor signature ka column add karein
            if (!Schema::hasColumn('construction_jobs', 'surveyor_signature')) {
                $table->longText('surveyor_signature')->nullable()->after('installer_signature');
            }

            // Electrical Installer signature ka column add karein
            if (!Schema::hasColumn('construction_jobs', 'electrical_installer_signature')) {
                $table->longText('electrical_installer_signature')->nullable()->after('surveyor_signature');
            }
        });
    }

    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            if (Schema::hasColumn('construction_jobs', 'surveyor_signature')) {
                $table->dropColumn('surveyor_signature');
            }
            if (Schema::hasColumn('construction_jobs', 'electrical_installer_signature')) {
                $table->dropColumn('electrical_installer_signature');
            }
        });
    }
};