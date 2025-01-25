<?php

namespace App\Http\Controllers;

use App\Models\ConstructionJob;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ConstructionJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100]) ? $perPage : 10;

        $query = ConstructionJob::query();

        // Existing sorting and search logic
        $sortableColumns = ['id', 'address', 'created_at'];
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');

        if (in_array($sortColumn, $sortableColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $jobs = $query->paginate($perPage)->appends($request->query());

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs,
            'sort' => $sortColumn,
            'direction' => $sortDirection,
            'search' => $request->input('search', ''),
            'per_page' => $perPage
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:255', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
        ]);


        ConstructionJob::create([
            'address' => $validated['address'],
            'status'=> $validated['status'],
            'user_id' => Auth()->id()
        ]);

        return redirect()->back()->with('message', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(ConstructionJob $constructionJob)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ConstructionJob $constructionJob)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ConstructionJob $job)
    {
        // dd($job);
        $validated = $request->validate([
            'address' => ['required', 'string', 'max:255'],
            'date_inspection' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:255', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
        ]);



        $job->user_id = Auth()->id();
        $job->address = $validated['address'];
        $job->date_inspection = $validated['date_inspection'];
        $job->status = $validated['status'];


        $job->save();

        return redirect()->back()->with('message', 'Job updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ConstructionJob $job)
    {
        $job->delete();
        return redirect()->back()->with('message', 'Job deleted successfully');
    }
}
