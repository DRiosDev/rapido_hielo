<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->uuid('id');
            $table->uuid('fk_product_id');
            $table->uuid('fk_cart_id');
            $table->string('name_product');
            $table->integer('price_product');
            $table->unsignedInteger('quantity_item')->default(1);

            $table->foreign('fk_product_id')->references('id')->on('products');
            $table->foreign('fk_cart_id')->references('id')->on('carts');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
