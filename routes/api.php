<?php

use App\Http\Controllers\api\AccountController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['prefix' => 'auth'], function () {

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

});


Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::group(['prefix' => 'user'], function () {

        Route::get('/me', [UserController::class, 'me']);

	});

    Route::group(['prefix' => 'account'], function () {

        Route::get('/all/{find?}', [AccountController::class, 'index']);

        Route::post('/store', [AccountController::class, 'store']);
        Route::delete('/destroy/{account_id}', [AccountController::class, 'destroy']);

        Route::get('/balance/{account_id}', [AccountController::class, 'balance']);
        Route::post('/transfer', [AccountController::class, 'transfer']);
        Route::post('/deposit', [AccountController::class, 'deposit']);
        Route::post('/cashout', [AccountController::class, 'cashout']);

	});

    Route::group(['prefix' => 'auth'], function () {

        Route::get('/verification', [AuthController::class, 'verification']);
        Route::post('/logout', [AuthController::class, 'logout']);

	});
    
});
