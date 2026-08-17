<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Ramsey\Uuid\Uuid as RamseyUuid;

class Client extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'rut',
        'name',
        'lastname',
        'address',
        'phone',
        'email',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'string',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'id' => $this->id,
            'role' => 'client',
        ];
    }

    public $incrementing = false;

    protected $keyType = 'string';

    public static function boot()
    {
        parent::boot();
        static::creating(function ($obj) {
            if (empty($obj->id)) {
                $obj->id = RamseyUuid::uuid4()->toString();
            }
        });
    }
}
