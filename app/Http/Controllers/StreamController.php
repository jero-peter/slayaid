<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Client;

class StreamController extends Controller
{
    public function fetchSupportDetails($c_uuid){
        $agentListing = User::where('user_group', 2)->get()->makeVisible(['c_uuid']);
        $otherUsers = User::where('user_group', '!=', 2)->get()->makeVisible(['c_uuid']);
        return response()->json(['agents' => $agentListing, 'users' => $otherUsers]);
    }
}
