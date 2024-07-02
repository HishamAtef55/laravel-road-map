// all elements that closes popup when clicked
const registerCloseBtn = document.querySelector(".register-popup .close-btn");
const registerCancelBtn = document.querySelector("#registerForm .cancel-btn");
const registerDarkBg = document.querySelector(".register-bg");
const registerForm = document.getElementById("registerForm");
const registerHintViewer = document.querySelector(".register-hint-viewer");
const registerPopup = document.querySelector(".register-popup");
const checkEmailRigister = appRegisterRoot + "/user/checkUserLogin";
let allRegisterInputs = document.querySelectorAll(
    "#registerForm input, #registerForm select, #registerForm textarea"
);
let registerCloseList = [registerCloseBtn, registerCancelBtn, registerDarkBg];
// loop over elements and close popup when clicked
registerCloseList.forEach((btn) => btn && btn.addEventListener("click", close));
// close popup using class
function close(e) {
    e.preventDefault();
    registerForm.reset();
    allRegisterInputs.forEach((input) => {
        input.classList.remove("invalid");
        input.classList.remove("valid");
    });
    registerHintViewer.innerText = "";
    if (registerPopup) registerPopup.classList.add("hide");
    if (registerDarkBg) registerDarkBg.classList.add("hide");
}

// show password handle
let registerShowPasswordBtn = document.querySelector(
    "#registerForm .show-password"
);
let registerShowConfirmPasswordBtn = document.querySelector(
    "#registerForm .show-confirm-password"
);
let registerShowPasswordBtns = [
    registerShowPasswordBtn,
    registerShowConfirmPasswordBtn,
];
registerShowPasswordBtns.forEach(
    (btn) =>
        btn &&
        btn.addEventListener("click", (e) => showPassword(e, "registerForm"))
);
// switch to login
let registerFormLoginBtn = document.querySelector(".register-form-login-btn");
if (registerFormLoginBtn)
    registerFormLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        registerPopup.classList.add("hide");
        registerDarkBg.classList.add("hide");

        if (loginDarkBg) loginDarkBg.classList.remove("hide");
        if (loginPopup) loginPopup.classList.remove("hide");
    });

// Profile Image handle
const profileImgBtn = document.querySelector("#profile_image");
const profileImgView = document.querySelector("#profileImgView");
profileImgBtn.addEventListener("change", (e) => {
    // when input file change show image in image viewer
    let files = e.target.files;
    let image = files[0] ? files[0] : null;
    if (profileImgView && image)
        profileImgView.src = URL.createObjectURL(image);
});

// Validation
const registerSubmitBtn = document.getElementById("registerSubmit");
if (registerSubmitBtn)
    registerSubmitBtn.addEventListener("click", (e) => {
        if (!validateRegister(e)) return;
        checkRegisterEmail(e);
        // if pass all validations send data
        registerHintViewer.innerText = "جار التحميل...";
    });
const checkRegisterEmail = async (e) => {
    e.preventDefault();
    let userEmail = document.querySelector(".register-email").value;

    checkUserEmailRegister(`${checkEmailRigister}`, {
        email: userEmail,
    });
};
const checkUserEmailRegister = async (Url = {}, data = {}) => {
    registerHintViewer.innerText = "جار التحميل...";

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
            if (res.success == true) {
                registerHintViewer.innerText = "الأيميل مسجل بالفعل ...";
                registerHintViewer.style.color = "red";
            } else {
                registerHintViewer.innerText = "جار التحميل...";
                registerForm.submit();
            }
        });
    } catch (error) {
        console.log("error", error);
    }
};
allRegisterInputs.forEach((input) => {
    input.addEventListener("keydown", validateRegister);
    input.addEventListener("keyup", validateRegister);
    input.addEventListener("change", validateRegister);
});
function validateRegister(e) {
    // make all invalid to valid
    let allInvalid = document.querySelectorAll("#registerForm .invalid");
    allInvalid.forEach((el) => el.classList.remove("invalid"));

    // Validate first name
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "",
            isEmpty,
            "first_name",
            "يرجى ادخال الاسم الاول"
        )
    )
        return;
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "not",
            nameLengthOk,
            "first_name",
            "يجب ان يتكون الاسم الاول من 2 الى 10 حروف"
        )
    )
        return;
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "",
            hasNumber,
            "first_name",
            "لا يمكن اضافة ارقام فى الاسم الاول"
        )
    )
        return;
    // Validate last name
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "",
            isEmpty,
            "last_name",
            "يرجى ادخال اسم العائلة"
        )
    )
        return;
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "not",
            nameLengthOk,
            "last_name",
            "يجب ان يتكون اسم العائلة من 2 الى 10 حروف"
        )
    )
        return;
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "",
            hasNumber,
            "last_name",
            "لا يمكن اضافة ارقام فى اسم العائلة"
        )
    )
        return;
    // Validate email
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "not",
            validEmail,
            "email",
            "البريد الالكترونى غير صالح, مثال: example@gmail.com"
        )
    )
        return;
    // Validate mobile
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "",
            isEmpty,
            "mobile",
            "برجاء ادخال رقم الموبايل"
        )
    )
        return;
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "not",
            isNumber,
            "mobile",
            "الموبايل يجب ان يكون ارقام فقط"
        )
    )
        return;
    // Validate birthday
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "",
            isEmpty,
            "birthday",
            "برجاء اختيار تاريخ الميلاد"
        )
    )
        return;
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "not",
            isAdult,
            "birthday",
            "العمر يجب ان يكون اكثر من 18 عام"
        )
    )
        return;
    // Validate gender
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
            "",
            isEmpty,
            "gender",
            "برجاء اختيار الجنس"
        )
    )
        return;
    // Validate Password
    if (
        !isValid(
            e,
            "registerForm",
            registerHintViewer,
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
            "registerForm",
            registerHintViewer,
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
            "registerForm",
            registerHintViewer,
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
            "registerForm",
            registerHintViewer,
            "not",
            confirmPasswordMatch,
            "confirm_password",
            "كلمة المرور والتاكيد غير متطابقتين"
        )
    )
        return;
    // Validate accept terms checkbox
    const acceptTermsInput = document.querySelector(".accept_terms");
    if (!acceptTermsInput.checked) {
        if (
            e.currentTarget.id === "submit" ||
            e.currentTarget.type === "submit"
        )
            e.preventDefault();
        registerHintViewer.innerText = "برجاء الموافقة على الشروط والاحكام";
        return;
    }
    return true;
}
