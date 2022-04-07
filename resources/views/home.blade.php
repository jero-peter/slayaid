@extends('layouts.app')

@section('content')
<div class="container-fluid">
    @auth
        <Remote cuuid="{{$user->c_uuid}}" user="{{$user}}"></Remote>
    @endauth
</div>

@endsection




