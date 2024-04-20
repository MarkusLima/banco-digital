<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function me(Request $request)
    {
        
        try {

            $user = User::with('account')
            ->where('id', $request->user()->id)
            ->get();

            return response()->json(['data' => $user, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }

    }

}
