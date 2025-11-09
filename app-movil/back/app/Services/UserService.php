<?php

namespace App\Services;

use App\Models\User;
use App\Traits\Filterable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{
    use Filterable;
    public function create(Request $request, string $password): User
    {
        $user = User::create([
            'name' =>  $request->get('name'),
            'lastname' =>  $request->get('lastname'),
            'email' => $request->get('email'),
            'password' => Hash::make($password),
            'role' => $request->get('role'),
        ]);

        $user->key = $user->id;
        $user->status = "active";

        return $user;
    }

    public function update(Request $request, User $user_to_edit): void
    {
        $user_to_edit->update([
            'name' => $request->input('name'),
            'lastname' => $request->input('lastname'),
            'email' => $request->input('email'),
            'role' => $request->input('role'),
        ]);
    }

    public function paginated(
        $current_page = 1,
        $filters = [],
        $field = "created_at_show",
        $order = "asc",
    ) {
        $per_page = 10;

        $query = User::query()
            ->select([
                'id',
                'id as key',
                'name',
                'email',
                'lastname',
                'role',
                'status',
                'created_at as created_at_show'
            ]);

        $this->applyInFilters($query, $filters, ['role', 'status']); // Aplicar filtros whereIn de forma dinámica
        $this->applyLikeFilters($query, $filters, ['name', 'lastname', 'email']); // Aplicar filtros LIKE de forma dinámica

        $paginated_data = $query->orderBy($field, $order)
            ->paginate($per_page, ['*'], 'page', $current_page);

        return [
            'data' => $paginated_data->items(),
            'total' => $paginated_data->total(),
        ];
    }
}
