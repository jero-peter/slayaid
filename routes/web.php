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

Route::post('logout', [App\Http\Controllers\Auth\LoginController::class , 'logout'])->name('logout');
Route::get('/', [App\Http\Controllers\NavigationController::class , 'index'])->name('index');
Route::get('/home', [App\Http\Controllers\HomeController::class , 'home'])->name('home');
Route::get('/dash-{uuid}', [App\Http\Controllers\HomeController::class , 'dashboard'])->name('dashboard');