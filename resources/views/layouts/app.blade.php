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

    <script>
        window.userRole = "{{ auth()->user()->role ?? 'viewer' }}";
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
                    class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1 {{ request()->is('dashboard') ? 'active' : '' }}">
                    <i class="bi bi-speedometer2 me-2"></i> Dashboard
                </a>

                <a href="/clients"
                    class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1 {{ request()->is('clients*') ? 'active' : '' }}">
                    <i class="bi bi-people me-2"></i> Manajemen Klien
                </a>

                <a href="/services"
                    class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1 {{ request()->is('services*') ? 'active' : '' }}">
                    <i class="bi bi-tools me-2"></i> Service Tracking
                </a>

                <a href="/interactions"
                    class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1 {{ request()->is('interactions*') ? 'active' : '' }}">
                    <i class="bi bi-journal-text me-2"></i> Interaction Logs
                </a>

                <a href="/activity-logs"
                    class="list-group-item list-group-item-action list-group-item-light p-3 rounded mb-1 admin-only {{ request()->is('activity-logs*') ? 'active' : '' }}">
                    <i class="bi bi-eye me-2"></i> Activity Logs
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
                            <i class="bi bi-person-circle me-1"></i>
                            <span id="navUserName">Loading...</span> </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><button class="dropdown-item" id="btnProfile">Profile</button></li>
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

    <div class="modal fade" id="profileModal" tabindex="-1">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold">Profil Saya</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="mb-3">
                        <i class="bi bi-person-circle display-1 text-secondary"></i>
                    </div>
                    <h5 class="fw-bold" id="profileName">-</h5>
                    <p class="text-muted mb-2" id="profileEmail">-</p>
                    <span class="badge bg-info text-dark text-uppercase" id="profileRole">-</span>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Tutup</button>
                </div>
            </div>
        </div>
    </div>
</body>

</html>