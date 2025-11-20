<?php

namespace App\Http\Controllers;

use App\Models\Cart\Cart;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request, $cart_id)
    {
        $date_delivery = $request->input('date_delivery');

        /** @var \App\Models\Cart\Cart|null $cart */
        $cart = Cart::with('items', 'client:id,address')->find($cart_id);

        if (!$cart) {
            return response()->json(['error' => 'Carro no encontrado'], 404);
        }

        // Asegurar que items sea una Collection para que Intelephense no marque métodos como isEmpty(), sum(), reduce()
        if (! $cart->items instanceof \Illuminate\Support\Collection) {
            $cart->setRelation('items', collect($cart->items));
        }

        $items = $cart->items;

        // Verificar si el carrito tiene items
        if ($items->isEmpty()) {
            return response()->json(['error' => 'El carro no tiene items'], 400);
        }

        // Calcular total y cantidad total
        $total_quantity = $items->sum('quantity_item');
        $total = $items->reduce(function ($carry, $item) {
            return $carry + ($item->price_product * $item->quantity_item);
        }, 0);

        // Generar número de orden autoincremental
        $last_order = Order::orderBy('number_order', 'desc')->first();
        $next_number = $last_order ? $last_order->number_order + 1 : 1;

        $address_dispatch = $request->input('address_dispatch')
            ? $request->input('address_dispatch')
            : $cart->client->address;

        DB::beginTransaction();

        try {
            // Crear la orden
            $order = Order::create([
                'fk_client_id' => $cart->fk_client_id,
                'number_order' => $next_number,
                'total' => $total,
                'total_quantity' => $total_quantity,
                'date_dispatch' => $date_delivery ? date('d-m-Y', strtotime($date_delivery)) : null,
                'time_disdispatch' => $request->input('hour_delivery'),
                'method_payment' => $request->input('method_payment'),
                'address_dispatch' => $address_dispatch,
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
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Failed to create order',
                'details' => $e->__toString() // imprime TODO
            ], 500);
        }
    }

    public function submitPaymentProof(Request $request, $order_id)
    {
        $order = Order::find($order_id);
        if (!$order) {
            return response()->json(['error' => 'Orden no encontrada'], 404);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vauchers', 'public');

            $order->url = $path;
            $order->status = 'payment_under_review';
        }

        $order->save();

        return response()->json(['message' => 'Comprobante guardado'], 200);
    }
}
