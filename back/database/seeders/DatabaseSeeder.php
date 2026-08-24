<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Owner User
        User::firstOrCreate(
            ['email' => 'owner@gmail.com'],
            [
                'rut' => '11.111.111-1',
                'name' => 'Owner',
                'lastname' => 'User',
                'phone' => '911111111',
                'role' => 'owner',
                'status' => 'active',
                'password' => Hash::make('12345678'),
            ]
        );

        // Employee User
        User::firstOrCreate(
            ['email' => 'employed@gmail.com'],
            [
                'rut' => '22.222.222-2',
                'name' => 'Employed',
                'lastname' => 'User',
                'phone' => '922222222',
                'role' => 'admin',
                'status' => 'active',
                'password' => Hash::make('12345678'),
            ]
        );

        // Ejecutar los seeders en orden
        $this->call([
            ClientSeeder::class,
            ProductSeeder::class,
            InventoryMovementSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
