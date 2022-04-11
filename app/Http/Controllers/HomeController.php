<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class HomeController extends Controller
{
    public function __construct(){
        $this->middleware(['auth:web,agent']);
    }
    public function home(){
        if(auth()->user()){
            if(auth()->user()->user_group == 1){
                return redirect('/dash-'.auth()->user()->uuid);
            }elseif(auth()->user()->user_group == 2){
                return redirect('/dash-'.auth()->user()->user->uuid);
            }
        }else{
            return response(400);
        }
    }
    public function dashboard($uuid){
        $admin = User::with('clients', 'agents')->where('uuid', $uuid)->first()->makeVisible('support_token');
        return view('dashboard')->with(['admin' => $admin, 'token' => $admin->support_token]);
    }
}
