<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Bolsas normales de hielo
            [
                'name' => 'Bolsa de Hielo 1kg',
                'description' => 'Bolsa de hielo tradicional en cubos 1kg',
                'weight' => 1,
                'unit' => 'kg',
                'price' => 1000,
                'quantity' => 100,
                'min_stock' => 20,
                'is_limited' => false,
                'is_sack' => false,
                'status' => 'active',
            ],
            [
                'name' => 'Bolsa de Hielo 3kg',
                'description' => 'Bolsa de hielo tradicional en cubos 3kg',
                'weight' => 3,
                'unit' => 'kg',
                'price' => 2500,
                'quantity' => 80,
                'min_stock' => 15,
                'is_limited' => false,
                'is_sack' => false,
                'status' => 'active',
            ],

            // Sacos (Productos tipo Saco)
            [
                'name' => 'Saco de Hielo 15kg',
                'description' => 'Saco de hielo 15kg para empaque y formato al por mayor',
                'weight' => 15,
                'unit' => 'kg',
                'price' => 10000,
                'quantity' => 30,
                'min_stock' => 5,
                'is_limited' => false,
                'is_sack' => true,
                'status' => 'active',
            ],
            [
                'name' => 'Saco de Hielo 20kg',
                'description' => 'Saco de hielo 20kg formato gigante para eventos',
                'weight' => 20,
                'unit' => 'kg',
                'price' => 13000,
                'quantity' => 15,
                'min_stock' => 5,
                'is_limited' => false,
                'is_sack' => true,
                'status' => 'active',
            ],

            // Producto de stock limitado
            [
                'name' => 'Hielo Gourmet Stock Limitado',
                'description' => 'Edición limitada de cubos de hielo gourmet de alta densidad',
                'weight' => 2,
                'unit' => 'kg',
                'price' => 4000,
                'quantity' => 15,
                'min_stock' => 5,
                'is_limited' => true,
                'is_sack' => false,
                'status' => 'active',
            ],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate(
                ['name' => $data['name']],
                $data
            );
        }
    }
}
