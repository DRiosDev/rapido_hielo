<?php

namespace App\Models\Order;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid as RamseyUuid;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        /* datos orden */
        'fk_client_id',
        'number_order',
        'total',
        'total_quantity',
        'vaucher',
        'status',

        /* datos para despacho */
        'date_dispatch',
        'time_dispatch',
        'address_dispatch',
        'method_payment',
        'status_dispatch'
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

    public function items()
    {
        return $this->hasMany(\App\Models\Order\OrderItem::class, 'fk_order_id', 'id');
    }

    public function client()
    {
        return $this->belongsTo(\App\Models\Client::class, 'fk_client_id');
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($obj) {
            $obj->id = RamseyUuid::uuid4()->toString();
        });
    }
}
