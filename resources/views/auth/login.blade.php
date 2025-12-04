<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Kelola.Biz</title>
    @vite(['resources/css/app.scss', 'resources/js/app.js'])
</head>

<body class="login-page">

    <div class="container">
        <div class="row justify-content-center min-vh-100 align-items-center">
            <div class="col-md-5">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h3 class="text-center mb-4 fw-bold text-primary">Kelola.Biz</h3>

                        <div id="alert-container"></div>

                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="email" required
                                    placeholder="name@example.com">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" required placeholder="******">
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary" id="btnLogin">
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer text-center py-3 bg-white border-0">
                        <small class="text-muted">System v1.0 &copy; 2025</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>

</html>