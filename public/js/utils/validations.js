const isEmpty = (text) => (!text ? true : false);
const isNumber = (number) => (isNaN(number) ? false : true);

function validEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

// username regular expression
const usernameRegex =
    /^(?=.{1,100}$)(?![_.])(?!.*[_.]{2})[a-zA-Z._]+(?<![_.])$/;

// Special Character
const haveSpecialChar = (str) =>
    /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str);

// check if string have only letters (arabic and english)
const isOnlyLetters = (string) => {
    return /^[A-Za-z\s]*$/.test(string) || /[\u0600-\u06FF]/.test(string);
};

// check if string has number
const hasNumber = (str) => {
    return /\d/.test(str);
};

// check if string has letter
const hasLetter = (str) => {
    return /^[A-Za-z]+$/.test(str);
};

const isDecimal = (number) => !Number.isInteger(+number);

const codeLengthOk = (number) => number <= 999;

// to check if string length is ok
const titleLengthOk = (name) => {
    return name.length >= 2 && name.length <= 50;
};

// to check if string length is ok
const nameLengthOk = (name) => {
    return name.length >= 2 && name.length <= 15;
};

// to check if string length is ok
const descriptionLengthOk = (description) => {
    return description.length <= 100;
};

// to check if password length is ok
const passwordLengthOk = (password) => {
    return password.length >= 8 && password.length <= 30;
};

function getAgeInYears(birthday) {
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

const isAdult = (birthday) => getAgeInYears(birthday) >= 18;

// check if confirm password matching password
const passwordSameAsOld = (password) => {
    let passwordInput = document.querySelector("input.old_password");
    return password === passwordInput.value;
};
let currentForm = "";
// check if confirm password matching password
const confirmPasswordMatch = (password) => {
    let passwordInput = document.querySelector(
        `${currentForm ? `#${currentForm}` : ""} input.password`
    );
    return password === passwordInput.value;
};

function showPassword(e, form) {
    e.preventDefault();
    let password = document.querySelector(
        `${form ? `#${form}` : ""} .password`
    );
    let confirmPassword = document.querySelector(
        `${form ? `#${form}` : ""} .confirm_password`
    );
    // password
    if (e.currentTarget.classList.contains("show-password")) {
        password.type = password.type === "password" ? "text" : "password";
    }

    // confirm password
    if (e.currentTarget.classList.contains("show-confirm-password")) {
        confirmPassword.type =
            confirmPassword.type === "password" ? "text" : "password";
    }
}

function isValid(e, form, hintViewer, not, condition, className, msg) {
    if (form) currentForm = form;
    let element = document.querySelector(
        `${form ? `#${form}` : ""} .${className}`
    );
    if (!element) return false;
    let pass = not ? !condition(element.value) : condition(element.value);
    if (pass) {
        if (hintViewer) hintViewer.innerText = msg; // show msg
        element.classList.remove("valid");
        element.classList.add("invalid");
        let target = e.currentTarget || e.target;
        let id = target.id;
        let type = target.type;
        if (id === "submit" || type === "submit") e.preventDefault();
        return false;
    } else {
        if (hintViewer) hintViewer.innerText = "";
        element.classList.remove("invalid");
        element.classList.add("valid");
        return true;
    }
}

async function asyncIsValid(
    e,
    form,
    hintViewer,
    not,
    condition,
    className,
    msg
) {
    if (form) currentForm = form;
    let element = document.querySelector(
        `${form ? `#${form}` : ""} .${className}`
    );
    if (!element) return false;
    let pass = not
        ? !(await condition(element.value))
        : await condition(element.value);
    if (pass) {
        if (hintViewer) hintViewer.innerText = msg; // show msg
        element.classList.remove("valid");
        element.classList.add("invalid");
        let target = e.currentTarget || e.target;
        let id = target.id;
        let type = target.type;
        if (id === "submit" || type === "submit") e.preventDefault();
        return false;
    } else {
        if (hintViewer) hintViewer.innerText = "";
        element.classList.remove("invalid");
        element.classList.add("valid");
        return true;
    }
}

const fontSizeOk = (number) => number >= 8 && number <= 100;
