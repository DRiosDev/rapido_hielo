<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Traits\Filterable;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    use Filterable;

    /**
     * Obtener los datos brutos del KPI de Ingresos Totales del Mes (solo órdenes pagadas)
     */
    public function getMonthlyRevenueData()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Ingresos del mes actual (solo status = 'paid')
        $currentMonthRevenue = (float) (Order::where('orders.status', 'paid')
            ->whereBetween('orders.created_at', [$startOfMonth, $endOfMonth])
            ->join('order_items', 'orders.id', '=', 'order_items.fk_order_id')
            ->selectRaw('SUM(order_items.price_product * order_items.quantity) as total')
            ->value('total') ?? 0);

        // Cantidad de órdenes pagadas del mes actual
        $currentMonthPaidOrdersCount = Order::where('status', 'paid')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        // Ingresos del mes anterior para calcular la tendencia (%)
        $lastMonthRevenue = (float) (Order::where('orders.status', 'paid')
            ->whereBetween('orders.created_at', [$startOfLastMonth, $endOfLastMonth])
            ->join('order_items', 'orders.id', '=', 'order_items.fk_order_id')
            ->selectRaw('SUM(order_items.price_product * order_items.quantity) as total')
            ->value('total') ?? 0);

        // Cálculo de porcentaje de crecimiento vs mes anterior
        $trend = 0;
        if ($lastMonthRevenue > 0) {
            $trend = round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2);
        } else if ($currentMonthRevenue > 0) {
            $trend = 100;
        }

        return [
            'id' => 'revenue',
            'title' => 'Ventas Totales',
            'value' => $currentMonthRevenue,
            'paid_orders_count' => $currentMonthPaidOrdersCount,
            'trend' => $trend,
            'trendText' => 'vs mes anterior',
            'prefix' => '$',
        ];
    }

    /**
     * Endpoint GET /api/staff/orders/kpi-revenue
     */
    public function getMonthlyRevenueKpi()
    {
        return response()->json([
            'data' => $this->getMonthlyRevenueData()
        ], 200);
    }

    /**
     * Obtener las ventas diarias de los últimos 7 días (para el gráfico de barras verticales)
     */
    public function getWeeklySalesData()
    {
        $dayNames = [
            1 => 'Lun',
            2 => 'Mar',
            3 => 'Mié',
            4 => 'Jue',
            5 => 'Vie',
            6 => 'Sáb',
            7 => 'Dom',
        ];

        $weeklyData = [];
        $now = Carbon::now();

        // Iterar desde hace 6 días hasta hoy (7 días en total)
        for ($i = 6; $i >= 0; $i--) {
            $targetDate = $now->copy()->subDays($i);
            $dayOfWeekNumber = $targetDate->dayOfWeekIso; // 1 (Lun) a 7 (Dom)
            $dateString = $targetDate->format('Y-m-d');

            // Ventas del día (órdenes pagadas)
            $dailySales = (float) (Order::where('orders.status', 'paid')
                ->whereDate('orders.created_at', $dateString)
                ->join('order_items', 'orders.id', '=', 'order_items.fk_order_id')
                ->selectRaw('SUM(order_items.price_product * order_items.quantity) as total')
                ->value('total') ?? 0);

            // Cantidad de pedidos pagados del día
            $dailyOrdersCount = Order::where('status', 'paid')
                ->whereDate('created_at', $dateString)
                ->count();

            $weeklyData[] = [
                'day' => $dayNames[$dayOfWeekNumber] ?? $targetDate->format('D'),
                'date' => $dateString,
                'sales' => $dailySales,
                'orders' => $dailyOrdersCount,
            ];
        }

        return $weeklyData;
    }

    /**
     * Endpoint GET /api/staff/orders/chart-weekly-sales
     */
    public function getWeeklySalesChart()
    {
        return response()->json([
            'data' => $this->getWeeklySalesData()
        ], 200);
    }



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

        $query = Order::with('client:id,rut,name,lastname', 'items:id,fk_order_id,price_product,quantity')
            ->select([
                'id',
                'id as key',
                'fk_client_id',
                'number_order',
                'status',
                'created_at as created_at_show'
            ]);

        $this->applyInFilters($query, $filters, ['number_order', 'status']); // Aplicar filtros whereIn de forma dinámica

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
        $order = Order::select('id', 'url_vaucher as vaucher', 'method_payment')->where('id', $order_id)->first();

        return response()->json([
            'order' => $order
        ], 200);
    }

    public function confirmPayment($order_id)
    {
        $order = Order::find($order_id);

        if (!$order) {
            return response()->json(['error' => 'Orden no encontrada'], 404);
        }

        // 1. llamar al backend de archivos para borrar el voucher
        if ($order->url_vaucher) {
            $file_server_url = "https://c83230a5b724.ngrok-free.app/api/delete-file";

            Http::delete($file_server_url, [
                "path" => $order->url_vaucher
            ]);
        }

        // 2. actualizar estado de pago
        $order->status = 'paid';
        $order->url_vaucher = null;
        $order->save();

        return response()->json(['message' => 'Pago confirmado']);
    }
}
