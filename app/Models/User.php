<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name','email', 'password','cpf', 'date_of_birth',
        'cep', 'address', 'complemento', 'numero'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'created_at' => 'datetime:Y-m-d H:m:s',
        'updated_at' => 'datetime:Y-m-d H:m:s',
    ];

    public function account(){
        return $this->hasMany('App\Models\Account', 'user_id', 'id');
    }

    public static function auth($email, $password)
    {
        try {
            $user = self::where('email', $email)->get()->first();

            if(empty($user)) {
                return false;
            }

            if(!Hash::check($password, $user->password)) {
                return false;
            }

            return true;
        } catch(\Exception $e) {
            return false;
        }
    }
}
