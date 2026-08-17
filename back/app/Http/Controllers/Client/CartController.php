<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart\Cart;
use App\Models\Cart\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addToCart(Request $request, $product_id)
    {
        $client_id = $request->get('client_id') ?? $request->get('id_user');
        $quantity = $request->get('quantity', 1); // por defecto 1 si no envía

        if (!$client_id) {
            return response()->json(['error' => 'Identificador de cliente no proporcionado.'], 400);
        }

        if ($quantity <= 0) {
            return response()->json(['error' => 'La cantidad debe ser mayor a 0.'], 400);
        }

        // 🔹 Buscar el producto activo
        $product = Product::where('id', $product_id)
            ->where('status', 'active')
            ->first();

        if (!$product) {
            return response()->json(['error' => 'El producto no existe o no está disponible.'], 404);
        }

        // 🔹 Buscar o crear el carrito activo
        $cart = Cart::firstOrCreate(
            ['fk_client_id' => $client_id, 'status' => 'active']
        );

        // 🔹 Buscar si el producto ya está en el carrito
        $cart_item = CartItem::where([
            'fk_cart_id' => $cart->id,
            'fk_product_id' => $product->id,
        ])->first();

        if ($cart_item) {
            // 🔹 Si ya existe, aumentar cantidad
            $cart_item->increment('quantity_item', $quantity);
        } else {
            // 🔹 Crear nuevo ítem
            CartItem::create([
                'fk_cart_id' => $cart->id,
                'fk_product_id' => $product->id,
                'name_product' => $product->name,
                'price_product' => $product->price,
                'quantity_item' => $quantity,
            ]);
        }

        return response()->json([
            'message' => 'Producto agregado al carrito correctamente.',
            'cart' => $cart,
        ], 200);
    }

    public function getCart(Request $request)
    {
        $client_id = $request->get('client_id') ?? $request->get('id_user');

        if (!$client_id) {
            return response()->json(['cart' => null, 'cart_items' => [], 'total_items' => 0], 200);
        }

        // 🔹 Buscar el carrito activo del cliente
        $cart = Cart::where('fk_client_id', $client_id)
            ->where('status', 'active')
            ->select('id')
            ->first();


        if (!$cart) {
            return response()->json(['cart' => [], 'total_items' => 0], 200);
        }

        // 🔹 Obtener ítems del carrito
        $cart_items = CartItem::where('fk_cart_id', $cart->id)
            ->select('id', 'fk_product_id', 'name_product', 'price_product', 'quantity_item')
            ->orderBy('created_at', 'asc')
            ->get();

        // 🔹 Calcular total de ítems
        $total_items = $cart_items->sum('quantity_item');

        return response()->json([
            'cart' => $cart->id,
            'cart_items' => $cart_items,
            'total_items' => $total_items,
        ], 200);
    }

    public function deleteAllItems($cart_id)
    {
        $items = CartItem::where('fk_cart_id', $cart_id)->get();

        if ($items->isEmpty()) {
            return response()->json(['message' => 'Carro no tiene items'], 404);
        }

        CartItem::where('fk_cart_id', $cart_id)->delete();

        return response()->json(['message' => 'Items eliminados correctamente']);
    }

    /*
    public function updateCartItemQuantity(Request $request, $cart_item_id)
    {
        $id_representative = $request->get('id_representative');

        $request->validate([
            'action' => 'required|in:increase,decrease,delete',
        ]);

        // 🔹 Buscar el carrito activo del representante
        $cart = Cart::where('fk_representative_id', $id_representative)
            ->where('status', 'active')
            ->select('id')
            ->first();

        if (!$cart) {
            return response()->json(['message' => 'Carrito no encontrado'], 404);
        }

        // 🔹 Buscar el item en el carrito y validar que pertenece al representante
        $cart_item = CartItem::where('id', $cart_item_id)
            ->where('fk_cart_id', $cart->id)
            ->select(
                'id',
                'quantity',
                'fk_menu_id'
            )
            ->first();

        if (!$cart_item) {
            return response()->json(['message' => 'Item no encontrado'], 404);
        }

        // 🔹 Obtener el stock disponible del menú
        $menu = Menu::where('id', $cart_item->fk_menu_id)
            ->exists();

        if (!$menu) {
            return response()->json(['message' => 'Menú no encontrado'], 404);
        }

        // 🔹 Verificar la acción y actualizar la cantidad respetando el stock
        if ($request->action === 'increase') {
            $cart_item->increment('quantity', 1);
        } elseif ($request->action === 'decrease' && $cart_item->quantity > 1) {
            $cart_item->quantity -= 1;
            $cart_item->save();
        } elseif ($request->action === "delete") {
            $cart_item->delete();
        }

        // Contar la cantidad total de ítems en el carrito
        $total_items = (int) CartItem::where('fk_cart_id', $cart->id)->sum('quantity');

        return response()->json([
            'message' => $request->action === "delete" ? 'Item eliminado correctamente' : 'Cantidad actualizada',
            'new_quantity' => $request->action === "delete" ? null : $cart_item->quantity,
            'total_items' => $total_items,
        ]);
    }

    public function getCartItemCount(Request $request)
    {
        $id_representative = $request->get('id_representative');

        // Buscar el carrito activo del representante
        $cart = Cart::where('fk_representative_id', $id_representative)
            ->where('status', 'active')
            ->select('id')
            ->first();

        if (!$cart) {
            return response()->json(['count' => 0], 200);
        }

        // Contar la cantidad total de ítems en el carrito
        $total_items = (int) CartItem::where('fk_cart_id', $cart->id)->sum('quantity');

        return response()->json(['total_items' => $total_items], 200);
    }

    public function validateCart(Request $request)
    {
        $id_representative = $request->get('id_representative');

        // 🔹 Buscar el carrito activo del representante
        $cart = Cart::where('fk_representative_id', $id_representative)
            ->where('status', 'active')
            ->select('id')
            ->first();

        if (!$cart) {
            return response()->json([
                'valid' => false,
                'message' => 'El carrito está vacío.',
                'out_of_stock_items' => []
            ], 400);
        }

        // 🔹 Obtener los ítems del carrito con la información del menú
        $cart_items = CartItem::join('menus', 'cart_items.fk_menu_id', '=', 'menus.id')
            ->where('cart_items.fk_cart_id', $cart->id)
            ->select(
                'cart_items.id',
                'cart_items.fk_menu_id',
                'cart_items.quantity',
                'menus.bottom_plate',
                'menus.available_from',
            )
            ->get();

        if ($cart_items->isEmpty()) {
            return response()->json([
                'valid' => false,
                'message' => 'El carrito no contiene productos.',
                'out_of_stock_items' => []
            ], 400);
        }

        $today = Carbon::today();
        $is_expired = false;

        foreach ($cart_items as $item) {
            if ($is_expire = Carbon::parse($item->available_from)->lt($today)) {
                $is_expired = $is_expire;
            }
        }

        if ($is_expired) {
            return response()->json([
                'valid' => false,
                'message' => 'El carrito contiene productos expirados',
            ], 400);
        }

        return response()->json([
            'valid' => true,
            'message' => 'El carrito es válido para proceder.',
            'out_of_stock_items' => []
        ], 200);
    } */
}
