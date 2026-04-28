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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fk_client_id');
            $table->integer('number_order');
            $table->string('status');

            $table->string('status_dispatch')->default('pending');
            $table->date('date_dispatch')->nullable();
            $table->string('time_dispatch')->nullable();
            $table->string('address_dispatch')->nullable();
            $table->string('method_payment');
            $table->longText('url_vaucher');

            $table->timestamps();
            $table->foreign('fk_client_id')->references('id')->on('clients');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
