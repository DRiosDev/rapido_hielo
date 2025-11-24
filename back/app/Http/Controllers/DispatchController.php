<?php

namespace App\Http\Controllers;

use App\Models\Order\Order;
use App\Traits\Filterable;
use Illuminate\Http\Request;

class DispatchController extends Controller
{
    use Filterable;

    public function index(Request $request)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'field' => 'nullable|in:created_at_show,number_order', //Campos sorter
            'order' => 'nullable|in:asc,desc',
        ]);

        $allowed_filters = ['number_order', 'status', 'status_dispatch'];

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

        $query = Order::with('client:id,name,lastname')
            ->select([
                'id',
                'id as key',
                'fk_client_id',
                'number_order',
                'total',
                'total_quantity',
                'status',
                'date_dispatch',
                'time_dispatch',
                'address_dispatch',
                'method_payment',
                'status_dispatch',
                'created_at as created_at_show'
            ]);

        $query->where(function ($q) {
            $q->where(function ($q2) {
                $q2->where('method_payment', 2)
                    ->where('status', 'paid');
            })
                ->orWhere(function ($q3) {
                    $q3->where('method_payment', 1)
                        ->where('status', 'pending_payment');
                });
        });

        $this->applyInFilters($query, $filters, ['number_order', 'status', 'status_dispatch']); // Aplicar filtros whereIn de forma dinámica

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
}
