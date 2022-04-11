@extends('layouts.app')

@section('content')
    <div class="container">
        <h4 class="text-white">Welcome to slayaid</h4>
        @if(auth()->guard('agent')->check() || auth()->guard('web')->check())
            <a href="/home" class="btn text-white bg-dark border border-white">Go to Slayaid</a>
        @else
            <a href="/slayvault/login" class="btn text-white bg-dark border border-white">Login with slayvault</a>
        @endif
    </div>
@endsection