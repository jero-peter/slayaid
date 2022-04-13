<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Agent;
use App\Models\Client;
use App\Events\ClientNeedsHelp;

class RemoteController extends Controller
{
    public function fetchSupportData($c_uuid){
        $owner = User::where('uuid', $c_uuid)->where('user_group', 1)->first();
        $clients = Client::where('client_of', $owner->id)->get();

        return response()->json(['agents' => $owner->agents->makeVisible('uuid') , 'clients' => $clients->makeVisible('uuid')]);
    }

    public function verifyUser(Request $request){
        $owner = $request->user();
        if($owner){
            $client = Client::where('uuid', $request->get('uuid'))->where('ownership_id', $owner->id)->first();
            if($client){
                return response()->json(['agents' => $owner->agents->makeVisible('uuid') , 'clients' => $owner->clients->makeVisible('uuid'), 'you' => $client->makeVisible('uuid')]);
            }else{
                $client = new Client;
                $client->uuid = $request->get('uuid');
                $client->name = $request->get('name');
                $client->company_name = $request->get('company');
                $client->ownership_id = $owner->id;
                $client->save();

                return response()->json(['agents' => $owner->agents->makeVisible('uuid') , 'clients' => $owner->clients->makeVisible('uuid'), 'you' => $client->makeVisible('uuid')]);
            }
        }
    }
    public function getHelp(Request $request){
        $owner = $request->user();
        $client = $owner->clients->where('uuid', $request->get('uuid'))->first();

        event(new ClientNeedsHelp($client->makeVisible('uuid')));
    }
}

