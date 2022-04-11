@extends('layouts.app')

@section('content')
    <div class="container">
        @if(auth()->user()->user_group == 1)
            <administrator data="{{$admin}}" token="{{$token}}" user="{{auth()->user()}}"></administrator>
        @elseif(auth()->user()->user_group == 2)
            <agent data="{{$admin}}" user="{{auth()->user()}}"></agent>
        @elseif(auth()->user()->user_group == 3)
            <client data="{{$admin}}" user="{{auth()->user()}}"></client>
        @endif
    </div>
@endsection