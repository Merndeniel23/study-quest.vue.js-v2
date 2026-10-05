<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AssignmentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Assignment::query()->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'priority' => ['required', Rule::in(['Low', 'Medium', 'High'])],
            'completed' => ['sometimes', 'boolean'],
        ]);

        $assignment = Assignment::create([
            ...$validated,
            'completed' => $validated['completed'] ?? false,
        ]);

        return response()->json($assignment, 201);
    }

    public function update(Request $request, Assignment $assignment): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'subject' => ['sometimes', 'required', 'string', 'max:255'],
            'priority' => ['sometimes', 'required', Rule::in(['Low', 'Medium', 'High'])],
            'completed' => ['sometimes', 'boolean'],
        ]);

        $assignment->update($validated);

        return response()->json($assignment->fresh());
    }

    public function destroy(Assignment $assignment): JsonResponse
    {
        $assignment->delete();

        return response()->json([
            'message' => 'Assignment deleted successfully.',
        ]);
    }
}
