// get buttons to close popup when clicked
function closeFormPopupListen(buttons, formId, popupClass, popupBg) {
  if (buttons)
    buttons.forEach(btn => {
      let button = document.querySelector(btn);
      if (button) button.addEventListener("click", e => close(e, formId, popupClass, popupBg));
    });
}

// listen to all form inputs change
function listenToInputsChange(formId, validate) {
  let allInputs = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
  allInputs.forEach(input => {
    input.addEventListener("keydown", validate);
    input.addEventListener("keyup", validate);
    input.addEventListener("change", validate);
  });
}

function listenToSubmitBtn(formId, action) {
  // Validation
  const submitBtn = document.querySelector(`#${formId} .submit`);
  if (submitBtn) submitBtn.addEventListener("click", action);
}

// close popup when btn clicked
function close(e, formId, popupClass, popupBg) {
  let popup = document.querySelector(popupClass);
  let bg = document.querySelector(popupBg);
  e.preventDefault();
  let form = document.getElementById(formId);
  form.reset();
  let allInputs = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
  allInputs.forEach(input => {
    input.classList.remove("invalid");
    input.classList.remove("valid");
  });
  let hintViewer = document.querySelector(`#${formId} .hint-viewer`);
  if (hintViewer) hintViewer.innerText = "";

  if (popup) popup.classList.add("hide");
  if (bg) bg.classList.add("hide");
}
