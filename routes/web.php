<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/user-{c_uuid}', [App\Http\Controllers\HomeController::class, 'chat'])->name('chat');
Route::get('/get-support-data/{c_uuid}', [App\Http\Controllers\StreamController::class, 'fetchSupportDetails']);
// Auth::routes();
Route::post('logout', [App\Http\Controllers\Auth\LoginController::class , 'logout'])->name('logout');
Route::get('/home', [App\Http\Controllers\RemoteController::class, 'index'])->name('home');


Route::get('/', [App\Http\Controllers\RemoteController::class, 'landing']);