<?php

namespace App\Traits;

trait Filterable
{
    /**
     * Aplica filtros whereIn a la consulta.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $filters
     * @param array $fields
     */
    protected function applyInFilters($query, $filters, $fields)
    {
        foreach ($fields as $field) {
            if (isset($filters[$field]) && !empty($filters[$field])) {
                $query->whereIn($field, $filters[$field]);
            }
        }
    }

    /**
     * Aplica filtros LIKE a la consulta.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $filters
     * @param array $fields
     */
    protected function applyLikeFilters($query, $filters, $fields)
    {
        foreach ($fields as $field) {
            if (isset($filters[$field]) && !empty($filters[$field])) {
                $value = $filters[$field][0]; // Suponiendo que siempre habrá un solo valor
                $query->where($field, 'LIKE', "%{$value}%");
            }
        }
    }
}
