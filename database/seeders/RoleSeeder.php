<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role; // Role model ko import karein

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pehle check karein ke roles mojood to nahi
        if (Role::count() == 0) {
            Role::create(['name' => 'admin']);
            Role::create(['name' => 'user']);
        }
    }
}
