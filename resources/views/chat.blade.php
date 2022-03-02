@extends('layouts.chat_layout')

@section('content')
<div class="container">
    <div class="row justify-content-center my-5">
        <p id="notification" hidden></p>

        <div class="row card card-body" id="entry-modal">
            <h5 class="card-title">Create or Join Meeting</h5>
            <div class="my-3">
                <input id="room-input" class="form-control"  placeholder="Enter Room ID">
                <div class="my-3">
                    <button onclick="create()" class="btn btn-primary">Create Room</button>
                    <button onclick="connect()" class="btn btn-secondary">Join Room</button>
                </div>
            </div>
        </div>
        <video id="share-stream" class="p-0 my-5" style="cursor: none;" onmousemove="showCoordinates(event)" onmouseout="flushCoordinates(event)"></video>
        </div>
    </div>
</div>
@endsection
