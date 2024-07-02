@extends('layouts.master')
@section('content')
<div class="page-content profile edit-profile">
  <div class="cover-image">
    <img id="coverImgView" src="{{ asset('images/cover.jpg') }}" alt="cover" />
    {{-- <form autocomplete="off" class="image-form" action="">
      <input type="file" accept="image/*" name="cover_image" id="cover_image" />
      <label for="cover_image" class="edit-profile-image cover"><i class="fa-solid fa-camera"></i></label>
      <button class="cover-image-btn cover">حفظ</button>
    </form> --}}
  </div>
  <div class="profile-image">
    @if($admin->profile_image)
    <img id="profileImgView" src="{{ asset('images/admin-guard/' . $admin->profile_image) }}" alt="user profile" />
    @else
    <img id="profileImgView" src="{{ asset('images/default/defaultImg.png') }}" alt="user profile" />
    @endif
    </div>

  <div class="profile-box">
    <form autocomplete="off" class="image-form" enctype="multipart/form-data" action="{{ route('admin.update-image-profile',$admin->id) }}" method="POST">
      @method('PUT')
      @csrf
      <input type="file" accept="image/*" name="profile_image" id="profile_image" />
      <label for="profile_image" class="edit-profile-image"><i class="fa-solid fa-camera"></i></label>
      <button class="profile-image-btn">حفظ</button>
    </form>
    <div class="main-details">
      <h1 class="name">{{ $admin->first_name }} {{ $admin->last_name }}</h1>

      <p class="role">مدير النظام</p>
      <div class="buttons">
        <a class="profile-btn main-btn green" href="{{ route('admin.show-profile',$admin->id) }}">عرض البروفايل <i class="fa-solid fa-user-circle"></i></a>
        <a class="profile-btn main-btn" href="{{ route('admin.home') }}">الرئيسية <i class="fa-solid fa-dashboard"></i></a>
      </div>
    </div>
    <div class="profile-card">
      <section class="profile-section">
        <h2 class="section-title">البيانات الشخصية</h2>
        <form autocomplete="off" id="mainForm" action="{{ route('admin.update-personal-data',$admin->id) }}" method="POST">
          @method('PUT')
          @csrf
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-user"></i>
            </div>
            <h3 class="title">الاسم الاول</h3>
            <input type="text" name="first_name" class="first_name" value="{{ $admin->first_name }}" />
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-user"></i>
            </div>
            <h3 class="title">اسم العائلة</h3>
            <input type="text" name="last_name" class="last_name" value="{{ $admin->last_name }}" />
          </div>
       
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-venus-mars"></i>
            </div>
            <h3 class="title">الجنس</h3>
            <select type="text" name="gender" class="gender">
              <option value="{{ $admin->gender }}">
                @if($admin->gender=='male')
                ذكر
                @else
                انثى
                @endif
                
            </option>
            @if($admin->gender=='male')
            <option value="female">انثى</option>
            @else
            <option value="male">ذكر</option>
            @endif

            </select>
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-cake-candles"></i>
            </div>
            <h3 class="title">تاريخ الميلاد</h3>
            <input type="date" name="birthday" class="birthday" value="{{ $admin->birthday }}" />
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-phone"></i>
            </div>
            <h3 class="title">الموبايل</h3>
            <input type="number" name="mobile" class="mobile" value="{{ $admin->mobile }}" />
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <h3 class="title">البريد الالكترونى</h3>
            <input type="email" name="email" class="email" value="{{ $admin->email }}" />
          </div>
          <hr />
          <div class="bottom">
            <button type="submit" class="main-btn disabled save-profile-data-btn">حفظ</button>
            <span class="main-hint-viewer"></span>
          </div>
        </form>
      </section>
    </div>
    <div class="profile-card">
      <section class="profile-section">
        <h2 class="section-title">تغيير كلمة المرور</h2>
        <form autocomplete="off" id="passwordForm" action="{{ route('admin.update-profile-password',$admin->id) }}" method="POST">
          @csrf
          @method('PUT')
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h3 class="title">كلمة السر القديمة</h3>
            <input type="password" name="old_password" class="old_password" />
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h3 class="title">كلمة السر الجديدة</h3>
            <input type="password" name="password" class="password" />
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h3 class="title">تاكيد كلمة السر</h3>
            <input type="password" name="confirm_password" class="confirm_password" />
          </div>
          <hr />
          <div class="bottom">
            <button type="submit" class="main-btn disabled save-password-btn">حفظ</button>
            <span class="password-hint-viewer"></span>
          </div>
        </form>
      </section>
    </div>
  </div>
</div>
@endsection
@section('scripts')
<script src="{{ asset('js/panel/editProfile.js') }}"></script>
<script src="{{ asset('js/utils/validations.js') }}"></script>
@endsection

