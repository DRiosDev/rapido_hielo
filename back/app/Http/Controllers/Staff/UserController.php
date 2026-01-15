<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Traits\Filterable;

class UserController extends Controller
{
    use Filterable;

    public function createUser(CreateUserRequest $request)
    {
        $password = Str::random(8);

        $user = User::create([
            'name' =>  $request->get('name'),
            'lastname' =>  $request->get('lastname'),
            'email' => $request->get('email'),
            'password' => Hash::make($password),
            'role' => $request->get('role'),
        ]);

        $user->key = $user->id;
        $user->status = "active";

        return response()->json([
            'message' => "Usuario creado con éxito",
            'register' => $user,
        ], 201);
    }

    public function updateUser(UpdateUserRequest $request, $id)
    {
        $item_exist = User::where('id', $id)->exists();

        if (!$item_exist) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        User::where('id', $id)->update([
            'name' => $request->input('name'),
            'lastname' => $request->input('lastname'),
            'email' => $request->input('email'),
            'role' => $request->input('role'),
        ]);

        return response()->json([
            'message' => "Usuario editado con éxito",
        ], 200);
    }

    public function getUsers(Request $request)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'field' => 'nullable|in:created_at_show', //Campos sorter
            'order' => 'nullable|in:asc,desc',
        ]);

        $allowed_filters = ['name', 'lastname', 'role', 'status', 'email'];

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

        $query = Staff::query()
            ->select([
                'user_id as id',
                'user_id as key',
                'name',
                'email',
                'lastname',
                'role',
                'status',
                'staff.created_at as created_at_show'
            ]);

        $this->applyInFilters($query, $filters, ['role', 'status']); // Aplicar filtros whereIn de forma dinámica
        $this->applyLikeFilters($query, $filters, ['name', 'lastname', 'email']); // Aplicar filtros LIKE de forma dinámica

        $paginated_data = $query->orderBy($field, $order)
            ->leftjoin('users', 'users.id', '=', 'staff.user_id')
            ->paginate($page_size, ['*'], 'page', $current);

        $response = [
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ];

        return response()->json($response, 200);
    }

    public function changeStatusUser($id)
    {
        $user = User::select('id', 'status')->where('id', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Determinar el nuevo estado
        $new_status = ($user->status === 'active') ? 'desactive' : 'active';

        $user->update(['status' => $new_status]);

        return response()->json(['message' => 'Estado de usuario actualizado correctamente'], 200);
    }
}
