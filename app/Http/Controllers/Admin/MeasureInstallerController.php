<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeasureInstaller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeasureInstallerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Personnel/Index', [
            'items' => MeasureInstaller::latest()->paginate(10),
            'title' => 'Measure Installers',
            'routeName' => 'admin.measure-installers'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:measure_installers']);
        MeasureInstaller::create($request->all());
        return redirect()->back()->with('success', 'Measure Installer created.');
    }

    public function update(Request $request, MeasureInstaller $measureInstaller)
    {
        $request->validate(['name' => 'required|string|max:255|unique:measure_installers,name,' . $measureInstaller->id]);
        $measureInstaller->update($request->all());
        return redirect()->back()->with('success', 'Measure Installer updated.');
    }

    public function destroy(MeasureInstaller $measureInstaller)
    {
        $measureInstaller->delete();
        return redirect()->back()->with('success', 'Measure Installer deleted.');
    }
}
