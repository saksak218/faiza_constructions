<?php

namespace App\Http\Controllers;

use App\Models\ConstructionJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

// Admin ke tamam personnel models ko yahan import karein
use App\Models\LeadGenerator;
use App\Models\Surveyor;
use App\Models\InstallationSupervisor;
use App\Models\MeasureInstaller;
use App\Models\User; // User model ko bhi import karein

class UserJobController extends Controller
{
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ConstructionJob $job)
    {
        Gate::authorize('update', $job);

        $job->load('measuresDetails');

        // Admin panel jaisa tamam data yahan bhi fetch karein
        $leadGenerators = LeadGenerator::all();
        $surveyors = Surveyor::all();
        $installationSupervisors = InstallationSupervisor::all();
        $measureInstallers = MeasureInstaller::all();
        $users = User::whereHas('role', function ($query) {
            $query->where('name', 'user');
        })->get();

        // Data ko frontend par bhejein
        return Inertia::render('Users/EditJob', [
            'job' => $job,
            'users' => $users,
            'leadGenerators' => $leadGenerators,
            'surveyors' => $surveyors,
            'installationSupervisors' => $installationSupervisors,
            'measureInstallers' => $measureInstallers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ConstructionJob $job)
    {
        Gate::authorize('update', $job);

        // 1. Validation Rules
        $validator = Validator::make($request->all(), [
            // Aapke purane fields ki validation
            'address' => 'sometimes|required|string|max:255',
            'client_name' => 'sometimes|required|string|max:255',
    
            // Naye Condition Report Fields
            'pre_job_conditions' => 'nullable|string',
            'post_job_conditions' => 'nullable|string',
            'materials_used' => 'nullable|string',
            'work_description' => 'nullable|string',
            'pre_job_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'post_job_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'measures_details' => 'nullable|array',
             'mid_elements' => 'nullable|array',
            'mid_elements_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'post_elements' => 'nullable|array',
            'post_elements_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'supervisor_audit_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'inspector_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'auditor_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'property_proof_docs.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,png,jpeg|max:10240', // 10MB max
                'erp_docs.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,png,jpeg|max:10240',
                'extra_docs.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,png,jpeg|max:10240',
        ]);
    
        if ($validator->fails()) {
            // Agar validation fail ho to errors ke sath redirect karein
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // 2. Text fields update karein
        $job->update($request->except(['measures_details', 'pre_job_images', 'post_job_images', 'mid_elements_images', 'post_elements_images', 'supervisor_audit_images', 'inspector_images', 'auditor_images', 'property_proof_docs', 'erp_docs', 'extra_docs']));
    
        // 3. Pre-Job Images Handle Karein
        if ($request->hasFile('pre_job_images')) {
            $preJobImagePaths = [];
            foreach ($request->file('pre_job_images') as $image) {
                $path = $image->store('public/user/pre_job_images');
                $preJobImagePaths[] = Storage::url($path);
            }
            $existingPreImages = json_decode($job->pre_job_images, true) ?? [];
            $job->pre_job_images = json_encode(array_merge($existingPreImages, $preJobImagePaths));
        }
    
        // 4. Post-Job Images Handle Karein
        if ($request->hasFile('post_job_images')) {
            $postJobImagePaths = [];
            foreach ($request->file('post_job_images') as $image) {
                $path = $image->store('public/user/post_job_images');
                $postJobImagePaths[] = Storage::url($path);
            }
            $existingPostImages = json_decode($job->post_job_images, true) ?? [];
            $job->post_job_images = json_encode(array_merge($existingPostImages, $postJobImagePaths));
        }
        $this->handleFileUpload($request, $job, 'property_proof_docs', 'public/user/property_proof_docs');
            $this->handleFileUpload($request, $job, 'erp_docs', 'public/user/erp_docs');
            $this->handleFileUpload($request, $job, 'extra_docs', 'public/user/extra_docs');
        // Mid Elements Images Handle Karein
        if ($request->hasFile('mid_elements_images')) {
            $midImagePaths = [];
            foreach ($request->file('mid_elements_images') as $image) {
                $path = $image->store('public/user/mid_elements_images');
                $midImagePaths[] = Storage::url($path);
            }
            $existingMidImages = json_decode($job->mid_elements_images, true) ?? [];
            $job->mid_elements_images = json_encode(array_merge($existingMidImages, $midImagePaths));
        }
        // Post Elements Images Handle Karein
        if ($request->hasFile('post_elements_images')) {
            $postImagePaths = [];
            foreach ($request->file('post_elements_images') as $image) {
                $path = $image->store('public/user/post_elements_images');
                $postImagePaths[] = Storage::url($path);
            }
            $existingPostImages = json_decode($job->post_elements_images, true) ?? [];
            $job->post_elements_images = json_encode(array_merge($existingPostImages, $postImagePaths));
        }
        // Mid Elements (JSON data) ko save karein
        if ($request->has('mid_elements')) {
            $job->mid_elements = $request->input('mid_elements');
        }
        if ($request->has('post_elements')) {
            $job->post_elements = $request->input('post_elements');
        }
        // 5. Job Measures update karein (Aapka purana logic)
        if ($request->has('measures_details')) {
            foreach ($request->measures_details as $measureData) {
                \App\Models\JobMeasure::updateOrCreate(
                    ['id' => $measureData['id'] ?? null, 'construction_job_id' => $job->id],
                    $measureData
                );
            }
        }
        // Supervisor Audit Images
        if ($request->hasFile('supervisor_audit_images')) {
            $paths = [];
            foreach ($request->file('supervisor_audit_images') as $image) {
                $paths[] = Storage::url($image->store('public/user/supervisor_audit_images'));
            }
            $existing = json_decode($job->supervisor_audit_images, true) ?? [];
            $job->supervisor_audit_images = json_encode(array_merge($existing, $paths));
        }

        // Inspector Images
        if ($request->hasFile('inspector_images')) {
            $paths = [];
            foreach ($request->file('inspector_images') as $image) {
                $paths[] = Storage::url($image->store('public/user/inspector_images'));
            }
            $existing = json_decode($job->inspector_images, true) ?? [];
            $job->inspector_images = json_encode(array_merge($existing, $paths));
        }

        // Auditor Images
        if ($request->hasFile('auditor_images')) {
            $paths = [];
            foreach ($request->file('auditor_images') as $image) {
                $paths[] = Storage::url($image->store('public/user/auditor_images'));
            }
            $existing = json_decode($job->auditor_images, true) ?? [];
            $job->auditor_images = json_encode(array_merge($existing, $paths));
        }
        // 6. Job ko save karein
        $job->save();
    
        return redirect()->route('dashboard')->with('success', 'Job updated successfully!');
    }

    /**
     * Signatures ko update karne ke liye function.
     * YEH FUNCTION AB UPDATE FUNCTION KE BAHAR HAI
     */
     public function updateSignatures(Request $request, ConstructionJob $job)
    {
        $request->validate([
            'installer_signature' => 'nullable|string',
            'surveyor_signature' => 'nullable|string',
            'surveyor_signature_2' => 'nullable|string', // Naya field
            'electrical_installer_signature' => 'nullable|string',
            'coordinator_signature' => 'nullable|string', // Naya field
            'additional_signatures' => 'nullable|array', // Naya field
        ]);

        $job->update($request->all()); // Yeh tamam signatures ko ek sath update kar dega

        return back()->with('success', 'Signatures updated successfully.');
    }
    private function handleFileUpload(Request $request, ConstructionJob $job, string $field, string $path)
        {
            if ($request->hasFile($field)) {
                $newFilePaths = [];
                foreach ($request->file($field) as $file) {
                    // Original file name aur path save karein
                    $originalName = $file->getClientOriginalName();
                    $storedPath = $file->store($path);
                    $newFilePaths[] = [
                        'name' => $originalName,
                        'path' => Storage::url($storedPath)
                    ];
                }
                
                $existingFiles = $job->{$field} ?? [];
                $job->{$field} = array_merge($existingFiles, $newFilePaths);
            }
        }

    }

