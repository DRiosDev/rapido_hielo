<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Limpiar movimientos de inventario que tengan fk_product_id no UUID (o no válidos)
        $movements = DB::table('inventory_movements')->get(['id', 'fk_product_id']);
        $invalidMovementIds = [];
        foreach ($movements as $movement) {
            $fk = (string) $movement->fk_product_id;
            if (!Uuid::isValid($fk)) {
                $invalidMovementIds[] = $movement->id;
            }
        }
        if (!empty($invalidMovementIds)) {
            DB::table('inventory_movements')->whereIn('id', $invalidMovementIds)->delete();
        }

        // Limpiar cart_items con fk_product_id no UUID
        $cartItems = DB::table('cart_items')->get(['id', 'fk_product_id']);
        $invalidCartIds = [];
        foreach ($cartItems as $item) {
            $fk = (string) $item->fk_product_id;
            if (!Uuid::isValid($fk)) {
                $invalidCartIds[] = $item->id;
            }
        }
        if (!empty($invalidCartIds)) {
            DB::table('cart_items')->whereIn('id', $invalidCartIds)->delete();
        }

        // Limpiar order_items con fk_product_id no UUID
        $orderItems = DB::table('order_items')->get(['id', 'fk_product_id']);
        $invalidOrderIds = [];
        foreach ($orderItems as $item) {
            $fk = (string) $item->fk_product_id;
            if (!Uuid::isValid($fk)) {
                $invalidOrderIds[] = $item->id;
            }
        }
        if (!empty($invalidOrderIds)) {
            DB::table('order_items')->whereIn('id', $invalidOrderIds)->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No requiere revertir limpieza de datos corruptos o de prueba inválidos
    }
};
