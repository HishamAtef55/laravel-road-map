// Profile Image elements
const profileImgBtn = document.querySelector("#profile_image");
const profileImgView = document.querySelector("#profileImgView");
const profileImageSaveBtn = document.querySelector(".profile-image-btn");
// cover Image elements
const coverImageBtn = document.querySelector("#cover_image");
const coverImageSaveBtn = document.querySelector(".cover-image-btn");
const coverImageView = document.querySelector("#coverImgView");

handleImage(profileImgBtn, profileImgView, profileImageSaveBtn);
// handleImage(coverImageBtn, coverImageView, coverImageSaveBtn);

function handleImage(btn, viewer, saveBtn) {
  btn.addEventListener("change", e => {
    // when input file change show image in image viewer
    let files = e.target.files;
    let image = files[0] ? files[0] : null;
    
    if (viewer && image) {
      
      viewer.src = URL.createObjectURL(image);
      saveBtn.classList.add("show");
    }
    //  if input is empty show default image
    else {
      saveBtn.classList.remove("show");
    }
  });
}

// Validation
let mainDataChanged = false;
let passwordDataChanged = false;

const mainSubmitBtn = document.querySelector(".save-profile-data-btn");
if (mainSubmitBtn)
  mainSubmitBtn.addEventListener("click", e => {
    if (!mainDataChanged) return e.preventDefault();
    let hintViewer = document.querySelector(".main-hint-viewer");
    if (!validateMainData(e)) return;
    // if pass all validations send data
    hintViewer.innerText = "جار التحميل...";
  });

const passwordSubmitBtn = document.querySelector(".save-password-btn");
if (passwordSubmitBtn)
  passwordSubmitBtn.addEventListener("click", e => {
    if (!passwordDataChanged) return e.preventDefault();
    let hintViewer = document.querySelector(".password-hint-viewer");
    if (!validatePasswordData(e)) return;
    // if pass all validations send data
    hintViewer.innerText = "جار التحميل...";
  });

// Listen to inputs to validate
function listenTo(formId, validateFunction) {
  let allElements = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
  allElements.forEach(input => {
    input.addEventListener("keydown", validateFunction);
    input.addEventListener("keyup", validateFunction);
    input.addEventListener("change", validateFunction);
  });
}
listenTo("mainForm", validateMainData);
listenTo("passwordForm", validatePasswordData);

function validateMainData(e) {
  mainDataChanged = true;
  mainSubmitBtn.classList.remove("disabled");
  // make all invalid to valid
  let hintViewer = document.querySelector(".main-hint-viewer");
  let allInvalid = document.querySelectorAll(".invalid");
  allInvalid.forEach(el => el.classList.remove("invalid"));

  // Validate first name
  if (!isValid(e, "mainForm", hintViewer, "", isEmpty, "first_name", "يرجى ادخال الاسم الاول")) return;
  if (!isValid(e, "mainForm", hintViewer, "not", nameLengthOk, "first_name", "يجب ان يتكون الاسم الاول من 2 الى 10 حروف")) return;
  if (!isValid(e, "mainForm", hintViewer, "", hasNumber, "first_name", "لا يمكن اضافة ارقام فى الاسم الاول")) return;
  // Validate last name
  if (!isValid(e, "mainForm", hintViewer, "", isEmpty, "last_name", "يرجى ادخال اسم العائلة")) return;
  if (!isValid(e, "mainForm", hintViewer, "not", nameLengthOk, "last_name", "يجب ان يتكون اسم العائلة من 2 الى 10 حروف")) return;
  if (!isValid(e, "mainForm", hintViewer, "", hasNumber, "last_name", "لا يمكن اضافة ارقام فى اسم العائلة")) return;
  // Validate email
  if (!isValid(e, "mainForm", hintViewer, "not", validEmail, "email", "البريد الالكترونى غير صالح, مثال: example@gmail.com")) return;
  // Validate mobile
  if (!isValid(e, "mainForm", hintViewer, "", isEmpty, "mobile", "برجاء ادخال رقم الموبايل")) return;
  if (!isValid(e, "mainForm", hintViewer, "not", isNumber, "mobile", "الموبايل يجب ان يكون ارقام فقط")) return;
  // Validate birthday
  if (!isValid(e, "mainForm", hintViewer, "", isEmpty, "birthday", "برجاء اختيار تاريخ الميلاد")) return;
  if (!isValid(e, "mainForm", hintViewer, "not", isAdult, "birthday", "العمر يجب ان يكون اكثر من 18 عام")) return;
  // Validate gender
  if (!isValid(e, "mainForm", hintViewer, "", isEmpty, "gender", "برجاء اختيار الجنس")) return;
  return true;
}

function validatePasswordData(e) {
  passwordDataChanged = true;
  passwordSubmitBtn.classList.remove("disabled");
  // make all invalid to valid
  let hintViewer = document.querySelector(".password-hint-viewer");
  let allInvalid = document.querySelectorAll(".invalid");
  allInvalid.forEach(el => el.classList.remove("invalid"));

  // Validate Password
  if (!isValid(e, "passwordForm", hintViewer, "", passwordSameAsOld, "password", "كلمة المرور الجديدة يجب ان تكون مختلفة عن القديمة")) return;
  if (!isValid(e, "passwordForm", hintViewer, "", isEmpty, "password", "برجاء ادخال كلمة المرور")) return;
  if (!isValid(e, "passwordForm", hintViewer, "not", passwordLengthOk, "password", "يجب ان تتكون كلمة المرور من 8 الى 30 حرف")) return;
  if (!isValid(e, "passwordForm", hintViewer, "not", haveSpecialChar, "password", "يجب ان تحتوى كلمة المرور على رموز, مثال: # $ & *")) return;
  // Validate confirm Password
  if (!isValid(e, "passwordForm", hintViewer, "not", confirmPasswordMatch, "confirm_password", "كلمة المرور والتاكيد غير متطابقتين")) return;

  return true;
}
