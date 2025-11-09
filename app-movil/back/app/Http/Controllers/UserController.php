<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserController extends Controller
{

    public function __construct(
        protected UserService $user_service,
    ) {}

    public function store(CreateUserRequest $request)
    {
        $password = Str::random(8);

        $user = $this->user_service->create($request, $password);

        return response()->json([
            'message' => "Usuario creado con éxito",
            'register' => $user,
        ], 201);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $register = User::select('id')->where('id', $id)->firstOrFail();

        $this->user_service->update($request, $register);

        return response()->json([
            'message' => "Usuario editado con éxito",
        ], 200);
    }

    public function index(Request $request)
    {
        $request->validate([
            'current' => 'nullable|integer|min:1',
            'field' => 'nullable|in:created_at_show', //Campos sorter
            'order' => 'nullable|in:asc,desc',
            'filters' => 'nullable|array',
        ]);

        $current_page = $request->get('current');
        $filters = $request->get('filters', []);
        $field = $request->get('field', 'created_at_show');
        $order = $request->get('order', 'asc');

        $response = $this->user_service->paginated($current_page, $filters, $field, $order);

        return response()->json($response, 200);
    }

    public function updateStatus($id)
    {
        $user = User::select('id', 'status')->where('id', $id)->firstOrFail();

        // Determinar el nuevo estado
        $new_status = ($user->status === 'active') ? 'desactive' : 'active';

        $user->update(['status' => $new_status]);

        return response()->json(['message' => 'Estado de usuario actualizado correctamente'], 200);
    }
}
