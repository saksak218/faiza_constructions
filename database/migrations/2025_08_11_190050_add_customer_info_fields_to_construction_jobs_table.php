<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->string('customer_title')->nullable()->after('post_code');
            $table->string('customer_first_name')->nullable()->after('customer_title');
            $table->string('customer_last_name')->nullable()->after('customer_first_name');
            $table->string('customer_contact_method')->nullable()->after('customer_last_name');
            $table->string('customer_email')->nullable()->after('customer_contact_method');
            $table->string('customer_phone')->nullable()->after('customer_email');
            $table->text('signature_general')->nullable()->after('customer_phone');
            $table->text('signature_undertaking_overall')->nullable()->after('signature_general');
        });
    }

    public function down(): void
    {
        Schema::table('construction_jobs', function (Blueprint $table) {
            $table->dropColumn([
                'customer_title', 'customer_first_name', 'customer_last_name',
                'customer_contact_method', 'customer_email', 'customer_phone',
                'signature_general', 'signature_undertaking_overall'
            ]);
        });
    }
};