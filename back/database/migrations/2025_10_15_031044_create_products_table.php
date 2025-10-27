<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            // ID como UUID
            $table->uuid('id')->primary();

            // Identificadores
            $table->string('barcode');
            $table->string('sku')->nullable();

            // Desciptores
            $table->string('name');
            $table->text('description');
            $table->integer('weight');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();

            // Descriptores ventas
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(0);
            $table->boolean('weighlable')->default(false);

            // Estado de producto
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
