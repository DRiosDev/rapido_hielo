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

    public function createClient(CreateClientRequest $request)
    {
        DB::beginTransaction();

        $password = Str::random(8);

        try {
            $user = User::create([
                'email' => $request->get('email'),
                'password' => Hash::make($password),
                'role' => 'client'
            ]);

            $client = Client::create([
                'user_id' => $user->id,
                'rut' => $request->get('rut'),
                'name' => $request->get('name'),
                'lastname' => $request->get('lastname'),
                'address' => $request->get('address'),
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
                'user_id as id',
                'user_id as key',
                'rut',
                'name',
                'lastname',
                'email',
                'phone',
                'role',
                'address',
                'clients.created_at as created_at_show'
            ]);

        $this->applyInFilters($query, $filters, ['rut', 'status']); // Aplicar filtros whereIn de forma dinámica
        $this->applyLikeFilters($query, $filters, ['name', 'lastname', 'email']); // Aplicar filtros LIKE de forma dinámica

        $paginated_data = $query->orderBy($field, $order)
            ->leftjoin('users', 'clients.user_id', '=', 'users.id')
            ->paginate($page_size, ['*'], 'page', $current);

        $response = [
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ];

        return response()->json($response, 200);
    }

    public function show($id)
    {

        $client = Client::select('rut', 'name', 'lastname', 'email', 'address')
            ->leftjoin('users', 'clients.user_id', '=', 'users.id')
            ->where('user_id', $id)
            ->where('status', 'active')
            ->firstOrFail();

        return response()->json($client, 200);
    }

    public function changeStatusClient($id)
    {
        $client = User::select('id', 'status')->where('id', $id)->first();

        if (!$client) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Determinar el nuevo estado
        $new_status = ($client->status === 'active') ? 'desactive' : 'active';

        $client->update(['status' => $new_status]);

        return response()->json(['message' => 'Estado de cliente actualizado correctamente'], 200);
    }
}
