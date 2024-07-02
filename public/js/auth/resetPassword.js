// all elements that closes popup when clicked
const resetPasswordCloseBtn = document.querySelector(
    ".reset-password-popup .close-btn"
);
const resetPasswordCancelBtn = document.querySelector(
    "#resetPasswordForm .cancel-btn"
);

const resetPasswordDarkBg = document.querySelector(".reset-password-bg");
const checkPinCodeDarkBg = document.querySelector(".check-pinCode-bg");

const resetPassowrdForm = document.getElementById("resetPasswordForm");

const resetPassowrdHintViewer = document.querySelector(
    ".reset-password-hint-viewer"
);

const resetPasswordPopup = document.querySelector(".reset-password-popup");
const checkPinCodePopup = document.querySelector(".check-pinCode-popup");

const data = document.querySelector(".data");

let resetPasswordAllInputs = document.querySelectorAll(
    "#resetPasswordForm input, #resetPasswordForm select, #resetPasswordForm textarea"
);
let resetPasswordCloseList = [
    resetPasswordCloseBtn,
    resetPasswordCancelBtn,
    resetPasswordDarkBg,
];
// loop over elements and close popup when clicked
resetPasswordCloseList.forEach(
    (btn) => btn && btn.addEventListener("click", close)
);
// close popup using class
function close(e) {
    e.preventDefault();
    resetPassowrdForm.reset();
    resetPasswordAllInputs.forEach((input) => {
        input.classList.remove("invalid");
        input.classList.remove("valid");
    });
    resetPassowrdHintViewer.innerText = "";
    if (resetPasswordPopup) resetPasswordPopup.classList.add("hide");
    if (resetPasswordDarkBg) resetPasswordDarkBg.classList.add("hide");
}
// show password handle
let resetPasswordShowPasswordBtn = document.querySelector(
    "#resetPasswordForm .show-password"
);
let resetPasswordShowConfirmPasswordBtn = document.querySelector(
    "#resetPasswordForm .show-confirm-password"
);
let resetPasswordShowPasswordBtns = [
    resetPasswordShowPasswordBtn,
    resetPasswordShowConfirmPasswordBtn,
];
resetPasswordShowPasswordBtns.forEach(
    (btn) =>
        btn &&
        btn.addEventListener("click", (e) =>
            showPassword(e, "resetPasswordForm")
        )
);
// Validation
const resetPasswordSubmitBtn = document.getElementById("resetPasswordSubmit");
if (resetPasswordSubmitBtn) {
    resetPasswordSubmitBtn.addEventListener("click", (e) => {
        if (!validateResetPassword(e)) return;
        // if pass all validations send data
        resetPassowrdHintViewer.innerText = "جار التحميل...";
    });
}

resetPasswordAllInputs.forEach((input) =>
    input.addEventListener("keyup", validateResetPassword)
);

function validateResetPassword(e) {
    // make all invalid to valid
    let allInvalid = document.querySelectorAll("#resetPasswordForm .invalid");
    allInvalid.forEach((el) => el.classList.remove("invalid"));

    // Validate Password
    if (
        !isValid(
            e,
            "resetPasswordForm",
            resetPassowrdHintViewer,
            "",
            isEmpty,
            "password",
            "برجاء ادخال كلمة المرور"
        )
    )
        return;
    if (
        !isValid(
            e,
            "resetPasswordForm",
            resetPassowrdHintViewer,
            "not",
            passwordLengthOk,
            "password",
            "يجب ان تتكون كلمة المرور من 8 الى 30 حرف"
        )
    )
        return;
    if (
        !isValid(
            e,
            "resetPasswordForm",
            resetPassowrdHintViewer,
            "not",
            haveSpecialChar,
            "password",
            "يجب ان تحتوى كلمة المرور على رموز, مثال: # $ & *"
        )
    )
        return;
    // Validate confirm Password
    if (
        !isValid(
            e,
            "resetPasswordForm",
            resetPassowrdHintViewer,
            "not",
            confirmPasswordMatch,
            "confirm_password",
            "كلمة المرور والتاكيد غير متطابقتين"
        )
    )
        return;

    return true;
}
