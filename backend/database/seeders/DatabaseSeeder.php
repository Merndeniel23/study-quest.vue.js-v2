<?php

namespace Database\Seeders;

use App\Models\Assignment;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Assignment::query()->delete();

        Assignment::query()->create([
            'name' => 'Finish Vue.js Activity',
            'subject' => 'Web Development',
            'priority' => 'High',
            'completed' => false,
        ]);

        Assignment::query()->create([
            'name' => 'Review Algebra Notes',
            'subject' => 'Mathematics',
            'priority' => 'Medium',
            'completed' => true,
        ]);

        Assignment::query()->create([
            'name' => 'Read Chapter 5',
            'subject' => 'English',
            'priority' => 'Low',
            'completed' => false,
        ]);
    }
}
