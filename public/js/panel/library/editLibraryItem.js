// all elements that closes popup when clicked

let formId = "editLibraryItemForm";
let hintViewer = document.querySelector(`.hint-viewer`);
const fileSizeText = document.querySelector(".file-size-text");
const curntFileDetails = document.querySelector(".curnt-file-details");
// activity type image handle
const libraryFileInput = document.querySelector(`.libraryFileInput`);
const filePreview = document.querySelector(`.file-preview`);
const activityTypeImgView = document.querySelector(`.activityTypeImagePreview`);
const fileTypesSelect = document.querySelector(".file-types-select");
libraryFileInput.addEventListener("change", async (e) => {
    fileTypeChanged = true;
    // when input file change show image in image viewer
    // get file
    let file = e.target.files[0];
    // get file size in MB
    let size = file ? getFileSize(file) : "";
    // get file type
    let fileType = file ? detectFileType(file.name) : "";
    // get image size (width and height)
    let imgSize = fileType === "image" ? await getImageSize(file) : {};
    // size text
    let sizePreview =
        fileType === "image"
            ? `W:${imgSize.width}px - H:${imgSize.height}px -`
            : "";
    // file name text
    let fileName = file ? file.name : "";
    // update file details preview
    if (file)
        curntFileDetails.innerHTML = `${size}MB - ${sizePreview} '${fileName}'`;
    else curntFileDetails.innerHTML = "";
    // put image if file type image
    if (!file) return;
    fileSizeOk();
    let fileView = document.querySelector(`.file-preview .${fileType}`);
    if (fileType === "image")
        fileView.innerHTML = `<img src="${URL.createObjectURL(
            file
        )}" alt="Profile Picture" />`;
    // put video if file type video
    if (fileType === "video")
        fileView.innerHTML = `<video controls src="${URL.createObjectURL(
            file
        )}" />`;
    // put audio if file type audio
    if (fileType === "audio")
        fileView.innerHTML = `<audio controls src="${URL.createObjectURL(
            file
        )}" />`;
});
let changed = false;
let fileTypeChanged = false;
// listen to change and submit
listenToInputsChange(formId, validateData);

fileTypes.forEach((fileType) => {
    fileTypesSelect.innerHTML += `<option ${
        fileType.key === selectedFileType ? "selected" : ""
    } value="${fileType.key}" >${fileType.name} (${
        fileType.size
    } ميجا)</option>`;
});

fileTypesSelect.addEventListener("change", (e) => {
    fileTypeChanged = true;
    // get file type object
    let foundFileType = fileTypes.find((type) => type.key === e.target.value);
    if (foundFileType) {
        // change input file accepted files
        libraryFileInput.accept = foundFileType.accpet;
        // remove file from input type file
        libraryFileInput.value = "";
        curntFileDetails.innerHTML = "";
        // change file preview based on file type
        updateFilePreview(foundFileType);
    }
    validateData(e);
});
fileTypes.forEach((type) => {
    if (type.key === selectedFileType) updateFilePreview(type, true);
});

function updateFilePreview(fileType, old) {
    let src = old ? fileSrc : "../../../images/default/defaultImg.png";
    // change file preview based on file type
    // put image if file type image
    if (fileType.fileType === "image") {
        fileSizeText.innerText = `الحد الاقصى لحجم الصورة Width: (min ${fileType.imgSize.width.min}px max ${fileType.imgSize.width.max}px) - Height: (min ${fileType.imgSize.height.min}px max ${fileType.imgSize.height.max}px)  - ${fileType.size} MB`;

        filePreview.innerHTML = `
      <div class="image ${fileType.key}">
        <img src="${src}" alt="Profile Picture" />
      </div>
      `;
    }
    // put video if file type video
    if (fileType.fileType === "video") {
        fileSizeText.innerText = `الحد الاقصى لحجم الفيديو ${fileType.size} MB`;
        filePreview.innerHTML = `
      <div class="video ${fileType.key}">
        <video src="${src}" controls />
      </div>
      `;
    }
    // put audio if file type audio
    if (fileType.fileType === "audio") {
        fileSizeText.innerText = `الحد الاقصى لحجم الصوت ${fileType.size} MB`;
        filePreview.innerHTML = `
      <div class="audio ${fileType.key}">
        <audio src="${src}" controls />
      </div>
      `;
    }
    libraryFileInput.accept = fileType.accpet;
}

const allActivitiesCheckboxs = document.querySelectorAll(
    `#${formId} .activity-item input[type="checkbox"]:not(#all_activities)`
);
const allActivitiesCheckbox = document.getElementById("all_activities");

// to detect how many activities selected
let allSelectedActivities = allActivitiesCheckboxs.length;

// select all or unselect all activities
allActivitiesCheckbox.addEventListener("change", (e) => {
    let active = e.target.checked;
    if (!active) allSelectedActivities = 0;
    else allSelectedActivities = allActivitiesCheckboxs.length;
    // if select all check box is checked make all checked and if not make all unselected
    allActivitiesCheckboxs.forEach((checkbox) => {
        checkbox.checked = active;
    });
    validateData(e);
});
// check if all activities checkboxes are selected (if all selected make select all checkbox selected, and if not make it unselected)
allActivitiesCheckboxs.forEach((checkbox) => {
    // when any checkbox changes
    checkHowManyActivitiesSelected();
    checkbox.addEventListener("change", (e) => {
        checkHowManyActivitiesSelected();
        validateData(e);
    });
});
function checkHowManyActivitiesSelected() {
    allSelectedActivities = 0;
    // get how many checkboxs are checked
    allActivitiesCheckboxs.forEach((box) => {
        if (box.checked) allSelectedActivities += 1;
    });
    // if all checkboxes are selected make "select all" checkbox checked, else make it unselected
    if (allSelectedActivities === allActivitiesCheckboxs.length)
        allActivitiesCheckbox.checked = true;
    else allActivitiesCheckbox.checked = false;
}
// categories handle -------------------------------------------
const allCategoriesCheckboxs = document.querySelectorAll(
    `#${formId} .category-item input[type="checkbox"]`
);

// to detect how many activities selected
let allSelectedCategories = 0;

// check if all activities checkboxes are selected (if all selected make select all checkbox selected, and if not make it unselected)
allCategoriesCheckboxs.forEach((checkbox) => {
    if (checkbox.checked) allSelectedCategories += 1;
    // when any checkbox changes
    checkbox.addEventListener("change", (e) => {
        allSelectedCategories = 0;
        // get how many checkboxs are checked
        allCategoriesCheckboxs.forEach((box) => {
            if (box.checked) allSelectedCategories += 1;
        });
        // if all checkboxes are selected make "select all" checkbox checked, else make it unselected
        validateData(e);
    });
});
// Validation --------------------------------------------------------------
const submitEditBtn = document.querySelector(`#${formId} .submit-edit`);
if (submitEditBtn)
    submitEditBtn.addEventListener("click", async (e) => {
        if (!changed) return e.preventDefault();
        if (hintViewer.innerText) e.preventDefault();
        if (!(await validateData(e))) return;
        // if pass all validations send data
        hintViewer.innerText = "جار التحميل...";
    });

let ageFitSelected = 0; // to detect how many ages selected
let ageFitCheckboxes = document.querySelectorAll(".age_fit");
// loop over age fit checkboxes (to detect how many selected ages)
ageFitCheckboxes.forEach((checkbox) => {
    checkHowManyAgesSelected();
    // listen to change
    checkbox.addEventListener("change", (e) => {
        checkHowManyAgesSelected();
        validateData(e);
    });
});
function checkHowManyAgesSelected() {
    // reset selected count
    ageFitSelected = 0;
    // loop again and if checked increase selected count
    ageFitCheckboxes.forEach((box) => {
        if (box.checked) ageFitSelected += 1;
    });
}
listenToInputsChange(formId, validateData); // listen to any input change to validate
// validation functions
const noAgeSelected = () => ageFitSelected < 1;
const fileUploaded = () =>
    document.querySelector(".libraryFileInput").files[0] ? true : false;
const noActivitiesSelected = () => allSelectedActivities < 1;
const noCategoriesSelected = () => allSelectedCategories < 1;

async function validateData(e) {
    changed = true;
    if (submitEditBtn) submitEditBtn.classList.remove("disabled");
    // make all invalid to valid
    let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
    allInvalid.forEach((el) => el.classList.remove("invalid"));
    // Validate name
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            isEmpty,
            "name",
            "برجاء كتابة الاسم"
        )
    )
        return;
    // Validate age fit
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            noAgeSelected,
            "age_fit",
            "برجاء اختيار عمر او اكثر"
        )
    )
        return;
    // Validate file uploaded
    if (
        fileTypeChanged &&
        !isValid(
            e,
            formId,
            hintViewer,
            "not",
            fileUploaded,
            "libraryFileInput",
            "برجاء اختيار ملف"
        )
    )
        return;
    if (
        fileTypeChanged &&
        !isValid(
            e,
            formId,
            hintViewer,
            "not",
            fileSizeOk,
            "libraryFileInput",
            "حجم الملف كبير"
        )
    )
        return;
    if (
        fileTypeChanged &&
        !(await asyncIsValid(
            e,
            formId,
            hintViewer,
            "not",
            imgSizeOk,
            "libraryFileInput",
            "ابعاد الصورة غير مناسبة"
        ))
    )
        return;
    // Validate description
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            isEmpty,
            "description",
            "برجاء كتابة الوصف"
        )
    )
        return;
    // Validate activities
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            noActivitiesSelected,
            "activity-item input[type='checkbox']",
            "برجاء اختيار نشاط او اكثر"
        )
    )
        return;
    // Validate categories
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            noCategoriesSelected,
            "category-item input[type='checkbox']",
            "برجاء اختيار تصنيف او اكثر"
        )
    )
        return;
    return true;
}
