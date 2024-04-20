<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AccountRequest;
use App\Http\Requests\AccountTransferRequest;
use App\Models\Account;
use App\Models\DepositMoviment;
use App\Models\OutputMoviment;
use App\Models\TransferMoviment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{

    public function store(Request $request)
    {
        try {
            
            Account::create(['user_id'=>$request->user()->id]);

            return response()->json(['data' => null, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function destroy(Request $request, int $account_id)
    {
        try {
            
            $account = Account::where('id', $account_id)->where('user_id', $request->user()->id)->first();

            if (!$account) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "account not found"], 400);
            }

            $account->delete();

            return response()->json(['data' => null, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function balance(Request $request,  int $account_id)
    {
        try {

            $response = [];
            
            $account = Account::where('id', $account_id)->where('user_id', $request->user()->id)->first();

            if (!$account) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "account not found"], 400);
            }

            $response['outs'] = OutputMoviment::where('account_id', $account->id)->get();
            $response['dep'] = DepositMoviment::where('account_id', $account->id)->get();
            $response['transf_out'] = TransferMoviment::where('account_id', $account->id)->get();
            $response['transf_in'] = TransferMoviment::where('account_id_transfer', $account->id)->get();


            return response()->json(['data' => $response, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function transfer(AccountTransferRequest $request)
    {
        try {
            
            $account = Account::where('id', $request->account_id)->where('user_id', $request->user()->id)->first();

            if (!$account) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "account not found"], 400);
            }

            if ( floatval($account->balance) < floatval($request->value)) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "transfer value is greater than the available value"], 400);
            }

            $account_transfer = Account::where('id', $request->account_id_transfer)->first();

            if (!$account_transfer) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "account from transfer not found"], 400);
            }

            TransferMoviment::create([
                'account_id' => $request->account_id,
                'account_id_transfer' => $request->account_id_transfer,
                'cod' => 'TRANSF'.generatenumberRandom(),
                'value' => $request->value
            ]);

            $account_transfer->increment('balance', $request->value);

            $account->decrement('balance', $request->value);

            return response()->json(['data' => null, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function deposit(AccountRequest $request)
    {
        try {
            
            $account = Account::where('id', $request->account_id)->first();

            if (!$account) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "account not found"], 400);
            }

            DepositMoviment::create([
                'account_id' => $request->account_id,
                'cod' => 'DEP'.generatenumberRandom(),
                'value' => $request->value
            ]);

            $account->increment('balance', $request->value);

            return response()->json(['data' => null, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function cashout(AccountRequest $request)
    {
        try {
            
            $account = Account::where('id', $request->account_id)->where('user_id', $request->user()->id)->first();

            if (!$account) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "account not found"], 400);
            }

            if ( floatval($account->balance) < floatval($request->value)) {
                return response()->json(['data' => null, 'success' => false, 'error'=> "required amount is greater than the available amount"], 400);
            }

            OutputMoviment::create([
                'account_id' => $request->account_id,
                'cod' => 'OUT'.generatenumberRandom(),
                'value' => $request->value
            ]);

            $account->decrement('balance', $request->value);

            return response()->json(['data' => null, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

    public function index(Request $request, bool $find = false)
    {
        try {
            
            $accounts = Account::select('accounts.id', DB::Raw("CONCAT(accounts.id, '-', users.name) AS options"))
            ->join('users', 'accounts.user_id', '=', 'users.id');

            if ($find) {
                $accounts = $accounts->where('accounts.user_id', $request->user()->id)->get();
            } else {
                $accounts = $accounts->get();
            }

            return response()->json(['data' => $accounts, 'success' => true, 'error'=> null]);

        } catch (\Throwable $th) {
            
            return response()->json(['data' => null, 'success' => false, 'error'=> $th->getMessage()], 400);

        }
    }

}
