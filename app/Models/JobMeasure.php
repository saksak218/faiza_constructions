<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobMeasure extends Model
{
    use HasFactory;

    protected $fillable = [
        'construction_job_id',
        'name',
        'is_active',
        'installer_name',
        'pre_install_date',
        'pre_install_time',
        'post_install_date',
        'status',
        'invoice_status',
        'notes',
        'signature_undertaking',
    ];
}