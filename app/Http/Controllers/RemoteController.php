<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Agent;
use App\Models\Client;

class RemoteController extends Controller
{
    public function fetchSupportData($c_uuid){
        $owner = User::where('c_uuid', $c_uuid)->where('user_group', 1)->first();
        $clients = Client::where('client_of', $owner->id)->get();

        return response()->json(['agents' => $owner->agents , 'clients' => $clients]);
    }

    public function verifyUser(Request $request){
        $owner = $request->user();
        if($owner){
            $customer = Client::where('uuid', $request->get('uuid'))->first();
            if($customer){
                if($customer->ownership_id == $owner->id){
                    return response()->json($customer->makeVisible('uuid'));
                }else{
                    return response(401);
                }
            }else{
                $customer = new Client;
                $customer->uuid = $request->get('uuid');
                $customer->name = $request->get('name');
                $customer->company_name = $request->get('company');
                $customer->ownership_id = $owner->id;
                $customer->save();

                return response()->json(['agents' => $owner->agents , 'clients' => $owner->clients]);
            }
        }
    }

}
