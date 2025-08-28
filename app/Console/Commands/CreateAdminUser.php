<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin-user'; // Command ka naam

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating a new admin user...');

        // Admin role dhoondein
        $adminRole = Role::where('name', 'admin')->first();
        if (!$adminRole) {
            $this->error('Admin role not found. Please run "php artisan db:seed" first.');
            return 1; // Error code ke sath exit karein
        }

        // User se details lein
        $name = $this->ask('Enter the name of the admin');
        $email = $this->ask('Enter the email of the admin');
        $password = $this->secret('Enter a password for the admin'); // 'secret' password ko chupata hai

        // Input ko validate karein
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            $this->info('Admin user not created. See error messages below:');
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        // User banayein
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role_id' => $adminRole->id, // Admin role assign karein
        ]);

        $this->info("Admin user '{$user->name}' created successfully!");
        return 0; // Success code
    }
}