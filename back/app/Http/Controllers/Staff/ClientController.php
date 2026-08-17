<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\CreateClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Traits\Filterable;
use Illuminate\Support\Facades\DB;
use Throwable;

class ClientController extends Controller
{
    use Filterable;

    /**
     * Obtener los clientes con mayor volumen de compra (para la tabla del dashboard)
     */
    public function getTopClientsData($limit = 5)
    {
        $results = DB::table('clients')
            ->join('orders', 'clients.id', '=', 'orders.fk_client_id')
            ->join('order_items', 'orders.id', '=', 'order_items.fk_order_id')
            ->where('orders.status', 'paid')
            ->selectRaw("
                clients.id as id,
                CONCAT(clients.name, ' ', COALESCE(clients.lastname, '')) as name,
                COUNT(DISTINCT orders.id) as \"totalOrders\",
                SUM(order_items.price_product * order_items.quantity) as \"totalSpent\"
            ")
            ->groupBy('clients.id', 'clients.name', 'clients.lastname')
            ->orderByRaw('SUM(order_items.price_product * order_items.quantity) DESC')
            ->limit($limit)
            ->get();

        return $results->map(function ($c) {
            return [
                'id' => (string) $c->id,
                'name' => trim((string) $c->name),
                'totalOrders' => (int) ($c->totalOrders ?? $c->totalorders ?? 0),
                'totalSpent' => (float) ($c->totalSpent ?? $c->totalspent ?? 0),
            ];
        });
    }

    /**
     * Endpoint GET /api/staff/clients/table-top
     */
    public function getTopClientsTable()
    {
        return response()->json([
            'data' => $this->getTopClientsData()
        ], 200);
    }


    public function createClient(CreateClientRequest $request)
    {
        DB::beginTransaction();

        $password = Str::random(8);

        try {
            $client = Client::create([
                'rut' => $request->get('rut'),
                'name' => $request->get('name'),
                'lastname' => $request->get('lastname'),
                'address' => $request->get('address'),
                'phone' => $request->get('phone'),
                'email' => $request->get('email'), // <-- FALTABA
                'password' => Hash::make($password),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Cliente creado con éxito',
                'register' => $client,
            ], 201);
        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al crear el cliente',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateClient(UpdateClientRequest $request, string $id)
    {
        $item_exist = Client::where('id', $id)->exists();

        if (!$item_exist) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        $updateData = [
            'rut' => $request->input('rut'),
            'name' => $request->input('name'),
            'lastname' => $request->input('lastname'),
            'address' => $request->input('address'),
        ];

        if ($request->filled('email')) {
            $updateData['email'] = $request->input('email');
        }

        if ($request->filled('phone')) {
            $updateData['phone'] = $request->input('phone');
        }

        Client::where('id', $id)->update($updateData);

        return response()->json([
            'message' => "Cliente editado con éxito",
        ], 200);
    }

    public function index(Request $request)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'field' => 'nullable|in:created_at_show', //Campos sorter
            'order' => 'nullable|in:asc,desc',
        ]);

        $allowed_filters = ['rut', 'name', 'lastname', 'role', 'status', 'email'];

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

        $query = Client::query()
            ->select([
                'id',
                'id as key',
                'rut',
                'name',
                'lastname',
                'status',
                'email',
                'phone',
                'address',
                'created_at as created_at_show'
            ]);

        $this->applyInFilters($query, $filters, ['rut', 'status']); // Aplicar filtros whereIn de forma dinámica
        $this->applyLikeFilters($query, $filters, ['name', 'lastname', 'email']); // Aplicar filtros LIKE de forma dinámica

        $paginated_data = $query->orderBy($field, $order)
            ->paginate($page_size, ['*'], 'page', $current);

        $response = [
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ];

        return response()->json($response, 200);
    }

    public function show(string $id)
    {

        $client = Client::select('id', 'rut', 'name', 'lastname', 'email', 'address', 'phone', 'status')
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($client, 200);
    }

    public function changeStatusClient(string $id)
    {
        $client = Client::select('id', 'status')->where('id', $id)->first();

        if (!$client) {
            return response()->json(['message' => 'Cliente no encontrado.'], 404);
        }

        // Determinar el nuevo estado
        $new_status = ($client->status === 'active') ? 'desactive' : 'active';

        $client->update(['status' => $new_status]);

        return response()->json(['message' => 'Estado de cliente actualizado correctamente'], 200);
    }
}
