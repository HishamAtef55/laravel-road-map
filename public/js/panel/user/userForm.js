// all elements that closes popup when clicked
const createUserForm = document.querySelector("#userForm");
const baseUrl = appRoot + "/cpanel-manager/admin/users/checkUserLogin";
const adminbaseUrl = appRoot + "/user/users/checkUserLogin";
const formId = "userForm";

const hintViewer = document.querySelector(`#${formId} .hint-viewer`);
let allUserFormInputs = document.querySelectorAll(
    `#${formId} input, #${formId} select, #${formId} textarea`
);

// show password handle
let ShowPasswordBtn = document.querySelector(`#${formId} .show-password`);
let ShowConfirmPasswordBtn = document.querySelector(
    `#${formId} .show-confirm-password`
);
let ShowPasswordBtns = [ShowPasswordBtn, ShowConfirmPasswordBtn];
ShowPasswordBtns.forEach(
    (btn) =>
        btn && btn.addEventListener("click", (e) => showPassword(e, formId))
);

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
const submitAddUser = document.querySelector(`#${formId} .submit-add`);
if (submitAddUser)
    submitAddUser.addEventListener("click", (e) => {
        if (!validate(e)) return;
        checkUserEmail(e);
        // if pass all validations send data
        hintViewer.innerText = "جار التحميل...";
    });

let changed = false;
const submitEditUser = document.querySelector(`#${formId} .submit-edit`);
if (submitEditUser)
    submitEditUser.addEventListener("click", (e) => {
        if (!changed) return e.preventDefault();
        if (!validate(e)) return;
        // if pass all validations send data
        hintViewer.innerText = "جار التحميل...";
    });
const checkUserEmail = async (e) => {
    e.preventDefault();
    let userEmail = document.querySelector(".email").value;
    if (adminAuth) {
        checkUserLogin(`${baseUrl}`, {
            email: userEmail,
        });
    } else {
        checkUserLogin(`${adminbaseUrl}`, {
            email: userEmail,
        });
    }
};
const checkUserLogin = async (Url = {}, data = {}) => {
    hintViewer.innerText = "جار التحميل...";

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
                hintViewer.innerText = "الأيميل مستخدم بالفعل ...";
                hintViewer.style.color = "red";
            } else {
                createUserForm.submit();
                hintViewer.innerText = "جار التحميل...";
            }
        });
    } catch (error) {
        console.log("error", error);
    }
};

allUserFormInputs.forEach((input) => {
    input.addEventListener("keydown", validate);
    input.addEventListener("keyup", validate);
    input.addEventListener("change", validate);
});

// used to check if password is written
function passwordIsWritten() {
    const passInput = document.querySelector(`#${formId} .password`);
    return passInput.value ? true : false;
}

function validate(e) {
    changed = true;
    if (submitEditUser) submitEditUser.classList.remove("disabled");
    // make all invalid to valid
    let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
    allInvalid.forEach((el) => el.classList.remove("invalid"));

    // Validate first name
    if (
        !isValid(
            e,
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
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
            formId,
            hintViewer,
            "",
            isEmpty,
            "gender",
            "برجاء اختيار الجنس"
        )
    )
        return;
    // Validate Password
    if (
        (formType === "add" || passwordIsWritten()) &&
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            isEmpty,
            "password",
            "برجاء ادخال كلمة المرور"
        )
    )
        return;
    if (
        (formType === "add" || passwordIsWritten()) &&
        !isValid(
            e,
            formId,
            hintViewer,
            "not",
            passwordLengthOk,
            "password",
            "يجب ان تتكون كلمة المرور من 8 الى 30 حرف"
        )
    )
        return;
    if (
        (formType === "add" || passwordIsWritten()) &&
        !isValid(
            e,
            formId,
            hintViewer,
            "not",
            haveSpecialChar,
            "password",
            "يجب ان تحتوى كلمة المرور على رموز, مثال: # $ & *"
        )
    )
        return;
    // Validate confirm Password
    if (
        (formType === "add" || passwordIsWritten()) &&
        !isValid(
            e,
            formId,
            hintViewer,
            "not",
            confirmPasswordMatch,
            "confirm_password",
            "كلمة المرور والتاكيد غير متطابقتين"
        )
    )
        return;
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            noPermissionChecked,
            "permission-checkbox",
            "برجاء اختيار على الاقل صلاحية واحدة"
        )
    )
        return;
    return true;
}

// handle permissions view
let roleSelect = document.querySelector(".role-select");
let permissionsList = document.querySelector(".permissions-list");
let permissionsLabel = document.querySelector(".permissions-label");
// all permissions checkboxs
let allPermissionCheckboxes = document.querySelectorAll(".permission-checkbox");
// control permissions checkboxs based on selected role
if (roleSelect) roleSelect.addEventListener("change", checkRolePermissions);

function checkRolePermissions() {
    let role = roleSelect.value;
    // if specialist role is selected hide permissions checkboxs
    if (role === "specialist") {
        if (permissionsList) permissionsList.classList.add("hide");
        if (permissionsLabel) permissionsLabel.classList.add("hide");
        allPermissionCheckboxes.forEach(
            (checkbox) => (checkbox.checked = false)
        );
        // if admin role is selected show permissions checkboxs
    } else {
        if (permissionsList) permissionsList.classList.remove("hide");
        if (permissionsLabel) permissionsLabel.classList.remove("hide");
    }
}
checkRolePermissions();
function noPermissionChecked() {
    let allPermissionCheckboxes = document.querySelectorAll(
        ".permission-checkbox"
    );
    let checkedCount = 0;
    allPermissionCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) checkedCount += 1;
    });
    let roleSelect = document.querySelector(".role-select");
    return checkedCount < 1 && roleSelect.value === "admin";
}
