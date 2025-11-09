<?php

namespace App\Http\Requests\User;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateUserRequest extends FormRequest
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
        $id = $this->route('id_user');

        return [
            'name' => 'required|string|min:2|max:25',
            'lastname' => 'required|string|min:2|max:25',
            'email' => 'required|email|max:' . config('limits.email_max_length') . '|unique:users,email,' . $id, // Asegura que el email actual no genere un conflicto
            'role' => 'required|string|in:admin,normal',
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
