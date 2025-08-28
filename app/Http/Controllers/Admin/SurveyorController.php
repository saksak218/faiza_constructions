<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Surveyor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Personnel/Index', [
            'items' => Surveyor::latest()->paginate(10),
            'title' => 'Surveyors',
            'routeName' => 'admin.surveyors'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:surveyors']);
        Surveyor::create($request->all());
        return redirect()->back()->with('success', 'Surveyor created.');
    }

    public function update(Request $request, Surveyor $surveyor)
    {
        $request->validate(['name' => 'required|string|max:255|unique:surveyors,name,' . $surveyor->id]);
        $surveyor->update($request->all());
        return redirect()->back()->with('success', 'Surveyor updated.');
    }

    public function destroy(Surveyor $surveyor)
    {
        $surveyor->delete();
        return redirect()->back()->with('success', 'Surveyor deleted.');
    }
}
