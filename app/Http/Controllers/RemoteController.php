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


    
    // public function getHelp($c_uuid){
    //     $owner = User::where('c_uuid', $c_uuid)->where('user_group', 1)->first();
    // }

    // public function landing(){
    //     return view('welcome');
    // }
    // public function index()
    // {
    //     return redirect('/user-'.auth()->user()->c_uuid)->with('user', auth()->user()->c_uuid);
    // }


    public function verifyUser(Request $request){
        $owner = $request->user();
        if($owner){
            $customer = Client::where('cc_uuid', $request->get('uuid'))->first();
            if($customer){
                if($customer->client_of == $owner->id){
                    return response()->json($customer);
                }else{
                    return response(401);
                }
            }else{
                $customer = new Client;
                $customer->cc_uuid = \Str::uuid();
                $customer->name = $request->get('name');
                $customer->company_name = $request->get('company');
                $customer->client_of = $owner->id;
                $customer->save();

                return response()->json(['agents' => $agents , 'clients' => $clients]);
            }
        }
    }

}
