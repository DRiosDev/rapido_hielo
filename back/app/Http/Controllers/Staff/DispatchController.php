<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order\Order;
use App\Traits\Filterable;
use Illuminate\Http\Request;

class DispatchController extends Controller
{
    use Filterable;

    /**
     * Obtener los datos brutos del KPI de Despachos Activos en el momento
     */
    public function getActiveDispatchesData()
    {
        // Despachos activos (pendientes o en ruta, no entregados ni cancelados)
        $activeDispatchesCount = Order::where(function ($q) {
            $q->where(function ($q2) {
                $q2->where('method_payment', 2)
                    ->where('status', 'paid');
            })
            ->orWhere(function ($q3) {
                $q3->where('method_payment', 1)
                    ->where('status', 'pending_payment');
            });
        })
        ->whereIn('status_dispatch', ['pending', 'pending_dispatch', 'in_route'])
        ->count();

        // Conteo específico de despachos que están en ruta en este instante
        $inRouteCount = Order::where('status_dispatch', 'in_route')->count();

        return [
            'id' => 'active_dispatches',
            'title' => 'Despachos Activos',
            'value' => $activeDispatchesCount,
            'suffix' => ' despachos',
            'trendText' => $inRouteCount > 0 ? $inRouteCount . ' en ruta ahora' : 'Pendientes de despacho',
        ];
    }

    /**
     * Endpoint GET /api/staff/dispatches/kpi-active
     */
    public function getActiveDispatchesKpi()
    {
        return response()->json([
            'data' => $this->getActiveDispatchesData()
        ], 200);
    }

    /**
     * Obtener el desglose de despachos por estado (para el gráfico de barras horizontales)
     */
    public function getDispatchStatusData()
    {
        $today = \Illuminate\Support\Carbon::today();

        // Conteo por estado de despacho
        $delivered = Order::whereIn('status_dispatch', ['delivered'])
            ->whereDate('updated_at', $today)
            ->count();

        $inRoute = Order::whereIn('status_dispatch', ['in_route'])
            ->count();

        $prepared = Order::whereIn('status_dispatch', ['prepared', 'pending_dispatch'])
            ->count();

        $pending = Order::whereIn('status_dispatch', ['pending'])
            ->count();

        return [
            ['status' => 'Entregado', 'count' => $delivered, 'color' => '#10B981'],
            ['status' => 'En ruta', 'count' => $inRoute, 'color' => '#0EA5E9'],
            ['status' => 'Preparado', 'count' => $prepared, 'color' => '#F59E0B'],
            ['status' => 'Pendiente', 'count' => $pending, 'color' => '#94A3B8'],
        ];
    }

    /**
     * Endpoint GET /api/staff/dispatches/chart-status
     */
    public function getDispatchStatusChart()
    {
        return response()->json([
            'data' => $this->getDispatchStatusData()
        ], 200);
    }



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

        $query = Order::with('client:id,name,lastname', 'items:id,fk_order_id,price_product,quantity')
            ->select([
                'id',
                'id as key',
                'fk_client_id',
                'number_order',
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
            $order->total_quantity = $order->items->sum('quantity');
            $order->total = $order->items->reduce(function ($carry, $item) {
                return $carry + ($item->price_product * $item->quantity);
            }, 0);
            unset($order->items);
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
