<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @include('includes.dashboard.admin.css')
    <title>Activities Bank</title>
</head>

<body>

    @include('includes.dashboard.admin.admin-sidebar')
    <div class="page-container">
        @include('includes.dashboard.admin.header')
        @yield('content')
    </div>
    @include('includes.dashboard.admin.alert')
    @yield('scripts')
</body>

</html>
