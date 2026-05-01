<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

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
            'rut' => 'required|string|max:12|unique:clients,rut',
            'name' => 'required|string|min:2|max:25',
            'lastname' => 'required|string|min:2|max:25',
            'address' => 'required|string|min:2|max:100',
            'phone' => 'required|string|min:9|max:9',
            'email' => 'required|email|max:' . config('limits.email_max_length') . '|unique:clients,email',
            'password' => 'required|string|confirmed|min:8|max:20',
        ];
    }

    /**
     * Override the failed validation response to match custom format.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'errors' => $validator->errors()->toArray()
        ], 400));
    }
}
