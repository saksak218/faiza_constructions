<?php

namespace App\Http\Controllers;

use App\Models\ConstructionJob;
use App\Models\JobMeasure;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
// Naye models ko import karein
use App\Models\LeadGenerator;
use App\Models\Surveyor;
use App\Models\InstallationSupervisor;
use App\Models\MeasureInstaller;
use App\Models\Measure;

class ConstructionJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ConstructionJob::query()->with(['assignedUser', 'creator']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('address', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->input('date'));
        }

        $jobs = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::whereHas('role', function ($query) {
            $query->where('name', 'user');
        })->get();
        $measures = Measure::all();
        return Inertia::render('Admin/Jobs/Create', ['users' => $users, 'measures' => $measures,]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'address' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_phone_number' => 'required|string|max:255',
            'assigned_person_id' => 'required|exists:users,id',
            'measures' => 'nullable|array',
            'inspection_image' => 'nullable|array',
            'customer_signature' => 'nullable|string',
        ]);

        $data = $request->except(['inspection_image', 'customer_signature']);
        $data['user_id'] = Auth::id();

        $job = new ConstructionJob($data);

        if ($request->hasFile('inspection_image')) {
            $images = [];
            foreach ($request->file('inspection_image') as $file) {
                $path = $file->store('jobs/inspection_images', 'public');
                $images[] = $path;
            }
            $job->inspection_image = $images;
        }

        if ($request->customer_signature) {
            $signature = $request->customer_signature;
            $image_data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $signature));
            $path = 'jobs/signatures/signature_' . time() . '.png';
            Storage::disk('public')->put($path, $image_data);
            $job->customer_signature = $path;
        }

        $job->save();

        if ($request->has('measures') && is_array($request->measures)) {
            foreach ($request->measures as $measureName) {
                JobMeasure::create([
                    'construction_job_id' => $job->id,
                    'name' => $measureName,
                    'is_active' => true,
                ]);
            }
        }

        return redirect()->route('admin.jobs.index')->with('success', 'Job created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ConstructionJob $job)
    {
        $job->load('measuresDetails');

        if ($job->measuresDetails->isEmpty() && !empty($job->measures)) {
            foreach ($job->measures as $measureName) {
                JobMeasure::create([
                    'construction_job_id' => $job->id,
                    'name' => $measureName,
                    'is_active' => true,
                ]);
            }
            $job->load('measuresDetails');
        }

        $users = User::whereHas('role', function ($query) {
            $query->where('name', 'user');
        })->get();

        $leadGenerators = LeadGenerator::all();
        $surveyors = Surveyor::all();
        $installationSupervisors = InstallationSupervisor::all();
        $measureInstallers = MeasureInstaller::all();

        return Inertia::render('Admin/Jobs/Edit', [
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
        // 1. Validation Rules
        $request->validate([
            'address' => 'required|string|max:255',
            'client_name' => 'sometimes|required|string|max:255',
            'measures_details' => 'nullable|array',
            
            // Naye Condition Report Fields ke liye Validation
            'pre_job_conditions' => 'nullable|string',
            'post_job_conditions' => 'nullable|string',
            'materials_used' => 'nullable|string',
            'work_description' => 'nullable|string',
            'pre_job_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'post_job_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'mid_elements' => 'nullable|array',
            'mid_elements_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // Post Elements ke liye nayi validation
            'post_elements' => 'nullable|array',
            'post_elements_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'supervisor_audit_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'inspector_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'auditor_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // 2. Text fields update karein (images aur measures ke alawa)
        $job->update($request->except(['measures_details', 'pre_job_images', 'post_job_images', 'mid_elements_images', 'post_elements_images', 'supervisor_audit_images', 'inspector_images', 'auditor_images']));

        // 3. Pre-Job Images Handle Karein
        if ($request->hasFile('pre_job_images')) {
            $preJobImagePaths = [];
            foreach ($request->file('pre_job_images') as $image) {
                $path = $image->store('public/construction/pre_job_images');
                $preJobImagePaths[] = Storage::url($path);
            }
            $existingPreImages = json_decode($job->pre_job_images, true) ?? [];
            $job->pre_job_images = json_encode(array_merge($existingPreImages, $preJobImagePaths));
        }

        // 4. Post-Job Images Handle Karein
        if ($request->hasFile('post_job_images')) {
            $postJobImagePaths = [];
            foreach ($request->file('post_job_images') as $image) {
                $path = $image->store('public/construction/post_job_images');
                $postJobImagePaths[] = Storage::url($path);
            }
            $existingPostImages = json_decode($job->post_job_images, true) ?? [];
            $job->post_job_images = json_encode(array_merge($existingPostImages, $postJobImagePaths));
        }
// Mid Elements Images Handle Karein
        if ($request->hasFile('mid_elements_images')) {
            $midImagePaths = [];
            foreach ($request->file('mid_elements_images') as $image) {
                $path = $image->store('public/construction/mid_elements_images');
                $midImagePaths[] = Storage::url($path);
            }
            $existingMidImages = json_decode($job->mid_elements_images, true) ?? [];
            $job->mid_elements_images = json_encode(array_merge($existingMidImages, $midImagePaths));
        }
        // Post Elements Images Handle Karein
        if ($request->hasFile('post_elements_images')) {
            $postImagePaths = [];
            foreach ($request->file('post_elements_images') as $image) {
                $path = $image->store('public/construction/post_elements_images');
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
         // Supervisor Audit Images
        if ($request->hasFile('supervisor_audit_images')) {
            $paths = [];
            foreach ($request->file('supervisor_audit_images') as $image) {
                $paths[] = Storage::url($image->store('public/construction/supervisor_audit_images'));
            }
            $existing = json_decode($job->supervisor_audit_images, true) ?? [];
            $job->supervisor_audit_images = json_encode(array_merge($existing, $paths));
        }

        // Inspector Images
        if ($request->hasFile('inspector_images')) {
            $paths = [];
            foreach ($request->file('inspector_images') as $image) {
                $paths[] = Storage::url($image->store('public/construction/inspector_images'));
            }
            $existing = json_decode($job->inspector_images, true) ?? [];
            $job->inspector_images = json_encode(array_merge($existing, $paths));
        }

        // Auditor Images
        if ($request->hasFile('auditor_images')) {
            $paths = [];
            foreach ($request->file('auditor_images') as $image) {
                $paths[] = Storage::url($image->store('public/construction/auditor_images'));
            }
            $existing = json_decode($job->auditor_images, true) ?? [];
            $job->auditor_images = json_encode(array_merge($existing, $paths));
        }
        // 5. Job Measures ko update karein
        if ($request->has('measures_details')) {
            foreach ($request->measures_details as $measureData) {
                JobMeasure::updateOrCreate(
                    ['id' => $measureData['id'] ?? null, 'construction_job_id' => $job->id],
                    $measureData
                );
            }
        }

        // 6. Job ko save karein
        $job->save();

        return redirect()->route('admin.jobs.index')->with('success', 'Job updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ConstructionJob $job)
    {
        if ($job->customer_signature) {
            Storage::disk('public')->delete($job->customer_signature);
        }
        
        if ($job->inspection_image) {
             foreach ($job->inspection_image as $imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        // Condition report images ko bhi delete karein
        if ($job->pre_job_images) {
            $pre_images = json_decode($job->pre_job_images);
            if (is_array($pre_images)) {
                foreach ($pre_images as $url) {
                    Storage::disk('public')->delete(str_replace('/storage', '', $url));
                }
            }
        }

        if ($job->post_job_images) {
            $post_images = json_decode($job->post_job_images);
            if (is_array($post_images)) {
                foreach ($post_images as $url) {
                    Storage::disk('public')->delete(str_replace('/storage', '', $url));
                }
            }
        }

        $job->delete();
        return redirect()->route('admin.jobs.index')->with('success', 'Job deleted successfully!');
    }
}
