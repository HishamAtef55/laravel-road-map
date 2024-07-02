function getInputValue(formId, className) {
    let input = document.querySelector(`#${formId} .${className}`);
    return input ? input.value : "";
}

function putInputValue(formId, className, value) {
    let input = document.querySelector(
        `${formId ? `#${formId}` : ""} .${className}`
    );
    if (input) input.value = value;
    else console.log("input not found and cannot update it's value", className);
}
function getPixelNumber(string) {
    return +string.split("px").join("");
}

function getBoolean(text) {
    if (text === "true") return true;
    if (text === "false") return false;
}
function getOpenLibraryBtnFileSrc(formId, className, oldValue) {
    let openLibraryBtn = document.querySelector(`#${formId} .${className}`);

    let fileSrc = openLibraryBtn.getAttribute("data-file-src");
    let libraryId = openLibraryBtn.getAttribute("data-library-item-id");
    return libraryId
        ? fileSrc
        : formType === "add"
        ? "none"
        : oldValue
        ? oldValue
        : "none";
}
function fileNotSelected(formId, className) {
    let openLibraryBtn = document.querySelector(`#${formId} .${className}`);
    let id = openLibraryBtn.getAttribute("data-library-item-id");
    return id ? false : true;
}

function checkboxChecked(formId, className) {
    let checkbox = document.querySelector(
        `${formId ? `#${formId}` : ""} .${className}`
    );
    return checkbox.checked;
}
const reviewLink = "https://itqademactivities.com/review/";
