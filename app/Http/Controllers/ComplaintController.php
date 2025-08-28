<?php

    namespace App\Http\Controllers;

    use App\Models\Complaint;
    use App\Models\ConstructionJob;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Storage;
    use Illuminate\Support\Facades\Validator;

    class ComplaintController extends Controller
    {
        public function store(Request $request, ConstructionJob $job)
        {
            $validator = Validator::make($request->all(), [
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
                'status' => 'required|in:Pending,Completed',
                'assigned_to' => 'nullable|string',
                'resolved_by' => 'nullable|string',
                'visit_date' => 'nullable|date',
                'close_date' => 'nullable|date',
                'department' => 'nullable|string',
                'measure_name' => 'nullable|string',
                'priority' => 'required|in:Low,Medium,High',
                'images.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,png,jpeg|max:10240', // 10MB max
            ]);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $validatedData = $validator->validated();
            $validatedData['construction_job_id'] = $job->id;

            // Handle file uploads
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $storedPath = $file->store('public/complaint_images');
                    $imagePaths[] = [
                        'name' => $originalName,
                        'path' => Storage::url($storedPath)
                    ];
                }
                $validatedData['images'] = $imagePaths;
            }

            Complaint::create($validatedData);

            return redirect()->back()->with('success', 'Complaint added successfully!');
        }
    }