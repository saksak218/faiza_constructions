<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstallationSupervisor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstallationSupervisorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Personnel/Index', [
            'items' => InstallationSupervisor::latest()->paginate(10),
            'title' => 'Installation Supervisors',
            'routeName' => 'admin.installation-supervisors'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:installation_supervisors']);
        InstallationSupervisor::create($request->all());
        return redirect()->back()->with('success', 'Installation Supervisor created.');
    }

    public function update(Request $request, InstallationSupervisor $installationSupervisor)
    {
        $request->validate(['name' => 'required|string|max:255|unique:installation_supervisors,name,' . $installationSupervisor->id]);
        $installationSupervisor->update($request->all());
        return redirect()->back()->with('success', 'Installation Supervisor updated.');
    }

    public function destroy(InstallationSupervisor $installationSupervisor)
    {
        $installationSupervisor->delete();
        return redirect()->back()->with('success', 'Installation Supervisor deleted.');
    }
}
