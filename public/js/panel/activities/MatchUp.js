const instructionDescriptionsList = document.querySelector(".instruction-descriptions-list");
let formId = "MatchUpForm";
let hintViewer = document.querySelector(`#${formId} .hint-viewer`);
let changed = false;

function handleInstructionDescriptions() {
  instructionDescriptionsList.innerHTML = "";
  instructionDescriptions.forEach((desc, index) => {
    let number = index + 1;
    instructionDescriptionsList.innerHTML += `
    <div class="item">
      <input value="${desc}" id="instruction_description${number}" class="instruction_description instruction_description${number}" type="text" data-name="instruction_description${number}" />
      <button class="main-btn circle add-instruction-description"><i class="fa-solid fa-plus"></i></button>
    </div>
    `;
  });
  let allInstDescInputs = document.querySelectorAll(".instruction_description");
  allInstDescInputs.forEach((input, index) => {
    input.addEventListener("change", e => (instructionDescriptions[index] = input.value));
  });

  let addInstructionDescriptionBtns = document.querySelectorAll(".add-instruction-description");
  addInstructionDescriptionBtns.forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      if (instructionDescriptions.length >= 5) return;
      instructionDescriptions.push("");
      handleInstructionDescriptions();
    })
  );
  listenToInputs();
}
handleInstructionDescriptions();

let selectFont = document.querySelectorAll(".select-font");

fonts.forEach(font => {
  selectFont.forEach(select => (select.innerHTML += `<option style="font-family: ${font}" value=${font} >${font}</option>`));
});

function listenToInputs() {
  let allInputs = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
  allInputs.forEach(input => {
    input.addEventListener("keydown", validate);
    input.addEventListener("keyup", validate);
    input.addEventListener("change", validate);
  });
}

let submitAddBtn = document.querySelector(".add-activity-submit");
if (submitAddBtn)
  submitAddBtn.addEventListener("click", e => {
    // e.preventDefault();
    if (!changed && formType === "edit") return e.preventDefault();
    if (!validate(e)) return e.preventDefault();
    let dataInput = document.querySelector(".data-input");
    let settingsInput = document.querySelector(".settings-input");
    let filesInput = document.querySelector(".files-input");
    let filesPaths = [];
    let data = gamedata;
    let settings = formType === "add" ? JSON.parse(JSON.stringify(game_ui)) : oldActivitySettings;
    // put settings data from inputs -----------------------------------------------
    // main section
    settings.language.type = getInputValue(formId, "language_type");
    settings.game_screen.settimer.timeval = +getInputValue(formId, "timeval");
    settings.game_screen.settimer.count = getInputValue(formId, "timer_type");
    let livesEnabled = getBoolean(getInputValue(formId, "lives_enable"));
    settings.game_screen.lives.enable = livesEnabled;
    settings.game_screen.lives.number = +getInputValue(formId, "lives");
    // Instruction section
    settings.instruction_screen.titleUI.titleText = getInputValue(formId, "game_title");
    settings.instruction_screen.titleUI.fontSize = `${getInputValue(formId, "instruction_font_size")}px`;
    settings.instruction_screen.titleUI.color = getInputValue(formId, "instruction_text_color");

    settings.instruction_screen.agegrp.titleText = getInputValue(formId, "age_fit");
    settings.instruction_screen.agegrp.fontSize = `${getInputValue(formId, "instruction_font_size")}px`;
    settings.instruction_screen.agegrp.color = getInputValue(formId, "instruction_text_color");

    settings.instruction_screen.descriptionUI.titleText = getInputValue(formId, "game_description");
    settings.instruction_screen.descriptionUI.fontSize = `${getInputValue(formId, "instruction_font_size")}px`;
    settings.instruction_screen.descriptionUI.color = getInputValue(formId, "instruction_text_color");

    settings.instruction_screen.objUI.titleText = getInputValue(formId, "instruction_title");
    settings.instruction_screen.objUI.fontSize = `${getInputValue(formId, "instruction_font_size")}px`;
    settings.instruction_screen.objUI.color = getInputValue(formId, "instruction_text_color");

    let instDesc1 = getInputValue(formId, "instruction_description1");
    let instDesc2 = getInputValue(formId, "instruction_description2");
    let instDesc3 = getInputValue(formId, "instruction_description3");
    let instDesc4 = getInputValue(formId, "instruction_description4");
    let instDesc5 = getInputValue(formId, "instruction_description5");
    let instDescriptions = [instDesc1, instDesc2, instDesc3, instDesc4, instDesc5];
    settings.instruction_screen.objelms = `<ul>${instDescriptions.map(desc => (desc ? `<li>${desc}</li>` : "")).join("")}</ul>`;

    settings.instruction_screen.backgroundColor = getInputValue(formId, "instruction_background_color");
    if (!checkboxChecked(formId, "instruction_background_default")) {
      settings.instruction_screen.backgroundImage = getOpenLibraryBtnFileSrc(formId, "instruction_background", settings.instruction_screen.backgroundImage);
    }

    // intro video section
    settings.intro_vedio.display = getBoolean(getInputValue(formId, "intro_active"));
    settings.intro_vedio.src = getOpenLibraryBtnFileSrc(formId, "intro_video", settings.intro_vedio.src);
    // start section
    settings.start_screen.titleUI.titleText = getInputValue(formId, "start_title");
    settings.start_screen.titleUI.fontSize = `${getInputValue(formId, "start_font_size")}px`;
    settings.start_screen.titleUI.color = getInputValue(formId, "start_text_color");

    settings.start_screen.instructionUI.titleText = getInputValue(formId, "start_description");
    settings.start_screen.instructionUI.fontSize = `${getInputValue(formId, "start_description_font_size")}px`;
    settings.start_screen.instructionUI.color = getInputValue(formId, "start_text_color");
    // start button place (top, center, bottom)
    let startBtnPlace = getInputValue(formId, "start_button_place");
    if (startBtnPlace === "top") {
      settings.start_screen.titleUI.top = "400px";
      settings.start_screen.instructionUI.top = "574px";
      settings.start_screen.startButtonUI.top = "100px";
    }
    if (startBtnPlace === "center") {
      settings.start_screen.titleUI.top = "164px";
      settings.start_screen.instructionUI.top = "574px";
      settings.start_screen.startButtonUI.top = "278px";
    }
    if (startBtnPlace === "bottom") {
      settings.start_screen.titleUI.top = "164px";
      settings.start_screen.instructionUI.top = "320px";
      settings.start_screen.startButtonUI.top = "400px";
    }

    settings.start_screen.backgroundColor = getInputValue(formId, "start_background_color");
    if (!checkboxChecked(formId, "start_background_default")) {
      settings.start_screen.backgroundImage = getOpenLibraryBtnFileSrc(formId, "start_background", settings.start_screen.backgroundImage);
    }
    settings.start_screen.startButtonUI.backgroundImage = getOpenLibraryBtnFileSrc(formId, "start_button", settings.start_screen.startButtonUI.backgroundImage);
    // game section
    settings.game_screen.backgroundColor = getInputValue(formId, "game_background_color");

    if (!checkboxChecked(formId, "game_background_default")) {
      settings.game_screen.backgroundImage = getOpenLibraryBtnFileSrc(formId, "game_background", settings.game_screen.backgroundImage);
    }
    // correct, wrong section
    settings.game_screen.tryagainUI.soundEffect = getOpenLibraryBtnFileSrc(formId, "wrong_answer_sound", settings.game_screen.tryagainUI.soundEffect);
    settings.game_screen.tryagainUI.backgroundImage = getOpenLibraryBtnFileSrc(formId, "wrong_answer_background", settings.game_screen.tryagainUI.backgroundImage);

    settings.game_screen.correctfeedbackUI.soundEffect = getOpenLibraryBtnFileSrc(formId, "correct_answer_sound", settings.game_screen.correctfeedbackUI.soundEffect);
    settings.game_screen.correctfeedbackUI.backgroundImage = getOpenLibraryBtnFileSrc(formId, "correct_answer_background", settings.game_screen.correctfeedbackUI.backgroundImage);

    settings.game_screen.resultpage.minumum = +getInputValue(formId, "success_rate");
    settings.game_screen.resultpage.goodeffect = getOpenLibraryBtnFileSrc(formId, "success_image", settings.game_screen.resultpage.goodeffect);
    settings.game_screen.resultpage.goodaudio = getOpenLibraryBtnFileSrc(formId, "success_sound", settings.game_screen.resultpage.goodaudio);
    settings.game_screen.resultpage.goodvideo = getOpenLibraryBtnFileSrc(formId, "success_video", settings.game_screen.resultpage.goodvideo);

    settings.game_screen.resultpage.badeffect = getOpenLibraryBtnFileSrc(formId, "fail_image", settings.game_screen.resultpage.badeffect);
    settings.game_screen.resultpage.badaudio = getOpenLibraryBtnFileSrc(formId, "fail_sound", settings.game_screen.resultpage.badaudio);
    settings.game_screen.resultpage.badvideo = getOpenLibraryBtnFileSrc(formId, "fail_video", settings.game_screen.resultpage.badvideo);
    // confirm btn style
    settings.game_screen.submitUI.titleText = getInputValue(formId, "confirm_btn_text");
    settings.game_screen.submitUI.fontSize = `${getInputValue(formId, "confirm_btn_font_size")}px`;
    settings.game_screen.submitUI.color = getInputValue(formId, "confirm_btn_text_color");
    settings.game_screen.submitUI.backgroundColor = getInputValue(formId, "confirm_btn_background_color");
    settings.game_screen.submitUI.backgroundImage = getOpenLibraryBtnFileSrc(formId, "confirm_btn_background_image", settings.game_screen.submitUI.backgroundImage);
    // drag style
    settings.game_screen.DragTxtUI.fontweight = getInputValue(formId, "drag_font_weight");
    settings.game_screen.DragTxtUI.fontSize = `${getInputValue(formId, "drag_font_size")}px`;
    settings.game_screen.DragTxtUI.color = getInputValue(formId, "drag_text_color");
    // drop style
    settings.game_screen.DropTxtUI.fontweight = getInputValue(formId, "drop_font_weight");
    settings.game_screen.DropTxtUI.fontSize = `${getInputValue(formId, "drop_font_size")}px`;
    settings.game_screen.DropTxtUI.color = getInputValue(formId, "drop_text_color");
    settings.game_screen.DropTxtUI.backgroundColor = getInputValue(formId, "drop_background_color");
    // handle review link and activity code
    if (formType === "add") {
      let activityCode = getRandomNum();
      let finalReviewLink = `${reviewLink}${activityCode}`;
      settings.game_screen.reviewlink.link = finalReviewLink;
      settings.code = activityCode;
      document.querySelector(`#${formId} input.code`).value = activityCode;
    }

    // put settings object in settings input value to send to backend

    let allOpenLibraryBtns = document.querySelectorAll(`#${formId} .library-open-btn`);
    allOpenLibraryBtns.forEach(btn => {
      let library_item_id = btn.getAttribute("data-library-item-id");
      let game_file_path = btn.getAttribute("data-file-src");
      if (!library_item_id) return;

      let defaultCheckbox = document.querySelector(`.${btn.getAttribute("data-checkbox")}`);
      if (defaultCheckbox && defaultCheckbox.checked) return;
      filesPaths.push({ library_item_id, game_file_path });
    });
    data = newGameData;

    console.log("File Paths: ", filesPaths);
    console.log("Settings: ", settings);
    console.log("Data: ", data);

    settingsInput.value = JSON.stringify(settings);
    filesInput.value = JSON.stringify(filesPaths);
    dataInput.value = JSON.stringify(data);
  });

let submitEditBtn = document.querySelector(".edit-activity-submit");
if (submitEditBtn)
  submitEditBtn.addEventListener("click", e => {
    validate(e);
  });
// validation functions
const livesLimitReached = number => number > 5;
const livesIsZero = number => number <= 0;
const timerIsOk = number => number >= 15;

const descIsValid = description => description.length <= 200 && description.length > 0;
const titleIsValid = description => description.length <= 40 && description.length > 0;

const successRateOk = () => {
  let successRate = document.querySelector(`#${formId} .success_rate`);
  let rate = +successRate.value;
  return rate >= 10 && rate <= 100;
};

const introVideoNotSelected = () => getBoolean(getInputValue(formId, "intro_active")) && fileNotSelected(formId, "intro_video") && formType === "add";
const gameDataIsValid = e => {
  let valid = true;
  dragdrop.forEach((dragdrop, index) => {
    if (!valid) return;
    const getItemTextElement = type => document.querySelector(`.dragdrop .dragdrop-question-text[data-dragdrop-index="${index}"][data-field="${type}"]`);
    let dragtxtInput = getItemTextElement("dragtxt");
    let droptxtInput = getItemTextElement("droptxt");
    let number = index + 1;

    if (!dragdrop.dragtxt && !dragdrop.dragimg) {
      valid = false;
      dragtxtInput.classList.add("invalid");
      dragtxtInput.classList.remove("valid");
      hintViewer.innerText = `برجاء كتابة نص العنصر  ${number} او اختيار صورة`;
    } else if (dragdrop.dragtxt && dragdrop.dragtxt.length > 30) {
      valid = false;
      dragtxtInput.classList.add("invalid");
      dragtxtInput.classList.remove("valid");
      hintViewer.innerText = `الحد الاقصى لطول النص هو 30 فى العنصر ${number}`;
    } else if (!dragdrop.droptxt && !dragdrop.dropimg) {
      valid = false;
      droptxtInput.classList.add("invalid");
      droptxtInput.classList.remove("valid");
      dragtxtInput.classList.remove("invalid");
      dragtxtInput.classList.add("valid");
      hintViewer.innerText = `برجاء كتابة نص العنصر  ${number} او اختيار صورة`;
    } else if (dragdrop.droptxt && dragdrop.droptxt.length > 30) {
      valid = false;
      droptxtInput.classList.add("invalid");
      droptxtInput.classList.remove("valid");
      dragtxtInput.classList.remove("invalid");
      dragtxtInput.classList.add("valid");
      hintViewer.innerText = `الحد الاقصى لطول النص هو 30 فى العنصر ${number}`;
    } else {
      dragtxtInput.classList.remove("invalid");
      dragtxtInput.classList.add("valid");
      droptxtInput.classList.remove("invalid");
      droptxtInput.classList.add("valid");
      hintViewer.innerText = "";
    }
  });
  return valid;
};

function validate(e) {
  // make all invalid to valid
  let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
  allInvalid.forEach(el => el.classList.remove("invalid"));
  function isItValid(not, condition, className, msg) {
    return isValid(e, formId, hintViewer, not, condition, className, msg);
  }
  changed = true;
  submitAddBtn.classList.remove("disabled");

  // Validate game title
  if (!isItValid("", isEmpty, "game_title", "برجاء ادخال عنوان اللعبة")) return;
  if (!isItValid("not", titleIsValid, "game_title", " عنوان اللعبة يجب ان لا تزيد عن 40 حرف")) return;
  // Validate timeval
  if (!isItValid("", isEmpty, "timeval", "برجاء ادخال الوقت")) return;
  if (!isItValid("not", timerIsOk, "timeval", "الوقت يجب ان لا يقل عن 15 ثانية")) return;
  // Validate game description
  if (!isItValid("", isEmpty, "game_description", "برجاء ادخال تفاصيل النشاط")) return;
  if (!isItValid("not", descIsValid, "game_description", "تفاصيل النشاط يجب ان لا تزيد عن 200 حرف")) return;
  // Validate age fit
  if (!isItValid("", isEmpty, "age_fit", "برجاء ادخال العمر")) return;
  // validate lives
  if (!isItValid("", isEmpty, "lives", "برجاء ادخال عدد مرت الخطأ")) return;
  if (!isItValid("", livesLimitReached, "lives", "الحد الاقصى لعدد مرات الخطأ 5")) return;
  if (!isItValid("", livesIsZero, "lives", "يجب تحديد عدد مرات الخطأ")) return;
  // Validate instruction title
  if (!isItValid("", isEmpty, "instruction_title", "برجاء ادخال عنوان التعليمات")) return;
  if (!isItValid("not", titleIsValid, "instruction_title", " عنوان التعليمات يجب ان لا تزيد عن 40 حرف")) return;
  // Validate instruction font size
  if (!isItValid("", isEmpty, "instruction_font_size", "برجاء ادخال حجم خط التعليمات")) return;
  if (!isItValid("not", fontSizeOk, "instruction_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;

  // Validate instruction description
  if (instructionDescriptions[0] === "" && !isItValid("", isEmpty, "instruction_description1", "1 برجاء ادخال وصف التعليمات")) return;
  if (instructionDescriptions[1] === "" && !isItValid("", isEmpty, "instruction_description2", "2 برجاء ادخال وصف التعليمات")) return;
  if (instructionDescriptions[2] === "" && !isItValid("", isEmpty, "instruction_description3", "3 برجاء ادخال وصف التعليمات")) return;
  if (instructionDescriptions[3] === "" && !isItValid("", isEmpty, "instruction_description4", "4 برجاء ادخال وصف التعليمات")) return;
  if (instructionDescriptions[4] === "" && !isItValid("", isEmpty, "instruction_description5", "5 برجاء ادخال وصف التعليمات")) return;
  // validate intro video
  if (!isItValid("", () => introVideoNotSelected(), "intro_video", "برجاء رفع فيديو المقدمة او الغاء تفعيله")) return;
  // validate start title
  if (!isItValid("", isEmpty, "start_title", "برجاء ادخال عنوان الصفحة")) return;
  if (!isItValid("not", titleIsValid, "start_title", " عنوان البداية يجب ان لا تزيد عن 40 حرف")) return;
  // Validate start font size
  if (!isItValid("", isEmpty, "start_font_size", "برجاء ادخال حجم خط شريحة البداية")) return;
  if (!isItValid("not", fontSizeOk, "start_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;
  // validate start button
  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "start_button"), "start_button", "برجاء اختيار ايقون البداية")) return;
  // validate start description
  if (!isItValid("", isEmpty, "start_description", "برجاء ادخال ملاحظات البداية")) return;
  if (!isItValid("not", descIsValid, "start_description", "ملاحظات البداية يجب ان لا تزيد عن 200 حرف")) return;
  if (!isItValid("not", fontSizeOk, "start_description_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;

  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "correct_answer_background"), "correct_answer_background", "برجاء اختيار صورة الاجابة الصحيحة")) return;
  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "correct_answer_sound"), "correct_answer_sound", "برجاء اختيار صوت الاجابة الصحيحة")) return;

  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "wrong_answer_background"), "wrong_answer_background", "برجاء اختيار صورة الاجابة الخاظئة")) return;
  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "wrong_answer_sound"), "wrong_answer_sound", "برجاء اختيار  صوت الاجابة الخاظئة")) return;

  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "success_image"), "success_image", "برجاء اختيار صورة النجاح")) return;
  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "success_sound"), "success_sound", "برجاء اختيار صوت النجاح")) return;
  // validate success rate
  if (!isItValid("", isEmpty, "success_rate", "برجاء تحديد نسبة النجاح")) return;
  if (!isItValid("not", successRateOk, "success_rate", "نسبة النجاح يجب ان تكون بين %10 و %100")) return;

  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "fail_image"), "fail_image", "برجاء اختيار صورة الرسوب")) return;
  if (formType === "add" && !isItValid("", () => fileNotSelected(formId, "fail_sound"), "fail_sound", "برجاء اختيار صوت الرسوب")) return;

  if (!isItValid("", isEmpty, "confirm_btn_text", "برجاء ادخال نص زر التاكيد")) return;
  if (!isItValid("not", () => document.querySelector(".confirm_btn_text").value.length <= 20, "confirm_btn_text", " نص زر التاكيد يجب ان لا يزيد عن 20 احرف")) return;

  if (!isItValid("not", fontSizeOk, "confirm_btn_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;
  if (!isItValid("not", fontSizeOk, "drag_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;
  if (!isItValid("not", fontSizeOk, "drop_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;

  if (!gameDataIsValid(e)) return;
  return true;
}

// put inputs values in edit form
if (formType === "edit") {
  // main data
  putInputValue(formId, "game_title", oldActivitySettings.instruction_screen.titleUI.titleText);
  putInputValue(formId, "timer_type", oldActivitySettings.game_screen.settimer.count);
  putInputValue(formId, "timeval", oldActivitySettings.game_screen.settimer.timeval);
  putInputValue(formId, "game_description", oldActivitySettings.instruction_screen.descriptionUI.titleText);

  putInputValue(formId, "language_type", oldActivitySettings.language.type);
  putInputValue(formId, "age_fit", oldActivitySettings.instruction_screen.agegrp.titleText);
  putInputValue(formId, "lives_enable", oldActivitySettings.game_screen.lives.enable);
  putInputValue(formId, "lives", oldActivitySettings.game_screen.lives.number);
  // instruction section data
  putInputValue(formId, "instruction_title", oldActivitySettings.instruction_screen.objUI.titleText);
  putInputValue(formId, "instruction_font_size", getPixelNumber(oldActivitySettings.instruction_screen.objUI.fontSize));
  putInputValue(formId, "instruction_text_color", oldActivitySettings.instruction_screen.titleUI.color);
  putInputValue(formId, "instruction_background_color", oldActivitySettings.instruction_screen.backgroundColor);
  // instruction descriptions
  let descriptionElement = document.createElement("div");
  descriptionElement.innerHTML = oldActivitySettings.instruction_screen.objelms;
  instructionDescriptions = [];
  [...descriptionElement.children[0].children].forEach(li => instructionDescriptions.push(li.innerText));
  handleInstructionDescriptions();
  // intro video data
  putInputValue(formId, "intro_active", oldActivitySettings.intro_vedio.display);
  // start section data
  putInputValue(formId, "start_title", oldActivitySettings.start_screen.titleUI.titleText);
  putInputValue(formId, "start_font_size", getPixelNumber(oldActivitySettings.start_screen.titleUI.fontSize));
  putInputValue(formId, "start_text_color", oldActivitySettings.start_screen.titleUI.color);
  putInputValue(formId, "start_background_color", oldActivitySettings.start_screen.backgroundColor);
  putInputValue(formId, "start_description", oldActivitySettings.start_screen.instructionUI.titleText);
  putInputValue(formId, "start_description_font_size", getPixelNumber(oldActivitySettings.start_screen.instructionUI.fontSize));

  // handle start button position
  let buttonPixel = oldActivitySettings.start_screen.startButtonUI.top;
  let startBtnPosition = "";
  if (buttonPixel === "100px") startBtnPosition = "top";
  if (buttonPixel === "278px") startBtnPosition = "center";
  if (buttonPixel === "400px") startBtnPosition = "bottom";
  if (!startBtnPosition) startBtnPosition = "top";
  putInputValue(formId, "start_button_place", startBtnPosition);
  // game data
  putInputValue(formId, "game_background_color", oldActivitySettings.game_screen.backgroundColor);
  putInputValue(formId, "success_rate", oldActivitySettings.game_screen.resultpage.minumum);

  putInputValue(formId, "confirm_btn_text", oldActivitySettings.game_screen.submitUI.titleText);
  putInputValue(formId, "confirm_btn_font_size", getPixelNumber(oldActivitySettings.game_screen.submitUI.fontSize));
  putInputValue(formId, "confirm_btn_text_color", oldActivitySettings.game_screen.submitUI.color);
  putInputValue(formId, "confirm_btn_background_color", oldActivitySettings.game_screen.submitUI.backgroundColor);

  putInputValue(formId, "drag_font_weight", oldActivitySettings.game_screen.DragTxtUI.fontweight);
  putInputValue(formId, "drag_font_size", getPixelNumber(oldActivitySettings.game_screen.DragTxtUI.fontSize));
  putInputValue(formId, "drag_text_color", oldActivitySettings.game_screen.DragTxtUI.color);

  putInputValue(formId, "drop_font_weight", oldActivitySettings.game_screen.DropTxtUI.fontweight);
  putInputValue(formId, "drop_font_size", getPixelNumber(oldActivitySettings.game_screen.DropTxtUI.fontSize));
  putInputValue(formId, "drop_text_color", oldActivitySettings.game_screen.DropTxtUI.color);
  putInputValue(formId, "drop_background_color", oldActivitySettings.game_screen.DropTxtUI.backgroundColor);
}

// game data handle -------------------------------
let dragdropList = document.querySelector(`#${formId} .matchup-dragdrop-list`);
const basicDragdrop = () => ({ id: "", dragtxt: "", dragimg: "", droptxt: "", dropimg: "" });
const minDragdrops = 2;
const maxDragdrops = 12;

let dragdrop = newGameData.dragdrop;

const hanldeDragdropIds = () => dragdrop.forEach((item, index) => (item.id = `a${index + 1}`));

function putDragdrops() {
  hanldeDragdropIds();
  let reachedMaxDragdrops = dragdrop.length >= maxDragdrops;
  reachedMaxDragdrops = reachedMaxDragdrops ? "disabled" : "";
  let reachedMinDragdrops = dragdrop.length <= minDragdrops;
  reachedMinDragdrops = reachedMinDragdrops ? "disabled" : "";

  dragdropList.innerHTML = "";
  dragdropList.innerHTML += `
  <div>
    <button class="main-btn green ${reachedMaxDragdrops} add-dragdrop-btn">اضافة عنصر <i class="fa-solid fa-plus"></i></button>
  </div>
  `;
  dragdrop.forEach((dragdrop, index) => {
    let number = index + 1;

    let haveDragImg = dragdrop.dragimg;
    let haveDropImg = dragdrop.dropimg;

    let haveDragImgColor = haveDragImg ? "green" : "";
    let haveDropImgColor = haveDropImg ? "green" : "";

    let dragLibraryItemId = dragdrop.dragLibraryItemId;
    let dropLibraryItemId = dragdrop.dropLibraryItemId;

    let haveDragLibraryId = dragLibraryItemId ? `data-library-item-id="${dragLibraryItemId}"` : "";
    let haveDropLibraryId = dropLibraryItemId ? `data-library-item-id="${dropLibraryItemId}"` : "";

    dragdropList.innerHTML += `
    <div class="dragdrop">
      <div class="input-group">
        <label for="">العنصر ${number}</label>
        <div class="inputs line">
          <input placeholder="السحب" data-field="dragtxt" data-dragdrop-index="${index}" value="${dragdrop.dragtxt}" type="text" class="dragdrop-question-text" />
          <div class="input">
            <div class="buttons">
              <button data-field="dragimg" ${haveDragLibraryId} data-dragdrop-index="${index}" title="اضافة صورة السؤال" class="main-btn circle ${haveDragImgColor} library-open-btn" data-file-type="image" data-file-src="Assets/Data/images/drag-${number}"><i class="fa-solid fa-image"></i></button>
            </div>
          </div>
          <input placeholder="الاسقاط" data-field="droptxt" data-dragdrop-index="${index}" value="${dragdrop.droptxt}" type="text" class="dragdrop-question-text" />
          <div class="input">
            <div class="buttons">
              <button data-field="dropimg" ${haveDropLibraryId} data-dragdrop-index="${index}" title="اضافة صورة السؤال" class="main-btn circle ${haveDropImgColor} library-open-btn" data-file-type="image" data-file-src="Assets/Data/images/drop-${number}"><i class="fa-solid fa-image"></i></button>
              <button data-dragdrop-index="${index}" title="حذف المرحلة" class="main-btn circle red ${reachedMinDragdrops} remove-dragdrop-btn"><i class="fa-solid fa-trash" ></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  });
  // listen to add dragdrop btn
  let addDragdropBtn = document.querySelector(".add-dragdrop-btn");
  addDragdropBtn.addEventListener("click", e => {
    e.preventDefault();
    if (dragdrop.length >= maxDragdrops) return;
    dragdrop.push(basicDragdrop());
    putDragdrops();
    validate(e);
  });
  // listen to remove dragdrop btn
  let removeDragdropBtns = document.querySelectorAll(".remove-dragdrop-btn");
  removeDragdropBtns.forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      let index = +btn.getAttribute("data-dragdrop-index");
      if (dragdrop.length <= minDragdrops) return;
      dragdrop.splice(index, 1);
      putDragdrops();
      validate(e);
    })
  );
  // listen to question input
  let dragdropInputs = document.querySelectorAll(".dragdrop .dragdrop-question-text");
  dragdropInputs.forEach(input => {
    input.addEventListener("change", handleDragdroptxt);
    input.addEventListener("keyup", handleDragdroptxt);
    input.addEventListener("keydown", handleDragdroptxt);
    function handleDragdroptxt() {
      let index = +input.getAttribute("data-dragdrop-index");
      let field = input.getAttribute("data-field");
      dragdrop[index][field] = input.value;
    }
  });
  // listen to words input
  let wordsInputs = document.querySelectorAll(".dragdrop .dragdrop-words-input");
  wordsInputs.forEach(input => {
    input.addEventListener("change", handleWordsText);
    input.addEventListener("keyup", handleWordsText);
    input.addEventListener("keydown", handleWordsText);
    function handleWordsText(e) {
      let index = +input.getAttribute("data-dragdrop-index");
      dragdrop[index].words = input.value;
    }
  });
  listenToInputs();
  listenToAllLibraryOpenBtns();
}
function listenToDragdropsImgs() {
  let allDragdropsImagesBtns = document.querySelectorAll(".dragdrop .library-open-btn");
  allDragdropsImagesBtns.forEach(btn => {
    let libraryItemId = btn.getAttribute("data-library-item-id");
    let field = btn.getAttribute("data-field");
    let index = +btn.getAttribute("data-dragdrop-index");
    let fileSrc = btn.getAttribute("data-file-src");
    let libraryItemIdField = "";
    if (field === "dragimg") libraryItemIdField = "dragLibraryItemId";
    if (field === "dropimg") libraryItemIdField = "dropLibraryItemId";
    if (libraryItemId) dragdrop[index][field] = fileSrc;
    if (libraryItemId) dragdrop[index][libraryItemIdField] = libraryItemId;
  });
}
setInterval(() => {
  listenToDragdropsImgs();
}, 500);
putDragdrops();
