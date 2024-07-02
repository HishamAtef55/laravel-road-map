const instructionDescriptionsList = document.querySelector(".instruction-descriptions-list");
let formId = "AnagramForm";
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
    settings.game_screen.randomQuestions.randomval = getBoolean(getInputValue(formId, "random_questions"));
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
    settings.game_screen.layout.type = +getInputValue(formId, "layout");
    // handle review link and activity code
    if (formType === "add") {
      let activityCode = getRandomNum();
      let finalReviewLink = `${reviewLink}${activityCode}`;
      settings.game_screen.reviewlink.link = finalReviewLink;
      settings.code = activityCode
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
  levels.forEach((level, index) => {
    if (!valid) return;
    let questionTextInput = document.querySelector(`.level .level-question-text[data-level-index="${index}"]`);
    let questionImgInput = document.querySelector(`.level .library-open-btn[data-level-index="${index}"]`);
    let questionWordsInput = document.querySelector(`.level .level-words-input[data-level-index="${index}"]`);
    let number = index + 1;

    let wordsList = level.words.split(" ");
    const wordsSpacesAreValid = () => wordsList.find(letter => letter === "") !== "";
    const wordLengthOk = () => {
      let ok = true;
      wordsList.forEach(word => {
        if (word.length > 8 || word.length < 2) ok = false;
      });
      return ok;
    };
    if (!level.questionImg && !level.questionText) {
      valid = false;
      questionTextInput.classList.add("invalid");
      questionTextInput.classList.remove("valid");
      questionImgInput.classList.add("invalid");
      hintViewer.innerText = `برجاء كتابة سؤال المرحلة  ${number} او اختيار صورة`;
    } else {
      questionTextInput.classList.remove("invalid");
      questionTextInput.classList.add("valid");
      hintViewer.innerText = "";
    }
    if (!valid) return;
    if (!level.words) {
      valid = false;
      questionWordsInput.classList.add("invalid");
      questionWordsInput.classList.remove("valid");
      hintViewer.innerText = `برجاء ادخال كلمات المرحلة  ${number}`;
    } else if (!wordsSpacesAreValid()) {
      valid = false;
      questionWordsInput.classList.add("invalid");
      questionWordsInput.classList.remove("valid");
      hintViewer.innerText = `لا يمكن اضافة اكثر من مسافة واحدة ' ' بين الكلمات ولا يكمن اضافة مسافة فى اول واخر الكلمات فى السؤل ${number}`;
    } else if (wordsList.length > 4) {
      valid = false;
      questionWordsInput.classList.add("invalid");
      questionWordsInput.classList.remove("valid");
      hintViewer.innerText = `الحد الاقصى لعدد الكلمات هو 4 فى كلمات المرحلة ${number}`;
    } else if (!wordLengthOk()) {
      valid = false;
      questionWordsInput.classList.add("invalid");
      questionWordsInput.classList.remove("valid");
      hintViewer.innerText = `عدد حروف كل كلمة يجب ن تكون بين 2 الى 8 حروف فى كلمات السؤال ${number}`;
    } else {
      questionWordsInput.classList.remove("invalid");
      questionWordsInput.classList.add("valid");
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
  putInputValue(formId, "random_questions", oldActivitySettings.game_screen.randomQuestions.randomval);
  putInputValue(formId, "layout", oldActivitySettings.game_screen.layout.type);
}

// game data handle -------------------------------
let levelsList = document.querySelector(`#${formId} .anagram-levels-list`);
const basicLevel = () => ({
  questionText: "",
  questionImg: "",
  words: ""
});
const minLevels = 2;
const maxLevels = 15;

let levels = newGameData.levels;

function putLevels() {
  let reachedMaxLevels = levels.length >= maxLevels;
  reachedMaxLevels = reachedMaxLevels ? "disabled" : "";
  let reachedMinLevels = levels.length <= minLevels;
  reachedMinLevels = reachedMinLevels ? "disabled" : "";

  levelsList.innerHTML = "";
  levelsList.innerHTML += `
  <div>
    <button class="main-btn green ${reachedMaxLevels} add-level-btn">اضافة مرحلة <i class="fa-solid fa-plus"></i></button>
  </div>
  `;
  levels.forEach((level, index) => {
    let number = index + 1;
    let haveImg = level.questionImg;
    let libraryItemId = level.libraryItemId;
    let haveImgColor = haveImg ? "green" : "";
    let haveLibraryId = libraryItemId ? `data-library-item-id="${libraryItemId}"` : "";
    levelsList.innerHTML += `
    <div class="level">
      <div class="input-group">
        <label for="">المرحلة ${number}</label>
        <div class="inputs line">
          <input data-level-index="${index}" value="${level.questionText}" placeholder="سؤال المرحلة" type="text" class="level-question-text" />
          <div class="input">
            <div class="buttons">
              <button ${haveLibraryId} data-level-index="${index}" title="اضافة صورة السؤال" class="main-btn circle ${haveImgColor} library-open-btn" data-file-type="image" data-file-src="Assets/Data/images/level-${number}"><i class="fa-solid fa-image"></i></button>
              <button data-level-index="${index}" title="حذف المرحلة" class="main-btn circle red ${reachedMinLevels} remove-level-btn"><i class="fa-solid fa-trash" ></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="input-group">
        <label for="">كلمات المرحلة (المراد ترتيبها)</label>
        <input data-level-index="${index}" value="${level.words}" type="text" class="level-words-input" />
      </div>
    </div>
    `;
  });
  // listen to add level btn
  let addLevelBtn = document.querySelector(".add-level-btn");
  addLevelBtn.addEventListener("click", e => {
    e.preventDefault();
    if (levels.length >= maxLevels) return;
    levels.push(basicLevel());
    putLevels();
    validate(e);
  });
  // listen to remove level btn
  let removeLevelBtns = document.querySelectorAll(".remove-level-btn");
  removeLevelBtns.forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      let index = +btn.getAttribute("data-level-index");
      if (levels.length <= minLevels) return;
      levels.splice(index, 1);
      putLevels();
      validate(e);
    })
  );
  // listen to question input
  let questionInputs = document.querySelectorAll(".level .level-question-text");
  questionInputs.forEach(input => {
    input.addEventListener("change", handleQuestionText);
    input.addEventListener("keyup", handleQuestionText);
    input.addEventListener("keydown", handleQuestionText);
    function handleQuestionText() {
      let index = +input.getAttribute("data-level-index");
      levels[index].questionText = input.value;
    }
  });
  // listen to words input
  let wordsInputs = document.querySelectorAll(".level .level-words-input");
  wordsInputs.forEach(input => {
    input.addEventListener("change", handleWordsText);
    input.addEventListener("keyup", handleWordsText);
    input.addEventListener("keydown", handleWordsText);
    function handleWordsText(e) {
      let index = +input.getAttribute("data-level-index");
      levels[index].words = input.value;
    }
  });
  listenToInputs();
  listenToAllLibraryOpenBtns();
}
function listenToLevelsImgs() {
  let allLevelsImagesBtns = document.querySelectorAll(".level .library-open-btn");
  allLevelsImagesBtns.forEach(btn => {
    let libraryItemId = btn.getAttribute("data-library-item-id");
    let index = +btn.getAttribute("data-level-index");
    let fileSrc = btn.getAttribute("data-file-src");

    if (libraryItemId) levels[index].questionImg = fileSrc;
    if (libraryItemId) levels[index].libraryItemId = libraryItemId;
  });
}
setInterval(() => {
  listenToLevelsImgs();
}, 500);
putLevels();
