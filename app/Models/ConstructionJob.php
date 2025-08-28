<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConstructionJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'address', 'status', 'client_name',
        'client_phone_number', 'assigned_person_id', 'measures', 'installation_status',
        'date_installed', 'date_assigned', 'installation_notes', 'customer_signature',
        'installer_signature', 'inspection_image', 'date_inspection', 'job_images',
        // Naye columns
        'house_no', 'street_name', 'city', 'county', 'post_code',
        'lead_generator', 'surveyor', 'survey_date', 'survey_time', 'survey_status',
        'auditor', 'installation_supervisor', 'retrofit_coordinator',
        'status_category', 'rejection_note', 'scheme_type', 'sub_scheme_type',
        'datamatch_status', 'datamatch_status_date', 'epr_floor_area_segment',
        'epr_pre_rating', 'epr_post_rating', 'epr_cost_saving',
        'customer_title', 'customer_first_name', 'customer_last_name',
    'customer_contact_method', 'customer_email', 'customer_phone',
    'signature_general', 'signature_undertaking_overall',
    'property_type', 'house_type', 'bedrooms', 'main_heating_source',
    'external_elements', 'internal_elements_ground_floor',
        'internal_elements_first_floor', 'occupy_survey',
        'general_details', 'signy', 'condition_report_images',
        'surveyor_signature_2',
    'coordinator_signature',
    'additional_signatures',
    'property_proof_docs',
    'erp_docs',
    'extra_docs',
    ];

    protected $casts = [
        'measures' => 'array',
        'inspection_image' => 'array',
        'job_images' => 'array',
        'datamatch_status_date' => 'datetime',
        'condition_report_images' => 'array',
         'additional_signatures' => 'array',
         'property_proof_docs' => 'array',
    'erp_docs' => 'array',
    'extra_docs' => 'array',
    ];

    public function assignedUser() {
        return $this->belongsTo(User::class, 'assigned_person_id');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function measuresDetails(): HasMany
    {
        return $this->hasMany(JobMeasure::class);
    }
    public function elements(): HasMany
    {
        return $this->hasMany(JobElement::class);
    }
    public function complaints()
{
    return $this->hasMany(Complaint::class)->latest();
}
}
