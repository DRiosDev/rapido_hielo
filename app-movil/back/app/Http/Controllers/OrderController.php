<?php

namespace App\Http\Controllers;

use App\Models\Cart\Cart;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store($cart_id)
    {
        // Se obtiene el carrito con sus items
        $cart = Cart::with('items')->find($cart_id);

        if (!$cart) {
            return response()->json(['error' => 'Carro no encontrado'], 404);
        }

        // Verificar si el carrito tiene items
        if ($cart->items->isEmpty()) {
            return response()->json(['error' => 'El carro no tiene items'], 400);
        }

        // Calcular total y cantidad total
        $total_quantity = $cart->items->sum('quantity_item');
        $total = $cart->items->reduce(function ($carry, $item) {
            return $carry + ($item->price_product * $item->quantity_item);
        }, 0);

        // Generar número de orden autoincremental
        $last_order = Order::orderBy('number_order', 'desc')->first();
        $next_number = $last_order ? $last_order->number_order + 1 : 1;

        DB::beginTransaction();

        try {
            // Crear la orden
            $order = Order::create([
                'fk_client_id' => $cart->fk_client_id,
                'number_order' => $next_number,
                'total' => $total,
                'total_quantity' => $total_quantity,
                'status' => 'pending_payment',
            ]);

            // Copiar los items del carrito a los de la orden
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'fk_order_id' => $order->id,
                    'fk_product_id' => $item->fk_product_id,
                    'name_product' => $item->name_product,
                    'price_product' => $item->price_product,
                    'quantity' => $item->quantity_item,
                ]);
            }

            // Eliminar los items del carrito
            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Orden creada con éxito',
                'order' => $order,
                'total_items' => $total_quantity,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create order',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $order_id)
    {
        $order = Order::find($order_id);
        if (!$order) {
            return response()->json(['error' => 'Orden no encontrada'], 404);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vauchers', 'public');

            $order->url = $path;
        }

        $order->save();

        return response()->json(['message' => 'Comprobante guardado'], 200);
    }
}
