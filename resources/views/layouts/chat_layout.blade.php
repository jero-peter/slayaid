<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <link href="/css/app.css" rel="stylesheet">
    <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
</head>
<body>
    <main class="py-4">
        @yield('content')
    </main>
    <script src="/js/app.js"></script>
    <script src="/js/p2pwc.js"></script>
    {{-- <script src="/js/p2p.js"></script> --}}
</body>
</html>