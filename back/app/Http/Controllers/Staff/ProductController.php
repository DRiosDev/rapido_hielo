<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\CreateProductRequest;
use App\Models\Product;
use App\Traits\Filterable;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use Filterable;

    public function createProduct(CreateProductRequest $request)
    {
        $Product = Product::create([
            'name' =>  $request->get('name'),
            'description' =>  $request->get('description'),
            'weight' => $request->get('weight'),
            'price' => $request->get('price'),
            'quantity' => $request->get('quantity') ?? 1
        ]);

        $Product->key = $Product->id;
        $Product->status = "active";

        return response()->json([
            'message' => "Producto creado con éxito",
            'register' => $Product,
        ], 201);
    }

    public function updateClient(CreateProductRequest $request, string $id)
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
            'quantity' => 'required|integer|min:0',
        ]);

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $action = $request->get('action');
        $quantity = $request->get('quantity');

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

        $product->save();

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
}
