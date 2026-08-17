<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\DeliverySlot;
use Illuminate\Http\Request;

class DeliverySlotController extends Controller
{
    /**
     * Listar todos los rangos horarios para la administración web
     */
    public function index()
    {
        $slots = DeliverySlot::orderBy('created_at', 'asc')->get();

        // Si la tabla está vacía, insertar opciones iniciales por defecto
        if ($slots->isEmpty()) {
            $defaultSlots = [
                '09:00 - 12:00',
                '12:00 - 15:00',
                '15:00 - 18:00',
                '18:00 - 21:00'
            ];

            foreach ($defaultSlots as $slotName) {
                DeliverySlot::create([
                    'slot' => $slotName,
                    'status' => 'active',
                ]);
            }

            $slots = DeliverySlot::orderBy('created_at', 'asc')->get();
        }

        return response()->json($slots, 200);
    }

    /**
     * Obtener rangos horarios activos para la App Móvil / Cliente
     */
    public function getActiveSlots()
    {
        $slots = DeliverySlot::where('status', 'active')
            ->orderBy('created_at', 'asc')
            ->get(['id', 'slot']);

        if ($slots->isEmpty()) {
            $defaultSlots = [
                '09:00 - 12:00',
                '12:00 - 15:00',
                '15:00 - 18:00',
                '18:00 - 21:00'
            ];

            foreach ($defaultSlots as $slotName) {
                DeliverySlot::create([
                    'slot' => $slotName,
                    'status' => 'active',
                ]);
            }

            $slots = DeliverySlot::where('status', 'active')
                ->orderBy('created_at', 'asc')
                ->get(['id', 'slot']);
        }

        return response()->json($slots, 200);
    }

    private function checkAdminRole(Request $request)
    {
        $role = $request->get('role_user_request');
        if (!in_array($role, ['admin', 'owner'])) {
            return response()->json(['message' => 'No tienes permisos para modificar rangos horarios'], 403);
        }
        return null;
    }

    /**
     * Crear un nuevo rango horario
     */
    public function store(Request $request)
    {
        if ($forbidden = $this->checkAdminRole($request)) {
            return $forbidden;
        }

        $request->validate([
            'slot' => 'required|string|max:100',
        ]);

        $slot = DeliverySlot::create([
            'slot' => $request->input('slot'),
            'status' => $request->input('status', 'active'),
        ]);

        return response()->json([
            'message' => 'Rango horario creado con éxito',
            'slot' => $slot,
        ], 201);
    }

    /**
     * Actualizar o cambiar estado de un rango horario
     */
    public function update(Request $request, string $id)
    {
        if ($forbidden = $this->checkAdminRole($request)) {
            return $forbidden;
        }

        $slot = DeliverySlot::find($id);

        if (!$slot) {
            return response()->json(['message' => 'Rango horario no encontrado'], 404);
        }

        if ($request->has('slot')) {
            $slot->slot = $request->input('slot');
        }

        if ($request->has('status')) {
            $slot->status = $request->input('status');
        }

        $slot->save();

        return response()->json([
            'message' => 'Rango horario actualizado con éxito',
            'slot' => $slot,
        ], 200);
    }

    /**
     * Eliminar un rango horario
     */
    public function destroy(Request $request, string $id)
    {
        if ($forbidden = $this->checkAdminRole($request)) {
            return $forbidden;
        }

        $slot = DeliverySlot::find($id);

        if (!$slot) {
            return response()->json(['message' => 'Rango horario no encontrado'], 404);
        }

        $slot->delete();

        return response()->json([
            'message' => 'Rango horario eliminado con éxito',
        ], 200);
    }
}
