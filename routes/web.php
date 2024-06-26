<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::view('/about', 'about', ['name' => 'Taylor']);

Route::controller(UserController::class)->group(function () {

    Route::get('/user/profile', 'profile')->name('profile');
    Route::get('/user/{id}', 'show')->name('show');
})->missing(function (Request $request) { #user this only at route model binding
    return to_route('home');
});

// Route::get(
//     '/user/profile',
//     [UserController::class, 'profile']
// )->name('profile');


// Route::get('/user/{id}', [UserController::class, 'show'])
//     ->name('show');
// ->whereUlid('id');


// Route::get('/user/{name?}', function (?string $name = null) {
//     return $name;
// }); # name is optional

Route::group([
    'middleware' => [
        'auth',
    ],
    'prefix' => '/app',
    'as' => 'app.',
    'namespace' => 'App',

], function () {
    Route::get('/dashboard', [UserController::class, 'show'])->name('show');
});

Route::fallback(function () {
    abort(404);
});
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home')->middleware(['auth', 'verified']);

Auth::routes();

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
