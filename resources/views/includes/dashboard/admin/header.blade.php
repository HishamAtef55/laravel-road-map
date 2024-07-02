<header class="header">
    <div class="right"></div>
    <div class="center">
    </div>
    <div class="left">
        <div class="user-box">
            <div class="box">

                <div class="image">
                    <img src="{{ asset('images/defaultImg.png') }}" alt="user profile" />
                </div>
                <div class="text">
                    <p class="role">مدير النظام</p>
                    @auth
                    
                    <h2 class="name">{{ auth()->user()->name }}</h2>
                    @endauth
                </div>
            </div>
            <div class="header-user-dropdown">
                <ul>
                    <li>
                        <a href=""><i class="fa-solid fa-user-circle"></i>عرض
                            البروفايل</a>
                    </li>
                    @auth
                        
                    <li>
                        <a href="{{ route('admin.logout') }}"><i class="fa-solid fa-arrow-right-from-bracket"></i>تسجيل
                            خروج</a>


                    </li>
                    @endauth
                </ul>
            </div>
        </div>
    </div>

</header>
<script src="{{ asset('js/panel/header.js') }}" defer></script>
<!-- Header end -->
