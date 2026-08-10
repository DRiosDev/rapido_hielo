<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\InventoryMovement;
use App\Traits\Filterable;
use Illuminate\Http\Request;

class InventoryMovementController extends Controller
{
    use Filterable;

    public function index(Request $request)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'pageSize' => 'nullable|integer|min:1|max:100',
            'field' => 'nullable|in:created_at_show,quantity,action',
            'order' => 'nullable|in:asc,desc',
            'product_id' => 'nullable|string',
            'action' => 'nullable|in:add,subtract,adjustment',
        ]);

        $current = $request->get('current', 1);
        $page_size = $request->get('pageSize', 10);
        $field = $request->get('field', 'created_at_show');
        $order = $request->get('order', 'desc');

        $query = InventoryMovement::with([
            'product:id,name,weight,price',
            'user:id,name,rut,email'
        ])->select([
            'id',
            'id as key',
            'fk_product_id',
            'fk_user_id',
            'action',
            'quantity',
            'previous_stock',
            'new_stock',
            'reason',
            'created_at as created_at_show'
        ]);

        if ($request->filled('product_id')) {
            $productId = (string) $request->get('product_id');
            if (\Ramsey\Uuid\Uuid::isValid($productId)) {
                $query->where('fk_product_id', $productId);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        if ($request->filled('action')) {
            $query->where('action', $request->get('action'));
        }

        $sortField = ($field === 'created_at_show') ? 'created_at' : $field;

        $paginated_data = $query->orderBy($sortField, $order)
            ->paginate($page_size, ['*'], 'page', $current);

        return response()->json([
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ], 200);
    }

    public function getByProduct(Request $request, string $product_id)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'pageSize' => 'nullable|integer|min:1|max:100',
        ]);

        if (!\Ramsey\Uuid\Uuid::isValid($product_id)) {
            return response()->json([
                'data' => [],
                'total' => 0,
            ], 200);
        }

        $current = $request->get('current', 1);
        $page_size = $request->get('pageSize', 10);

        $paginated_data = InventoryMovement::with([
            'user:id,name,rut,email'
        ])->select([
            'id',
            'id as key',
            'fk_product_id',
            'fk_user_id',
            'action',
            'quantity',
            'previous_stock',
            'new_stock',
            'reason',
            'created_at as created_at_show'
        ])->where('fk_product_id', $product_id)
          ->orderBy('created_at', 'desc')
          ->paginate($page_size, ['*'], 'page', $current);

        return response()->json([
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ], 200);
    }
}
