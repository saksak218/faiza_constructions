<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('jobs', function (Blueprint $table) {
        $table->string('client_name');
        $table->string('client_phone_number');
        $table->enum('inspection_status', ['Pass', 'Fail'])->default('Pass');
        $table->json('measures')->nullable(); // Checkboxes ke liye
        $table->unsignedBigInteger('assigned_person_id')->nullable();
        $table->foreign('assigned_person_id')->references('id')->on('users')->onDelete('set null');
    });
}

public function down()
{
    Schema::table('jobs', function (Blueprint $table) {
        $table->dropForeign(['assigned_person_id']);
        $table->dropColumn(['client_name', 'client_phone_number', 'inspection_status', 'measures', 'assigned_person_id']);
    });
}
};
