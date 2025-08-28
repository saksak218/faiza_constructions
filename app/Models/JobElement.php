<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobElement extends Model
{
    use HasFactory;
    protected $fillable = ['construction_job_id', 'title', 'description'];
}