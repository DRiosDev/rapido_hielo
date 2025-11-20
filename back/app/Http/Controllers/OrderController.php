<?php

namespace App\Http\Controllers;

use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Traits\Filterable;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use Filterable;

    public function index(Request $request)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'field' => 'nullable|in:created_at_show,number_order', //Campos sorter
            'order' => 'nullable|in:asc,desc',
        ]);

        $allowed_filters = ['number_order', 'status'];

        if ($request->filled('filters')) {
            foreach (array_keys($request->filters) as $key) {
                if (!in_array($key, $allowed_filters)) {
                    return response()->json([
                        'message' => 'Solo puedes filtrar por: ' . implode(', ', $allowed_filters)
                    ], 422);
                }
            }
        }

        $current = $request->get('current', 1);
        $page_size = $request->get('pageSize', 10);
        $field = $request->get('field', 'created_at_show');
        $order = $request->get('order', 'desc');
        $filters = $request->get('filters', []);

        $query = Order::with('client:id,rut,name,lastname,email')
            ->with('items')
            ->select([
                'id',
                'id as key',
                'fk_client_id',
                'number_order',
                'total',
                'total_quantity',
                'url',
                'status',
                'created_at as created_at_show'
            ]);

        $this->applyInFilters($query, $filters, ['number_order', 'status']); // Aplicar filtros whereIn de forma dinámica

        $paginated_data = $query->orderBy($field, $order)
            ->paginate($page_size, ['*'], 'page', $current);

        // eliminar fk_client_id después de cargar la relación
        $paginated_data->getCollection()->transform(function ($order) {
            unset($order->fk_client_id); // quita el id del cliente
            return $order;
        });

        $response = [
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ];

        return response()->json($response, 200);
    }

    public function showOrderItems(Request $request, $order_id)
    {

        $request->validate([
            'current' => 'nullable|integer|min:1',
            'field' => 'nullable|in:created_at_show,total', //Campos sorter
            'order' => 'nullable|in:asc,desc',
        ]);

        $allowed_filters = ['number_order'];

        if ($request->filled('filters')) {
            foreach (array_keys($request->filters) as $key) {
                if (!in_array($key, $allowed_filters)) {
                    return response()->json([
                        'message' => 'Solo puedes filtrar por: ' . implode(', ', $allowed_filters)
                    ], 422);
                }
            }
        }

        $current = $request->get('current', 1);
        $page_size = $request->get('pageSize', 10);
        $field = $request->get('field', 'created_at_show');
        $order = $request->get('order', 'desc');
        $filters = $request->get('filters', []);

        $query = OrderItem::select([
            'id',
            'id as key',
            'name_product',
            'price_product',
            'quantity',
            'created_at as created_at_show'
        ])->where('fk_order_id', $order_id);

        $this->applyInFilters($query, $filters, ['name_product']); // Aplicar filtros whereIn de forma dinámica

        $paginated_data = $query->orderBy($field, $order)
            ->paginate($page_size, ['*'], 'page', $current);

        // eliminar fk_client_id después de cargar la relación
        $paginated_data->getCollection()->transform(function ($order) {
            unset($order->fk_client_id); // quita el id del cliente
            return $order;
        });

        $response = [
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ];

        return response()->json($response, 200);
    }

    public function showVaucher($order_id)
    {
        $order = Order::select('id', 'vaucher')->where('id', $order_id)->first();

        return response()->json([
            'order' => $order
        ], 200);
    }
}
