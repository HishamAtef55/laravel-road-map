// all elements that closes popup when clicked
const forgotPasswordCloseBtn = document.querySelector(".forgot-password-popup .close-btn");
const forgotPasswordCancelBtn = document.querySelector("#forgotPasswordForm .cancel-btn");
const forgotPasswordDarkBg = document.querySelector(".forgot-password-bg");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordHintViewer = document.querySelector(".forgot-password-hint-viewer");
const forgotPasswordPopup = document.querySelector(".forgot-password-popup");
let allForgotPasswordInputs = document.querySelectorAll("#forgotPasswordForm input, #forgotPasswordForm select, #forgotPasswordForm textarea");
let forgotPassowordCloseList = [forgotPasswordCloseBtn, forgotPasswordCancelBtn, forgotPasswordDarkBg];
// loop over elements and close popup when clicked
forgotPassowordCloseList.forEach(btn => btn && btn.addEventListener("click", close));
// close popup using class
function close(e) {
  e.preventDefault();
  forgotPasswordForm.reset();
  allForgotPasswordInputs.forEach(input => {
    input.classList.remove("invalid");
    input.classList.remove("valid");
  });
  forgotPasswordHintViewer.innerText = "";
  if (forgotPasswordPopup) forgotPasswordPopup.classList.add("hide");
  if (forgotPasswordDarkBg) forgotPasswordDarkBg.classList.add("hide");
}

// switch to forgot password
let ForgotPassowrdFormLoginBtn = document.querySelector(".forgot-password-form-login-btn");
if (ForgotPassowrdFormLoginBtn)
  ForgotPassowrdFormLoginBtn.addEventListener("click", e => {
    e.preventDefault();
    forgotPasswordDarkBg.classList.add("hide");
    forgotPasswordPopup.classList.add("hide");

    if (loginDarkBg) loginDarkBg.classList.remove("hide");
    if (loginPopup) loginPopup.classList.remove("hide");
  });

// Validation
const forgotPasswordSubmitBtn = document.getElementById("forgotPasswordSubmit");
if (forgotPasswordSubmitBtn) {
  forgotPasswordSubmitBtn.addEventListener("click", e => {
    if (!validateForgotPassword(e)) return;
    // if pass all validations send data
    forgotPasswordHintViewer.innerText = "جار التحميل...";
    
  });
}

allForgotPasswordInputs.forEach(input => input.addEventListener("keyup", validateForgotPassword));

function validateForgotPassword(e) {
  // make all invalid to valid
  let allInvalid = document.querySelectorAll("#forgotPasswordForm .invalid");
  allInvalid.forEach(el => el.classList.remove("invalid"));

  // Validate email
  if (!isValid(e, "forgotPasswordForm", forgotPasswordHintViewer, "", isEmpty, "email", "برجاء ادخال البريد الالكترونى")) return;
  if (!isValid(e, "forgotPasswordForm", forgotPasswordHintViewer, "not", validEmail, "email", "البريد الالكترونى غير صالح, مثال: example@gmail.com")) return;

  return true;
}
