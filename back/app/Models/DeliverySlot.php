<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid as RamseyUuid;

class DeliverySlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'slot',
        'status',
    ];

    protected $casts = [
        'id' => 'string',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public static function boot()
    {
        parent::boot();
        static::creating(function ($obj) {
            if (!$obj->id) {
                $obj->id = RamseyUuid::uuid4()->toString();
            }
        });
    }
}
