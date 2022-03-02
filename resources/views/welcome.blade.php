<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Adventure Time</title>

        <link rel="stylesheet" href="/css/app.css">
    </head>
    <body class="antialiased">
        <div class="row-fluid text-center">
          <img class="d-block mx-auto my-5" src="/img/adventure_time.png" alt="">
          <h3 class="text-center">Start your adventure right now!</h3>
          {{-- <a href="/login" class="btn btn-warning text-dark">Log in</a> --}}
          @guest
            <a href="/slayvault/login" class="btn btn-danger text-white float-right"> &#128273; Log in with SlayVault</a>
          @else
            <a href="/home" class="btn btn-danger text-white float-right"> Go To App</a>
          @endguest
        </div>
    </body>
</html>
