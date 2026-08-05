<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductStockTest extends TestCase
{
    use DatabaseTransactions;

    private function getAuthHeader(): array
    {
        $user = new User();
        $user->rut = '12345678-9';
        $user->name = 'Admin';
        $user->lastname = 'User';
        $user->email = 'admin@test.com';
        $user->phone = '912345678';
        $user->password = bcrypt('password123');
        $user->role = 'admin';
        $user->status = 'active';
        $user->save();

        $token = JWTAuth::fromUser($user);

        return [
            'Authorization' => "Bearer {$token}",
        ];
    }

    public function test_can_increase_product_stock(): void
    {
        $headers = $this->getAuthHeader();

        $product = Product::create([
            'name' => 'Hielo Bolsa 5kg',
            'description' => 'Bolsa de hielo',
            'weight' => 5,
            'price' => 2500,
            'quantity' => 10,
            'status' => 'active'
        ]);

        $response = $this->patchJson("/api/products/quantity/{$product->id}", [
            'action' => 'add',
            'quantity' => 5,
        ], $headers);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Cantidad de producto actualizada con éxito',
                 ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 15,
        ]);
    }

    public function test_can_decrease_product_stock(): void
    {
        $headers = $this->getAuthHeader();

        $product = Product::create([
            'name' => 'Hielo Bolsa 5kg',
            'description' => 'Bolsa de hielo',
            'weight' => 5,
            'price' => 2500,
            'quantity' => 10,
            'status' => 'active'
        ]);

        $response = $this->patchJson("/api/products/quantity/{$product->id}", [
            'action' => 'subtract',
            'quantity' => 3,
        ], $headers);

        $response->assertStatus(200);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 7,
        ]);
    }

    public function test_cannot_reduce_stock_below_zero(): void
    {
        $headers = $this->getAuthHeader();

        $product = Product::create([
            'name' => 'Hielo Bolsa 5kg',
            'description' => 'Bolsa de hielo',
            'weight' => 5,
            'price' => 2500,
            'quantity' => 5,
            'status' => 'active'
        ]);

        $response = $this->patchJson("/api/products/quantity/{$product->id}", [
            'action' => 'subtract',
            'quantity' => 10,
        ], $headers);

        $response->assertStatus(422)
                 ->assertJson([
                     'message' => 'No se puede dejar el stock por debajo de 0.',
                 ]);
    }
}
