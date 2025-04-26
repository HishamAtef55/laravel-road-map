<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/names/{name?}', function (?string $name = null) {
    if(is_null($name)) {
        return response()->json(['error' => 'Name is optional'], 400);
    }
    return $name;
});

Route::get('/users/{user:name}', function (App\Models\User $user) {
    return 'user ' . $user;
})
->missing(function (Request $request) {
    return response()->json(['error' => 'user not found'], 404);
});
Route::get('/users/{user:name}', function (App\Models\User $user) {
    return 'user ' . $user;
})
->missing(function (Request $request) {
    return response()->json(['error' => 'user not found'], 404);
});


