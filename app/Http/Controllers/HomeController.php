<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class HomeController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function chat($c_uuid){
        $owner = User::where('c_uuid', $c_uuid)->first();
        if($owner){
            $owner = $owner->makeVisible(['t_token']);
            return view('home')->with('user', $owner);
        }else{
            return response(400);
        }
    }
}
