<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'construction_job_id', 'subject', 'message', 'status',
        'assigned_to', 'resolved_by', 'visit_date', 'close_date',
        'department', 'measure_name', 'priority', 'images',
    ];

    protected $casts = [
        'images' => 'array',
        'visit_date' => 'date',
        'close_date' => 'date',
    ];

    public function constructionJob()
    {
        return $this->belongsTo(ConstructionJob::class);
    }
}