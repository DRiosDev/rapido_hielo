<?php

namespace App\Models\Order;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid as RamseyUuid;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_client_id',
        'number_order',
        'total',
        'total_quantity',
        'vaucher',
        'status',

        'date_dispatch',
        'time_disdispatch',
        'address_dispatch',
        'method_payment',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'string',
    ];

    public $incrementing = false;

    public static function boot()
    {
        parent::boot();
        static::creating(function ($obj) {
            $obj->id = RamseyUuid::uuid4()->toString();
        });
    }
}
