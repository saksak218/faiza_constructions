<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeadGenerator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadGeneratorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Personnel/Index', [
            'items' => LeadGenerator::latest()->paginate(10),
            'title' => 'Lead Generators',
            'routeName' => 'admin.lead-generators'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:lead_generators']);
        LeadGenerator::create($request->all());
        return redirect()->back()->with('success', 'Lead Generator created.');
    }

    public function update(Request $request, LeadGenerator $leadGenerator)
    {
        $request->validate(['name' => 'required|string|max:255|unique:lead_generators,name,' . $leadGenerator->id]);
        $leadGenerator->update($request->all());
        return redirect()->back()->with('success', 'Lead Generator updated.');
    }

    public function destroy(LeadGenerator $leadGenerator)
    {
        $leadGenerator->delete();
        return redirect()->back()->with('success', 'Lead Generator deleted.');
    }
}
