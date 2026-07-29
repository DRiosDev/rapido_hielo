<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (\App\Models\User::count() === 0) {
            \App\Models\User::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'David',
                'lastname' => 'Rios',
                'email' => 'david.alberto2212@gmail.com',
                'rut' => '20.368.565-3',
                'phone' => '988863598',
                'role' => 'owner',
                'status' => 'active',
                'password' => \Illuminate\Support\Facades\Hash::make('12345678'),
            ]);
        }
    }
}
