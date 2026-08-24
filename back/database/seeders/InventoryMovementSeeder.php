<?php

namespace Database\Seeders;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class InventoryMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'owner')->first() ?? User::first();

        // Movimientos para los sacos (Relleno de sacos)
        $saco15 = Product::where('name', 'Saco de Hielo 15kg')->first();
        if ($saco15) {
            InventoryMovement::firstOrCreate(
                [
                    'fk_product_id' => $saco15->id,
                    'reason' => 'Relleno y empaque de sacos de hielo 15kg'
                ],
                [
                    'fk_user_id' => $user?->id,
                    'action' => 'add',
                    'quantity' => 30,
                    'previous_stock' => 0,
                    'new_stock' => 30,
                ]
            );
        }

        $saco20 = Product::where('name', 'Saco de Hielo 20kg')->first();
        if ($saco20) {
            InventoryMovement::firstOrCreate(
                [
                    'fk_product_id' => $saco20->id,
                    'reason' => 'Relleno y empaque de sacos de hielo 20kg'
                ],
                [
                    'fk_user_id' => $user?->id,
                    'action' => 'add',
                    'quantity' => 15,
                    'previous_stock' => 0,
                    'new_stock' => 15,
                ]
            );
        }

        // Movimientos para producto de stock limitado
        $gourmet = Product::where('name', 'Hielo Gourmet Stock Limitado')->first();
        if ($gourmet) {
            InventoryMovement::firstOrCreate(
                [
                    'fk_product_id' => $gourmet->id,
                    'reason' => 'Ingreso inicial de producto de stock limitado'
                ],
                [
                    'fk_user_id' => $user?->id,
                    'action' => 'add',
                    'quantity' => 15,
                    'previous_stock' => 0,
                    'new_stock' => 15,
                ]
            );
        }

        // Movimiento para bolsas normales
        $bolsa1 = Product::where('name', 'Bolsa de Hielo 1kg')->first();
        if ($bolsa1) {
            InventoryMovement::firstOrCreate(
                [
                    'fk_product_id' => $bolsa1->id,
                    'reason' => 'Ingreso inicial de bolsas de hielo 1kg'
                ],
                [
                    'fk_user_id' => $user?->id,
                    'action' => 'add',
                    'quantity' => 100,
                    'previous_stock' => 0,
                    'new_stock' => 100,
                ]
            );
        }
    }
}
