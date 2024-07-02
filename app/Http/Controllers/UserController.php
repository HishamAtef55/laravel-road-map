<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\RedirectsUsers;
use Illuminate\Foundation\Auth\ThrottlesLogins;

class UserController extends Controller
{


    public function login(
        LoginRequest $request
    ) {

        if ($this->attemptLogin($request)) {

            $request->session()->regenerate();

            return to_route('admin.home');
        }
        return back()->with([
            'fail' => 'The provided credentials do not match our records.',
        ]);
    }
    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        auth()->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return to_route('login.page');
    }
    /**
     * Attempt to log the user into the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function attemptLogin(Request $request)
    {
        return Auth::attemptWhen(
            [

                'email' => $request->validated('email'),
                'password' => $request->validated('password'),
            ],
            function (User $user) {
                return $user->active;
            }
        );
    }
}
