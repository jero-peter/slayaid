@extends('layouts.chat_layout')

@section('content')

    @guest
        <a href="/slayvault/login" class="text-white">Login using slayvault</a>
    @endguest

@endsection
