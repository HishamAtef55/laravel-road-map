// all elements that closes popup when clicked

let formId = "addActivityTypeForm";
let hintViewer = document.querySelector(`.hint-viewer`);
// activity type image handle
const activityTypeImgBtn = document.querySelector(`.activityTypeImgBtn`);
const filePreview = document.querySelector(".file-preview")
const activityTypeImgView = document.querySelector(`.activityTypeImagePreview`);
activityTypeImgBtn.addEventListener("change", e => {
  // when input file change show image in image viewer
  let files = e.target.files[0];
  let image = files ? files : null;
  if (activityTypeImgView && image) activityTypeImgView.src = URL.createObjectURL(image);
});
// listen to change and submit
listenToInputsChange(formId, validateData);

// Validation
const submitBtn = document.querySelector(`.submit`);
if (submitBtn)
  submitBtn.addEventListener("click", e => {
    if (!validateData(e)) return;
    // if pass all validations send data
    hintViewer.innerText = "جار التحميل...";
  });

function validateData(e) {
  // make all invalid to valid
  let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
  allInvalid.forEach(el => el.classList.remove("invalid"));

  // Validate english name
  if (!isValid(e, formId, hintViewer, "", isEmpty, "name_en", "برجاء ادخال الاسم الانجليزى")) return;
  if (!isValid(e, formId, hintViewer, "not", titleLengthOk, "name_en", "يجب ان يتكون الاسم من 2 الى 50 حرف")) return;
  // Validate arabic name
  if (!isValid(e, formId, hintViewer, "", isEmpty, "name_ar", "برجاء ادخال الاسم العربى")) return;
  if (!isValid(e, formId, hintViewer, "not", titleLengthOk, "name_ar", "يجب ان يتكون الاسم من 2 الى 50 حرف")) return;
  // validate code
  if (!isValid(e, formId, hintViewer, "", isEmpty, "code", "برجاء ادخال الكود")) return;
  // if (!isValid(e, formId, hintViewer, "", isDecimal, "code", "الكود يجب ان يكون رقم صحيح, مثال: 123")) return;
  // if (!isValid(e, formId, hintViewer, "not", codeLengthOk, "code", "الكود يجب ان لا يزيد عن 999")) return;
  // validate description
  if (!isValid(e, formId, hintViewer, "", isEmpty, "description", "برجاء ادخال الوصف")) return;
  return true;
}
