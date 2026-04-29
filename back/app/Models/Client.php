<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'rut',
        'name',
        'lastname',
        'address',
        'phone',
        'email'
    ];

    protected $casts = [
        'user_id' => 'string',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // Relación 1:1 con User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public $incrementing = false;
}
