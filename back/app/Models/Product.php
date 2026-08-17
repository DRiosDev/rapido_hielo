<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid as RamseyUuid;


class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'iamge',
        'weight',
        'unit',
        'price',
        'quantity',
        'min_stock',
        'is_limited',
        'is_sack',
        'status'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'string',
        'is_limited' => 'boolean',
        'is_sack' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public static function boot()
    {
        parent::boot();
        static::creating(function ($obj) {
            $obj->id = RamseyUuid::uuid4()->toString();
        });
    }
}
