<?php

namespace App\Http\Requests\Client;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
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
        $clientId = $this->route('id_client') ?? $this->route('client_id') ?? $this->route('client') ?? $this->id;

        return [
            'rut' => [
                'required',
                'string',
                'min:9',
                'max:13',
                Rule::unique('clients', 'rut')->ignore($clientId),
            ],
            'name' => 'required|string|min:2|max:25',
            'lastname' => 'required|string|min:2|max:25',
            'email' => [
                'required',
                'string',
                'max:' . config('limits.email_max_length', 255),
                Rule::unique('clients', 'email')->ignore($clientId),
            ],
            'address' => 'required|string|min:4|max:100',
            'phone' => 'nullable|string|max:20',
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
