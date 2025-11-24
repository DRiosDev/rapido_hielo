<?php

namespace App\Models\Cart;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid as RamseyUuid;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_client_id',
        'status'
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
        return $this->hasMany(CartItem::class, 'fk_cart_id', 'id');
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'fk_client_id', 'id');
    }


    public static function boot()
    {
        parent::boot();
        static::creating(function ($obj) {
            $obj->id = RamseyUuid::uuid4()->toString();
        });
    }
}
