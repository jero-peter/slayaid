<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Client;
class RemoteController extends Controller
{
    

    
    public function fetchSupportData($c_uuid){
        $owner = User::where('c_uuid', $c_uuid)->where('user_group', 1)->first();
        $agents = User::where('user_group', 2)->get();
        $clients = Client::where('client_of', $owner->id)->get();

        return response()->json(['agents' => $agents , 'clients' => $clients]);
    }
    public function getHelp($c_uuid){
        $owner = User::where('c_uuid', $c_uuid)->where('user_group', 1)->first();
    }
}
