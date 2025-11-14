<?php

namespace App\Http\Controllers;

use App\Http\Requests\Client\CreateClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Traits\Filterable;

class ClientController extends Controller
{
    use Filterable;

    public function createClient(CreateClientRequest $request)
    {
        $password = Str::random(8);

        $client = Client::create([
            'rut' => $request->get('rut'),
            'name' =>  $request->get('name'),
            'lastname' =>  $request->get('lastname'),
            'email' => $request->get('email'),
            'password' => Hash::make($password),
            'address' => $request->get('address'),
        ]);

        $client->key = $client->id;
        $client->status = "active";

        return response()->json([
            'message' => "Cliente creado con éxito",
            'register' => $client,
        ], 201);
    }

    public function updateClient(UpdateClientRequest $request, $id)
    {
        $item_exist = Client::where('id', $id)->exists();

        if (!$item_exist) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        Client::where('id', $id)->update([
            'rut' => $request->input('rut'),
            'name' => $request->input('name'),
            'lastname' => $request->input('lastname'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
        ]);

        return response()->json([
            'message' => "Cliente editado con éxito",
        ], 200);
    }

    public function getClients(Request $request)
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
                'email',
                'lastname',
                'address',
                'status',
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

    public function show(Request $request, $id)
    {

        $client = Client::select('rut', 'name', 'lastname', 'email', 'address')
            ->where('id', $id)
            ->where('status', 'active')
            ->firstOrFail();

        return response()->json($client, 200);
    }

    public function changeStatusClient($id)
    {
        $client = Client::select('id', 'status')->where('id', $id)->first();

        if (!$client) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Determinar el nuevo estado
        $new_status = ($client->status === 'active') ? 'desactive' : 'active';

        $client->update(['status' => $new_status]);

        return response()->json(['message' => 'Estado de cliente actualizado correctamente'], 200);
    }
}
