@if (Session::get('fail') || Session::get('success'))
    <!-- alert Start -->
    <div class="alert">
        <div class="top">
            <div class="icon">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="text">
                @if (Session::get('fail'))
                    <h2 class="title">خطأ</h2>
                @else
                    <h2 class="title">تم بنجاح</h2>
                @endif
                @if (Session::get('fail'))
                    <p class="description">{{ session('fail') }}</p>
                @else
                    <p class="description">{{ session('success') }}</p>
                @endif

            </div>
        </div>
        <div class="progress-bar">
            <div class="progress"></div>
        </div>
        <button class="close-alert"><i class="fa-solid fa-x"></i></button>
        <script src="{{ asset('js/panel/alert.js') }}" defer></script>
    </div>
    <!-- alert End -->
@endif
