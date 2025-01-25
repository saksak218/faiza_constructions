<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstructionJob extends Model
{
    protected $fillable = [
        'user_id',
        "title",
        'description',
        'address',
        'status',
        'installation_status',
        'date_installed',
        'date_assigned',
        'installation_notes',
        'customer_signature',
        'installer_signature',
        'inspection_image',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
