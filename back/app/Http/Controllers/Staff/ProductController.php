<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\CreateProductRequest;
use App\Models\Order\OrderItem;
use App\Models\Product;
use App\Traits\Filterable;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ProductController extends Controller
{
    use Filterable;

    /**
     * Obtener los datos brutos del KPI de Productos Vendidos en los últimos 30 días (solo órdenes pagadas)
     */
    public function getProductsSoldData()
    {
        $now = Carbon::now();
        $startCurrentPeriod = $now->copy()->subDays(30);
        $startPreviousPeriod = $now->copy()->subDays(60);

        // Cantidad acumulada de productos vendidos en los últimos 30 días
        $currentPeriodSold = (int) (OrderItem::join('orders', 'order_items.fk_order_id', '=', 'orders.id')
            ->where('orders.status', 'paid')
            ->where('orders.created_at', '>=', $startCurrentPeriod)
            ->sum('order_items.quantity') ?? 0);

        // Cantidad vendida en el periodo de 30 días previo (hace 31-60 días)
        $previousPeriodSold = (int) (OrderItem::join('orders', 'order_items.fk_order_id', '=', 'orders.id')
            ->where('orders.status', 'paid')
            ->whereBetween('orders.created_at', [$startPreviousPeriod, $startCurrentPeriod])
            ->sum('order_items.quantity') ?? 0);

        // Calcular porcentaje de tendencia
        $trend = 0;
        if ($previousPeriodSold > 0) {
            $trend = round((($currentPeriodSold - $previousPeriodSold) / $previousPeriodSold) * 100, 1);
        } else if ($currentPeriodSold > 0) {
            $trend = 100;
        }

        return [
            'id' => 'products_sold',
            'title' => 'Productos Vendidos',
            'value' => $currentPeriodSold,
            'suffix' => ' sacos',
            'trend' => $trend,
            'trendText' => 'vs 30 días anteriores',
        ];
    }

    /**
     * Endpoint GET /api/staff/products/kpi-sold
     */
    public function getProductsSoldKpi()
    {
        return response()->json([
            'data' => $this->getProductsSoldData()
        ], 200);
    }

    /**
     * Obtener los datos brutos del KPI de Valor Total del Stock Actual de Productos
     */
    public function getStockValueData()
    {
        // Obtener productos activos y calcular la suma de (quantity * price)
        $products = Product::where('status', 'active')->get(['quantity', 'price']);

        $totalStockValue = (float) $products->sum(function ($product) {
            return ((int) $product->quantity) * ((float) $product->price);
        });

        $totalStockUnits = (int) $products->sum('quantity');

        return [
            'id' => 'stock_value',
            'title' => 'Valor del Inventario',
            'value' => $totalStockValue,
            'prefix' => '$',
            'precision' => 0,
            'trendText' => $totalStockUnits . ' sacos en stock',
        ];
    }

    /**
     * Endpoint GET /api/staff/products/kpi-stock-value
     */
    public function getStockValueKpi()
    {
        return response()->json([
            'data' => $this->getStockValueData()
        ], 200);
    }

    /**
     * Obtener los productos más vendidos (para la tabla del dashboard)
     */
    public function getTopSellingProductsData($limit = 5)
    {
        $results = OrderItem::join('orders', 'order_items.fk_order_id', '=', 'orders.id')
            ->where('orders.status', 'paid')
            ->selectRaw('
                order_items.fk_product_id as id,
                order_items.name_product as name,
                SUM(order_items.quantity) as "salesCount",
                SUM(order_items.price_product * order_items.quantity) as "totalRevenue"
            ')
            ->groupBy('order_items.fk_product_id', 'order_items.name_product')
            ->orderByRaw('SUM(order_items.quantity) DESC')
            ->limit($limit)
            ->get();

        return $results->map(function ($item) {
            return [
                'id' => (string) $item->id,
                'name' => (string) $item->name,
                'salesCount' => (int) ($item->salesCount ?? $item->salescount ?? 0),
                'totalRevenue' => (float) ($item->totalRevenue ?? $item->totalrevenue ?? 0),
            ];
        });
    }

    /**
     * Endpoint GET /api/staff/products/table-top-selling
     */
    public function getTopSellingProductsTable()
    {
        return response()->json([
            'data' => $this->getTopSellingProductsData()
        ], 200);
    }

    /**
     * Obtener los productos con menor stock que su mínimo definido (para la tabla de alertas del dashboard)
     */
    public function getLowStockProductsData($limit = 5)
    {
        $products = Product::where('status', 'active')
            ->where('min_stock', '>', 0)
            ->whereColumn('quantity', '<=', 'min_stock')
            ->orderBy('quantity', 'asc')
            ->limit($limit)
            ->get(['id', 'name', 'quantity', 'min_stock']);

        return $products->map(function ($p) {
            $stock = (int) $p->quantity;
            $minStock = (int) $p->min_stock;
            return [
                'id' => (string) $p->id,
                'name' => (string) $p->name,
                'currentStock' => $stock,
                'minStock' => $minStock,
                'status' => ($stock <= ($minStock * 0.3) || $stock == 0) ? 'critical' : 'warning',
            ];
        });
    }

    /**
     * Endpoint GET /api/staff/products/table-low-stock
     */
    public function getLowStockProductsTable()
    {
        return response()->json([
            'data' => $this->getLowStockProductsData()
        ], 200);
    }




    public function create(CreateProductRequest $request)
    {
        $Product = Product::create([
            'name' =>  $request->get('name'),
            'description' =>  $request->get('description'),
            'weight' => $request->get('weight'),
            'price' => $request->get('price'),
            'quantity' => $request->get('quantity') ?? 1,
            'min_stock' => $request->get('min_stock') ?? 0,
        ]);

        $Product->key = $Product->id;
        $Product->status = "active";

        return response()->json([
            'message' => "Producto creado con éxito",
            'register' => $Product,
        ], 201);
    }

    public function update(CreateProductRequest $request, string $id)
    {
        $item_exist = Product::where('id', $id)->exists();

        if (!$item_exist) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        Product::where('id', $id)->update([
            'name' =>  $request->get('name'),
            'description' =>  $request->get('description'),
            'weight' => $request->get('weight'),
            'price' => $request->get('price'),
            'min_stock' => $request->get('min_stock') ?? 0,
        ]);

        return response()->json([
            'message' => "Producto editado con éxito",
        ], 200);
    }

    public function getProducts(Request $request)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'field' => 'nullable|in:created_at_show', //Campos sorter
            'order' => 'nullable|in:asc,desc',
        ]);

        $allowed_filters = ['name', 'status'];

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

        $query = Product::query()
            ->select([
                'id',
                'id as key',
                'name',
                'description',
                'weight',
                'price',
                'quantity',
                'min_stock',
                'status',
                'created_at as created_at_show'
            ]);

        $this->applyInFilters($query, $filters, ['status']); // Aplicar filtros whereIn de forma dinámica
        $this->applyLikeFilters($query, $filters, ['name']); // Aplicar filtros LIKE de forma dinámica

        $paginated_data = $query->orderBy($field, $order)
            ->paginate($page_size, ['*'], 'page', $current);

        $response = [
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ];

        return response()->json($response, 200);
    }

    public function updateQuantity(Request $request, string $id)
    {
        $request->validate([
            'action' => 'required|in:add,subtract',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:255',
        ]);

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $action = $request->get('action');
        $quantity = (int) $request->get('quantity');
        $reason = $request->get('reason');

        $previousStock = (int) $product->quantity;

        if ($action === 'add') {
            $product->quantity += $quantity;
        } else {
            if ($product->quantity - $quantity < 0) {
                return response()->json([
                    'message' => 'No se puede dejar el stock por debajo de 0.'
                ], 422);
            }

            $product->quantity -= $quantity;
        }

        $newStock = (int) $product->quantity;
        $product->save();

        // Obtener el ID del usuario/staff autenticado
        $userId = auth()->user()?->id ?? auth('staff')->user()?->id ?? null;

        // Registrar movimiento de inventario
        \App\Models\InventoryMovement::create([
            'fk_product_id' => $product->id,
            'fk_user_id' => $userId,
            'action' => $action,
            'quantity' => $quantity,
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => $reason,
        ]);

        return response()->json([
            'message' => 'Cantidad de producto actualizada con éxito',
            'register' => $product,
        ], 200);
    }            

    public function changeStatusProduct(string $id)
    {
        $client = Product::select('id', 'status')->where('id', $id)->first();

        if (!$client) {
            return response()->json(['message' => 'Producto no encontrado.'], 404);
        }

        // Determinar el nuevo estado
        $new_status = ($client->status === 'active') ? 'desactive' : 'active';

        $client->update(['status' => $new_status]);

        return response()->json(['message' => 'Estado de producto actualizado correctamente'], 200);
    }

    /**
     * Realizar la conversión directa de stock (Empaque: Bolsas -> Sacos)
     */
    public function convertStock(Request $request)
    {
        $request->validate([
            'origin_product_id' => 'required|string|exists:products,id',
            'destination_product_id' => 'required|string|exists:products,id|different:origin_product_id',
            'conversion_factor' => 'required|integer|min:1',
            'quantity_to_create' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:255',
        ]);

        $originProduct = Product::find($request->get('origin_product_id'));
        $destinationProduct = Product::find($request->get('destination_product_id'));

        $conversionFactor = (int) $request->get('conversion_factor');
        $quantityToCreate = (int) $request->get('quantity_to_create');
        $totalOriginNeeded = $conversionFactor * $quantityToCreate;

        if ($originProduct->quantity < $totalOriginNeeded) {
            return response()->json([
                'message' => "Stock insuficiente de {$originProduct->name}. Se requieren {$totalOriginNeeded} unidades pero solo hay {$originProduct->quantity} disponibles."
            ], 422);
        }

        \Illuminate\Support\Facades\DB::beginTransaction();

        try {
            $originPrevStock = (int) $originProduct->quantity;
            $destPrevStock = (int) $destinationProduct->quantity;

            // Disminuir en el origen (Bolsas)
            $originProduct->quantity -= $totalOriginNeeded;
            $originProduct->save();

            // Aumentar en el destino (Sacos)
            $destinationProduct->quantity += $quantityToCreate;
            $destinationProduct->save();

            $userId = auth()->user()?->id ?? auth('staff')->user()?->id ?? null;
            $userReason = $request->get('reason');

            // Movimiento 1: Descuento en producto Origen
            \App\Models\InventoryMovement::create([
                'fk_product_id' => $originProduct->id,
                'fk_user_id' => $userId,
                'action' => 'subtract',
                'quantity' => $totalOriginNeeded,
                'previous_stock' => $originPrevStock,
                'new_stock' => $originProduct->quantity,
                'reason' => "Empaque / Conversión a {$destinationProduct->name}" . ($userReason ? " - {$userReason}" : ""),
            ]);

            // Movimiento 2: Aumento en producto Destino
            \App\Models\InventoryMovement::create([
                'fk_product_id' => $destinationProduct->id,
                'fk_user_id' => $userId,
                'action' => 'add',
                'quantity' => $quantityToCreate,
                'previous_stock' => $destPrevStock,
                'new_stock' => $destinationProduct->quantity,
                'reason' => "Empaque / Conversión desde {$originProduct->name}" . ($userReason ? " - {$userReason}" : ""),
            ]);

            \Illuminate\Support\Facades\DB::commit();

            return response()->json([
                'message' => "Conversión realizada con éxito: Se descontaron {$totalOriginNeeded} unidades de {$originProduct->name} y se crearon {$quantityToCreate} unidades de {$destinationProduct->name}.",
                'origin_product' => $originProduct,
                'destination_product' => $destinationProduct,
            ], 200);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json([
                'message' => 'Error al realizar la conversión de stock.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
