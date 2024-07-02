<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Auth::routes();


Route::group([
    'middleware' => [
        'auth',
    ],
    'prefix' => 'dashboard',
    'as' => 'admin.'
], function () {
    Route::view('/', 'dashboard.admin.home')->name('home');
    Route::get('/logout', [UserController::class, 'logout'])->name('logout');
});

Route::group([
    'middleware' => [
        'guest',
        'throttle:login'
    ],
], function () {
    Route::view('/login', 'dashboard.auth.login')->name('login.page');
    Route::post('/auth/login', [UserController::class, 'login'])->name('login');
});


Route::fallback(function () {
    abort(404);
});
