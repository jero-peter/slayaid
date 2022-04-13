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


Route::middleware('auth:sanctum')->post('/identity-verification', [App\Http\Controllers\RemoteController::class, 'verifyUser'])->name('verification');

Route::middleware('auth:sanctum')->post('/get-help', [App\Http\Controllers\RemoteController::class, 'getHelp'])->name('getHelp');