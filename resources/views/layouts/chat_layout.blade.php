<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <script src="/js/jquery.js"></script>

    <style>
        
        .pulse {
            position: absolute;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border: 2px solid #000000;
            border-radius: 50%;
            box-sizing: border-box;
        }

        .pulse:after {
            animation-delay: 1s;
        }
  
        @keyframes  animate {
            0% {
                transform: scale(2.0);
            }
  
            100% {
                transform: scale(0.7);
            }
        }
        }
    
    </style>

    
    <title>{{ config('app.name', 'Laravel') }}</title>
    <link href="/css/app.css" rel="stylesheet">
    <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
</head>
<body>
    <div id="cursorDiv" class="text-dark"  style="display:none;position:absolute;top:0;left:0;z-index:102;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzUlEQVR4XpWTT2iSYRzHP4Y6t7JLw4NCXRYrZl2adJ+jUVTEDuHuQUHsFgRBEEGNLalwM3UrijG0Fv1Z9Mc61CUiWKbnbeYke41OQk1998731+tlaLje7QNfntP3w4/f8zyIyHoeTM9omNPU2UYDtVrNOj0Tl6l79z1sjmaBpmmcPHEcp9NZiMTuBrYuWFujo6OdY0cH6OzclbgTnUxsSaDXdKqVCsvLeQaO+Nnb1RUYD0cKmxeIoKqr/P6zwsJiFq+3B19vr+d2aELCkZjHVIDoqKsqbXYbiFAsFnG5XPT3+wEK4+Fo4P8T6IZArQvs2I3YbDaq1TLtDgf+vr76chOhicizDQUiGAKNNqNQqZRxGOfbd+958vQ5r14nKZVKAKdowPrvDupTKMovvmYynB4cxNuznzfJZOxmcGwKAGD4/LmNdiCslMuk0hm9+EOZzeXz7Ovuxu12DwGphrQWWCwwP/+Fz58+nr0xNnIhnc7g3LGdgwe8O0dGg0OmtyBiQVGUucezjx4C37PfspMLi0sc9vnqzzxu+jGAQ8Ae1sEdCkdl7sVLuXT5yodWHSvNpGhGyeVy8Z+Ksvv6tatnaIEVE24FRy8CDiBLC/4C3kjgJkXCw9gAAAAASUVORK5CYII="><span id="cursorText"></span></div>
    <main class="py-4">
        @yield('content')
    </main>
    <script src="/js/p2pwc.js"></script>
</body>
</html>