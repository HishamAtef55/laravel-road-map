<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
        rel="stylesheet" />
    <!-- Style -->
    <link rel="stylesheet" href="{{ asset('css/main.css') }}" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="{{ asset('assets/fa-6.2.1/css/all.min.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/fa-6.2.1/css/fontawesome.min.css') }}" />
    <title>Login Admin</title>
</head>

<body>
    <div class="login-admin-page">
        <div class="background">
            <img src="{{ asset('images/loginBg.jpg') }}" alt="background" />
        </div>
        <!-- login Card Start -->
        <div class="login-popup card show-animation">
            <h1 class="card-title">تسجيل دخول</h1>
            <form autocomplete="off" id="loginForm" action="{{ route('login') }}" method="POST">
                @csrf
                <section>
                    <!-- Email -->
                    <div class="input-group">
                        <label>البريد الالكترونى <span class="required">*</span></label>
                        <input class="email" type="email" name="email" />
                        @error('email')
                            <span class="error">{{ $message }}</span>
                        @enderror
                    </div>
                    <!-- Password -->
                    <div class="input-group">
                        <label>كمة السر <span class="required">*</span></label>
                        <input class="password" type="password" name="password" />
                        <button class="show-password"><i class="fa-solid fa-eye"></i></button>
                    </div>
                </section>

                <p class="login-hint-viewer hint-viewer"></p>
                <!-- Buttons Section Start -->
                <section class="btns-section">
                    <button class="main-btn" id="loginAdminSubmit" type="submit">تسجيل دخول <i
                            class="fa-solid fa-arrow-right-to-bracket"></i></button>
                </section>
                <hr />
                {{-- <div class="links">
                    <a href="{{ route('admin.forget-Password') }}" class="form-link">نسيت كلمة السر</a>
                </div> --}}
            </form>
            <!-- Buttons Section End -->
            <script>
                let appRoot = "{{ url('/') }}"
            </script>
            <script src="{{ asset('js/utils/validations.js') }}"></script>
            <script src="{{ asset('js/auth/login.js') }}"></script>
        </div>
        <!-- login Card End -->
    </div>
    @include('includes.dashboard.admin.alert')
</body>

</html>
