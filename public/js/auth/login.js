// all elements that closes popup when clicked
const loginCloseBtn = document.querySelector(".login-popup .close-btn");
const loginCancelBtn = document.querySelector("#loginForm .cancel-btn");
const loginDarkBg = document.querySelector(".login-bg");
const loginForm = document.getElementById("loginForm");
const loginHintViewer = document.querySelector(".login-hint-viewer");
const loginPopup = document.querySelector(".login-popup");
const checkEmailRoute = appRoot + "/user/checkUserLogin";

let allLoginInputs = document.querySelectorAll(
    "#loginForm input, #loginForm select, #loginForm textarea"
);
let loginCloseList = [loginCloseBtn, loginCancelBtn, loginDarkBg];
// loop over elements and close popup when clicked
loginCloseList.forEach((btn) => btn && btn.addEventListener("click", close));
// close popup using class
function close(e) {
    e.preventDefault();
    loginForm.reset();
    allLoginInputs.forEach((input) => {
        input.classList.remove("invalid");
        input.classList.remove("valid");
    });
    loginHintViewer.innerText = "";
    if (loginPopup) loginPopup.classList.add("hide");
    if (loginDarkBg) loginDarkBg.classList.add("hide");
}

// switch to register
let loginFormRegisterBtn = document.querySelector(".login-form-register-btn");
if (loginFormRegisterBtn)
    loginFormRegisterBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginDarkBg.classList.add("hide");
        loginPopup.classList.add("hide");

        if (registerPopup) registerPopup.classList.remove("hide");
        if (registerDarkBg) registerDarkBg.classList.remove("hide");
    });
// show password handle
let loginShowPasswordBtn = document.querySelector("#loginForm .show-password");
loginShowPasswordBtn.addEventListener("click", (e) =>
    showPassword(e, "loginForm")
);
// switch to forgot password
let loginFormForgotPassowrdBtn = document.querySelector(
    ".login-form-forgot-password-btn"
);
if (loginFormForgotPassowrdBtn)
    loginFormForgotPassowrdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginDarkBg.classList.add("hide");
        loginPopup.classList.add("hide");

        if (forgotPasswordDarkBg) forgotPasswordDarkBg.classList.remove("hide");
        if (forgotPasswordPopup) forgotPasswordPopup.classList.remove("hide");
    });

// Validation
const loginSubmitBtn = document.getElementById("loginSubmit");
const loginAdminSubmit = document.getElementById("loginAdminSubmit");

if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", (e) => {
        if (!validateLogin(e)) return;
        checkUserEmail(e);
        // if pass all validations send data
        // loginHintViewer.innerText = "جار التحميل...";
    });
}
if (loginAdminSubmit) {
    loginAdminSubmit.addEventListener("click", (e) => {
        if (!validateLogin(e)) return;

        // if pass all validations send data
        loginHintViewer.innerText = "جار التحميل...";
    });
}
const checkUserEmail = async (e) => {
    e.preventDefault();
    let userEmail = document.querySelector(".email").value;

    checkUserLogin(`${checkEmailRoute}`, {
        email: userEmail,
    });
};
const checkUserLogin = async (Url = {}, data = {}) => {
    loginHintViewer.innerText = "جار التحميل...";

    const response = await fetch(Url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
        },
        body: JSON.stringify(data),
    });
    try {
        const resultData = response.json();
        resultData.then((res) => {
            console.log(res);
            if (res.success == false) {
                loginHintViewer.innerText = "الأيميل غير صحيح ...";
                loginHintViewer.style.color = "red";
            } else {
                loginHintViewer.innerText = "جار التحميل...";
                loginForm.submit();
            }
        });
    } catch (error) {
        console.log("error", error);
    }
};

allLoginInputs.forEach((input) =>
    input.addEventListener("keyup", validateLogin)
);

function validateLogin(e) {
    // make all invalid to valid
    let allInvalid = document.querySelectorAll("#loginForm .invalid");
    allInvalid.forEach((el) => el.classList.remove("invalid"));

    // Validate email
    if (
        !isValid(
            e,
            "loginForm",
            loginHintViewer,
            "",
            isEmpty,
            "email",
            "برجاء ادخال البريد الالكترونى"
        )
    )
        return;
    if (
        !isValid(
            e,
            "loginForm",
            loginHintViewer,
            "not",
            validEmail,
            "email",
            "البريد الالكترونى غير صالح, مثال: example@gmail.com"
        )
    )
        return;
    // Validate Password
    if (
        !isValid(
            e,
            "loginForm",
            loginHintViewer,
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
            "loginForm",
            loginHintViewer,
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
            "loginForm",
            loginHintViewer,
            "not",
            haveSpecialChar,
            "password",
            "يجب ان تحتوى كلمة المرور على رموز, مثال: # $ & *"
        )
    )
        return;

    return true;
}
