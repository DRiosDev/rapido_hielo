<?php

namespace App\Models\Order;

use App\Models\Client;
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
        'status',

        /* datos para despacho */
        'status_dispatch',
        'date_dispatch',
        'time_dispatch',
        'address_dispatch',
        'method_payment',
        'url_vaucher',
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
    protected $keyType = 'string';

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'fk_order_id', 'id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'fk_client_id');
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($obj) {
            $obj->id = RamseyUuid::uuid4()->toString();
        });
    }
}
