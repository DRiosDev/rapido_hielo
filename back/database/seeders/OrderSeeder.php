<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = Client::where('email', 'cliente@gmail.com')->first();

        if (!$client) {
            return;
        }

        $bolsa1kg = Product::where('name', 'Bolsa de Hielo 1kg')->first();
        $bolsa3kg = Product::where('name', 'Bolsa de Hielo 3kg')->first();
        $saco15kg = Product::where('name', 'Saco de Hielo 15kg')->first();
        $saco20kg = Product::where('name', 'Saco de Hielo 20kg')->first();
        $gourmet = Product::where('name', 'Hielo Gourmet Stock Limitado')->first();

        // 1. Orden 1001 - Entregada y Pagada
        $order1 = Order::updateOrCreate(
            ['number_order' => 1001],
            [
                'fk_client_id' => $client->id,
                'status' => 'paid',
                'status_dispatch' => 'delivered',
                'date_dispatch' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'time_dispatch' => '10:00 - 12:00',
                'address_dispatch' => $client->address,
                'method_payment' => '2',
                'url_vaucher' => 'vouchers/vaucher_1001.png',
            ]
        );

        // Limpiar ítems previos si existían para evitar duplicación
        OrderItem::where('fk_order_id', $order1->id)->delete();

        if ($bolsa1kg) {
            OrderItem::create([
                'fk_product_id' => $bolsa1kg->id,
                'fk_order_id' => $order1->id,
                'name_product' => $bolsa1kg->name,
                'price_product' => (int) $bolsa1kg->price,
                'quantity' => 2,
            ]);
        }

        if ($saco15kg) {
            OrderItem::create([
                'fk_product_id' => $saco15kg->id,
                'fk_order_id' => $order1->id,
                'name_product' => $saco15kg->name,
                'price_product' => (int) $saco15kg->price,
                'quantity' => 1,
            ]);
        }

        // 2. Orden 1002 - En ruta y Pagada
        $order2 = Order::updateOrCreate(
            ['number_order' => 1002],
            [
                'fk_client_id' => $client->id,
                'status' => 'paid',
                'status_dispatch' => 'in_route',
                'date_dispatch' => Carbon::today()->format('Y-m-d'),
                'time_dispatch' => '14:00 - 16:00',
                'address_dispatch' => $client->address,
                'method_payment' => '2',
                'url_vaucher' => 'vouchers/vaucher_1002.png',
            ]
        );

        OrderItem::where('fk_order_id', $order2->id)->delete();

        if ($gourmet) {
            OrderItem::create([
                'fk_product_id' => $gourmet->id,
                'fk_order_id' => $order2->id,
                'name_product' => $gourmet->name,
                'price_product' => (int) $gourmet->price,
                'quantity' => 1,
            ]);
        }

        if ($bolsa3kg) {
            OrderItem::create([
                'fk_product_id' => $bolsa3kg->id,
                'fk_order_id' => $order2->id,
                'name_product' => $bolsa3kg->name,
                'price_product' => (int) $bolsa3kg->price,
                'quantity' => 2,
            ]);
        }

        // 3. Orden 1003 - Pendiente de Pago y Pendiente de Despacho
        $order3 = Order::updateOrCreate(
            ['number_order' => 1003],
            [
                'fk_client_id' => $client->id,
                'status' => 'pending_payment',
                'status_dispatch' => 'pending',
                'date_dispatch' => Carbon::tomorrow()->format('Y-m-d'),
                'time_dispatch' => '16:00 - 18:00',
                'address_dispatch' => $client->address,
                'method_payment' => '1',
                'url_vaucher' => 'N/A',
            ]
        );

        OrderItem::where('fk_order_id', $order3->id)->delete();

        if ($bolsa1kg) {
            OrderItem::create([
                'fk_product_id' => $bolsa1kg->id,
                'fk_order_id' => $order3->id,
                'name_product' => $bolsa1kg->name,
                'price_product' => (int) $bolsa1kg->price,
                'quantity' => 3,
            ]);
        }

        if ($saco20kg) {
            OrderItem::create([
                'fk_product_id' => $saco20kg->id,
                'fk_order_id' => $order3->id,
                'name_product' => $saco20kg->name,
                'price_product' => (int) $saco20kg->price,
                'quantity' => 1,
            ]);
        }
    }
}
