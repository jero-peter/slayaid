<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test Code
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



//Test Code
Route::post('get-help', function (Request $request){

    $userCode = $request->get('user-code');
    $availableAgents = User::where('user_group', 2)->first();

    return response()->json(['available-agents' => $availableAgents, 'user-code' => $userCode]);
});

