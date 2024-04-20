<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'cpf' => 'required|string|min:11',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'cep' => 'required|string',
            'address' => 'required|string',
            'numero' => 'required|string'
        ];
    }
}
