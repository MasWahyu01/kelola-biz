<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelola.Biz - Sistem Manajemen</title>
    @vite(['resources/css/app.scss', 'resources/js/app.js'])

    <script>
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            window.location.href = '/login';
        }
    </script>
</head>

<body class="bg-light">

    <div class="d-flex" id="wrapper">
        <div class="bg-white border-end" id="sidebar-wrapper" style="width: 250px; min-height: 100vh;">
            <div class="sidebar-heading border-bottom bg-primary text-white p-3">
                <h5 class="m-0 fw-bold">Kelola.Biz</h5>
            </div>
            <div class="list-group list-group-flush p-2">
                <a href="/dashboard"
                    class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1 active">
                    Dashboard
                </a>
                <a href="#" class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1">
                    Manajemen Klien
                </a>
                <a href="#" class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1">
                    Service Tracking
                </a>
                <a href="#" class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1">
                    Interaction Logs
                </a>
            </div>
        </div>

        <div id="page-content-wrapper" class="w-100">
            <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4 py-3">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <h4 class="m-0 text-muted" id="page-title">@yield('title', 'Dashboard')</h4>

                    <div class="dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="userDropdown"
                            data-bs-toggle="dropdown">
                            User Admin
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#">Profile</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><button class="dropdown-item text-danger" id="btnLogout">Logout</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="container-fluid p-4">
                @yield('content')
            </div>
        </div>
    </div>

    <script>
        document.getElementById('btnLogout').addEventListener('click', () => {
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
        });
    </script>
</body>

</html>