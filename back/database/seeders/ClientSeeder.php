<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Client::updateOrCreate(
            ['email' => 'cliente@gmail.com'],
            [
                'rut' => '12345678',
                'name' => 'cliente',
                'lastname' => 'test',
                'address' => 'Av, siempre viva',
                'phone' => '+56999999999',
                'password' => Hash::make('12345678'),
                'status' => 'active',
            ]
        );
    }
}
