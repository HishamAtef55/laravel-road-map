<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class UserController extends Controller
{
    public function show(
        string $id
    ) {
        dd($id);
    }

    public function profile()
    {
        // $route = Route::current(); // Illuminate\Routing\Route
        // $name = Route::currentRouteName(); // string
        // $action = Route::currentRouteAction(); // string
        // dd(
        //     $route,
        //     $name,
        //     $action
        // );
        return to_route('show', ['id' => 5]);
    }
}
