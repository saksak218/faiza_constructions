<?php

namespace App\Policies;

use App\Models\ConstructionJob;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConstructionJobPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ConstructionJob $constructionJob): bool
    {
        // Sirf woh user update kar sakta hai jiski ID assigned_person_id se match karti ho
        return $user->id === $constructionJob->assigned_person_id;
    }
}
