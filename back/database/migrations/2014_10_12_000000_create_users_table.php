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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('rut')->unique();
            $table->string('name');
            $table->string('lastname');
            $table->string('phone')->unique();
            $table->enum('role', ['owner', 'admin', 'normal'])->default('normal');
            $table->string('status')->default('active');
            $table->string('password');
            $table->string('reset_password_token')->nullable();
            $table->timestamp('reset_password_token_expiration')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
