<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Client;

class NavigationController extends Controller
{
    public function index(){
        return view('landing');
    }
}
