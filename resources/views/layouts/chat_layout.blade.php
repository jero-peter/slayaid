<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <style>
        h1,h2,h3,h4,h5,h6,p,.container, .container-fluid, .row{
            font-family: 'Poppins', sans-serif;
        }
    </style>
    <link href="/css/app.css" rel="stylesheet">
</head>
<body>
    <main class="py-4 bg-dark" id="app">
        @yield('content')
    </main>
    <script src="/js/app.js"></script>
    {{-- <script src="/js/p2pwc.js"></script> --}}
    {{-- <script src="/js/p2p.js"></script> --}}
</body>
</html>