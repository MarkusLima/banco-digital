<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function balance(int $account_id): Response
    {
        return Inertia::render('Account/Balance', [
            'account_id' => $account_id,
        ]);
    }

    public function dashboard(): Response
    {
        return Inertia::render('Dashboard');
    }
}
