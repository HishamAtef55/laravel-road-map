// all elements that closes popup when clicked

let formId = "submitReview";
let hintViewer = document.querySelector(`.hint-viewer`);
// listen to change and submit
listenToInputsChange(formId, validateData);

// Validation
const submitBtn = document.querySelector(`.submit`);
if (submitBtn)
    submitBtn.addEventListener("click", (e) => {
        if (!validateData(e)) return;
        // if pass all validations send data
        hintViewer.innerText = "جار التحميل...";
    });

const allActivitiesCheckboxs = document.querySelectorAll(
    `#${formId} .activity-item input[type="checkbox"]:not(#all_activities)`
);
const allActivitiesCheckbox = document.getElementById("all_activities");

// to detect how many activities selected
let allSelectedActivities = allActivitiesCheckboxs.length;

// select all or unselect all activities
// allActivitiesCheckbox.addEventListener("change", (e) => {
//     let active = e.target.checked;
//     if (!active) allSelectedActivities = 0;
//     else allSelectedActivities = allActivitiesCheckboxs.length;
//     // if select all check box is checked make all checked and if not make all unselected
//     allActivitiesCheckboxs.forEach((checkbox) => {
//         checkbox.checked = active;
//     });
//     validateData(e);
// });
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

const noActivitiesSelected = () => allSelectedActivities < 1;

function validateData(e) {
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
            "برجاء ادخال الاسم"
        )
    )
        return;
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "not",
            titleLengthOk,
            "name",
            "يجب ان يتكون الاسم من 2 الى 50 حرف"
        )
    )
        return;
    // Validate job
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            isEmpty,
            "job",
            "برجاء كتابة الوظيفة"
        )
    )
        return;
    // Validate email
    if (
        !isValid(
            e,
            formId,
            hintViewer,
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
    // validate description
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            isEmpty,
            "description",
            "برجاء كتابة التعليق"
        )
    )
        return;
    // validate rating
    if (
        !isValid(
            e,
            formId,
            hintViewer,
            "",
            isEmpty,
            "rating",
            "برجاء تحديد التقييم"
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
    return true;
}
// stars handle
let starsBtns = document.querySelectorAll(".star-btn");
starsBtns.forEach((btn) => {
    // get number of star
    let number = +btn.getAttribute("data-number");
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        starsBtns.forEach((star) => {
            // remove active class for every star
            star.classList.remove("active");
            // add active class for stars that have number less than selected number
            let startNumber = +star.getAttribute("data-number");
            if (number > startNumber) star.classList.add("active");
        });
        btn.classList.add("active");
        // add selected rating number in rating input to send to backend
        let ratingInput = document.querySelector(`#${formId} input.rating`);
        ratingInput.value = number;
        validateData(e);
    });
    // add hovered class for stars
    btn.addEventListener("mouseenter", (e) => {
        btn.classList.add("hovered");
        starsBtns.forEach((star) => {
            let startNumber = +star.getAttribute("data-number");
            if (number > startNumber) star.classList.add("hovered");
        });
    });
    // remove hovered class for stars
    btn.addEventListener("mouseleave", (e) => {
        btn.classList.remove("hovered");
        starsBtns.forEach((star) => {
            let startNumber = +star.getAttribute("data-number");
            if (number > startNumber) star.classList.remove("hovered");
        });
    });
});
