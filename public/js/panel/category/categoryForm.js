// all elements that closes popup when clicked
const formId = "categoryForm";
const hintViewer = document.querySelector(`#${formId} .hint-viewer`);
let allFormInputs = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);

// Validation
const submitAddCategory = document.querySelector(`#${formId} .submit-add`);
if (submitAddCategory)
  submitAddCategory.addEventListener("click", e => {
    if (!validate(e)) return;
    // if pass all validations send data
    hintViewer.innerText = "جار التحميل...";
  });
let changed = false;
const submitEditCategory = document.querySelector(`#${formId} .submit-edit`);
if (submitEditCategory)
  submitEditCategory.addEventListener("click", e => {
    if (!changed) return e.preventDefault();
    if (!validate(e)) return;
    // if pass all validations send data
    hintViewer.innerText = "جار التحميل...";
  });

allFormInputs.forEach(input => {
  input.addEventListener("keydown", validate);
  input.addEventListener("keyup", validate);
  input.addEventListener("change", validate);
});

function validate(e) {
  changed = true;
  if (submitEditCategory) submitEditCategory.classList.remove("disabled");
  // make all invalid to valid
  let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
  allInvalid.forEach(el => el.classList.remove("invalid"));

  // Validate name
  if (!isValid(e, formId, hintViewer, "", isEmpty, "name", "يرجى ادخال الاسم")) return;
  if (!isValid(e, formId, hintViewer, "not", nameLengthOk, "name", "يجب ان يتكون الاسم من 2 الى 10 حروف")) return;
  if (!isValid(e, formId, hintViewer, "", hasNumber, "name", "لا يمكن اضافة ارقام فى الاسم")) return;

  return true;
}
