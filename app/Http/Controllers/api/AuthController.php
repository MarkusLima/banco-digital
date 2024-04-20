<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Account;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {

            $request->merge(['password' => Hash::make($request->password)]);
            $request->merge(['complemento' => !empty($request->complemento) ? $request->complemento : ""]);
    
            $user = User::create($request->all());

            Account::create(['user_id'=>$user->id]);
    
            return response()->json(['data' => $user, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {

            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function login(LoginRequest $request)
    {

        try {

            if (!User::auth($request->email, $request->password)) {

                return response()->json(['data' => null, 'success' => false, 'error'=> "user not found."], 401);

            }
    
            $user = User::where('email', $request['email'])->firstOrFail();
    
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['data' => $user, 'access_token' => $token, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function logout(Request $request)
    {

        try {

            $user = $request->user();
    
            $user->tokens()->delete();

            return response()->json(['data' => null, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function verification(Request $request)
    {
        try {

            return response()->json(['data' => null, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

}
