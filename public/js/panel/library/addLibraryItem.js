// all elements that closes popup when clicked

const libraryFormId = "addLibraryItemForm";

const libraryHintViewer = document.querySelector(`.library-hint-viewer`);
const fileSizeText = document.querySelector(".file-size-text");
const curntFileDetails = document.querySelector(".curnt-file-details");
const fileTypesSelect = document.querySelector(".file-types-select");
// activity type image handle
const libraryFileInput = document.querySelector(`.libraryFileInput`);
const filePreview = document.querySelector(`.file-preview`);
const activityTypeImgView = document.querySelector(`.activityTypeImagePreview`);
libraryFileInput.addEventListener("change", async (e) => {
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
// listen to change and submit
listenToInputsChange(libraryFormId, validateData);

fileTypes.forEach((fileType) => {
    if (fileTypesSelect)
        fileTypesSelect.innerHTML += `<option value="${fileType.key}" >${fileType.name} (${fileType.size} ميجا)</option>`;
});
updateFilePreview(fileTypes[0]);
if (fileTypesSelect)
    fileTypesSelect.addEventListener("change", (e) => {
        // get file type object
        let foundFileType = fileTypes.find(
            (type) => type.key === e.target.value
        );
        if (foundFileType) {
            // change input file accepted files
            libraryFileInput.accept = foundFileType.accpet;
            // remove file from input type file
            libraryFileInput.value = "";
            curntFileDetails.innerHTML = "";
        }
        updateFilePreview(foundFileType);
        validateData(e);
    });

function updateFilePreview(fileType, old, anotherSrc) {
    let src = old
        ? fileSrc
        : anotherSrc
        ? anotherSrc
        : assetRoot + "/images/default/defaultImg.png";
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
}

const allActivitiesCheckboxs = document.querySelectorAll(
    `#${libraryFormId} .activity-item input[type="checkbox"]:not(#all_activities)`
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
// start categories handle -------------------------------------------
const allCategoriesCheckboxs = document.querySelectorAll(
    `#${libraryFormId} .category-item input[type="checkbox"]`
);

// to detect how many activities selected
let allSelectedCategories = 0;

// check if all activities checkboxes are selected (if all selected make select all checkbox selected, and if not make it unselected)
allCategoriesCheckboxs.forEach((checkbox) => {
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
// end categories handle -------------------------------------------
// check if all activities checkboxes are selected (if all selected make select all checkbox selected, and if not make it unselected)
allActivitiesCheckboxs.forEach((checkbox) => {
    // when any checkbox changes
    checkbox.addEventListener("change", (e) => {
        allSelectedActivities = 0;
        // get how many checkboxs are checked
        allActivitiesCheckboxs.forEach((box) => {
            if (box.checked) allSelectedActivities += 1;
        });
        // if all checkboxes are selected make "select all" checkbox checked, else make it unselected
        if (allSelectedActivities === allActivitiesCheckboxs.length)
            allActivitiesCheckbox.checked = true;
        else allActivitiesCheckbox.checked = false;
        validateData(e);
    });
});

// Validation --------------------------------------------------------------
const submitAddLibraryBtn = document.querySelector(
    `#${libraryFormId} .submit-add`
);
const noCategoriesSelected = () => allSelectedCategories < 1;

if (submitAddLibraryBtn)
    submitAddLibraryBtn.addEventListener("click", async (e) => {
        if (libraryHintViewer.innerText) e.preventDefault();
        if (!(await validateData(e))) return;
        // if pass all validations send data
        libraryHintViewer.innerText = "جار التحميل...";
    });

let ageFitSelected = 0; // to detect how many ages selected
let ageFitCheckboxes = document.querySelectorAll(".age_fit");
// loop over age fit checkboxes (to detect how many selected ages)
ageFitCheckboxes.forEach((checkbox) =>
    // listen to change
    checkbox.addEventListener("change", (e) => {
        // reset selected count
        ageFitSelected = 0;
        // loop again and if checked increase selected count
        ageFitCheckboxes.forEach((box) => {
            if (box.checked) ageFitSelected += 1;
        });
        validateData(e);
    })
);
listenToInputsChange(libraryFormId, validateData); // listen to any input change to validate
// validation functions
const noAgeSelected = () => ageFitSelected < 1;
const fileUploaded = () =>
    document.querySelector(".libraryFileInput").files[0] ? true : false;
const noActivitiesSelected = () => allSelectedActivities < 1;

async function validateData(e) {
    // make all invalid to valid
    let allInvalid = document.querySelectorAll(`#${libraryFormId} .invalid`);
    allInvalid.forEach((el) => el.classList.remove("invalid"));
    // Validate name
    if (
        !isValid(
            e,
            libraryFormId,
            libraryHintViewer,
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
            libraryFormId,
            libraryHintViewer,
            "",
            noAgeSelected,
            "age_fit",
            "برجاء اختيار عمر او اكثر"
        )
    )
        return;
    // Validate file uploaded
    if (
        !isValid(
            e,
            libraryFormId,
            libraryHintViewer,
            "not",
            fileUploaded,
            "libraryFileInput",
            "برجاء اختيار ملف"
        )
    )
        return;
    if (
        !isValid(
            e,
            libraryFormId,
            libraryHintViewer,
            "not",
            fileSizeOk,
            "libraryFileInput",
            "حجم الملف كبير"
        )
    )
        return;
    if (
        !(await asyncIsValid(
            e,
            libraryFormId,
            libraryHintViewer,
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
            libraryFormId,
            libraryHintViewer,
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
            libraryFormId,
            libraryHintViewer,
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
            libraryFormId,
            libraryHintViewer,
            "",
            noCategoriesSelected,
            "category-item input[type='checkbox']",
            "برجاء اختيار تصنيف او اكثر"
        )
    )
        return;
    return true;
}
