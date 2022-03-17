@extends('layouts.app')

@section('content')
<div class="container-fluid">
    @auth
        <Remote cuuid="{{auth()->user()->c_uuid}}" user="{{auth()->user()}}"></Remote>
        {{-- 
        <div class="container">
            <button name="create-room" id="create-room" class="btn btn-primary" onclick="createRoom()" role="button">Create Room</button>
            <button name="share-screen" id="share-screen" class="btn btn-success" onclick="startScreenShare()" role="button" style="display: none">Share Screen</button>
            <button name="join-room" id="join-room" class="btn btn-secondary" onclick="joinRoom()" role="button">Join Room</button>
            <button name="agent-join" id="agent-join" class="btn btn-secondary" onclick="joinRoom(true)" role="button">Join as Agent</button>

            <div id="video-container" class="row container position-relative my-3">
            </div>


            <div class="container-fluid" id="iframe-browser">
            </div>
            <div class="container-fluid fixed-bottom" id="agent-controls"></div>


        </div> --}}
    @endauth
</div>

@endsection




