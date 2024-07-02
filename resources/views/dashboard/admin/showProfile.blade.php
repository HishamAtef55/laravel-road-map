@extends('layouts.master')
@section('content')
<div class="page-content profile">
    <div class="cover-image">
      <img src="{{ asset('images/cover.jpg') }}" alt="cover" />
    </div>
    <div class="profile-image">
      @if($admin->profile_image)
    <img id="profileImgView" src="{{ asset('images/admin-guard/' . $admin->profile_image) }}" alt="user profile" />
    @else
    <img id="profileImgView" src="{{ asset('images/default/defaultImg.png') }}" alt="user profile" />
    @endif
    
    </div>
    <div class="profile-box">
      <div class="main-details">
        <h1 class="name">{{ $admin->first_name }} {{ $admin->last_name }}</h1>
        <p class="role">مدير النظام</p>
        <div class="buttons">
          <a class="profile-btn main-btn green" href="{{ route('admin.edit-profile',$admin->id) }}">تعديل <i class="fa-solid fa-user-edit"></i></a>
          <a class="profile-btn main-btn" href="{{ route('admin.home') }}">الرئيسية <i class="fa-solid fa-dashboard"></i></a>
        </div>
      </div>
      <div class="profile-card">
        <section class="profile-section">
          <h2 class="section-title">البيانات الشخصية</h2>
          {{-- <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-city"></i>
            </div>
            <div class="text">
              <h3 class="title">المحافظة</h3>
              <p class="info">الجيزة</p>
            </div>
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="text">
              <h3 class="title">المنطقة</h3>
              <p class="info">الهرم</p>
            </div>
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="text">
              <h3 class="title">لعنوان</h3>
              <p class="info">شارع 12 ع2</p>
            </div>
          </div> --}}
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-venus-mars"></i>
            </div>
            <div class="text">
              <h3 class="title">الجنس</h3>
              <p class="info">
                @if( $admin->gender =='male' )
                ذكر 
                @else
                 أنثى
                @endif
              </p>
            </div>
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-cake-candles"></i>
            </div>
            <div class="text">
              <h3 class="title">تاريخ الميلاد</h3>
              <p class="info">{{ $admin->birthday }}</p>
            </div>
          </div>
        </section>
      </div>
      <div class="profile-card">
        <section class="profile-section">
          <h2 class="section-title">بيانات التواصل</h2>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-phone"></i>
            </div>
            <div class="text">
              <h3 class="title">الموبايل</h3>
              <p class="info">{{ $admin->mobile }}</p>
            </div>
          </div>
          <div class="info-item">
            <div class="icon">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="text">
              <h3 class="title">البريد الالكترونى</h3>
              <p class="info">{{ $admin->email }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
@endsection
@section('scripts')

<script src="{{ asset('js/utils/validations.js') }}"></script>

@endsection