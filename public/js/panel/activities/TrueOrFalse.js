const instructionDescriptionsList = document.querySelector(".instruction-descriptions-list");
let formId = "TrueOrFalseForm";
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

// validation

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
    if (formType === "edit" && !changed) return e.preventDefault();
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
    settings.instruction_screen.objelms = `<ul style="direction: rtl">${instDescriptions.map(desc => (desc ? `<li>${desc}</li>` : "")).join("")}</ul>`;

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
    // question text data
    settings.game_screen.Qtxt.fontWeight = getInputValue(formId, "question_font_weight");
    settings.game_screen.Qtxt.fontSize = `${getInputValue(formId, "question_font_size")}px`;
    settings.game_screen.Qtxt.color = getInputValue(formId, "question_color");

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
    data.Questions = questions;

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
const gameDataIsValid = () => {
  let valid = true;
  questions.forEach((question, index) => {
    let number = index + 1;
    let input = document.querySelector(`.question_input[data-index="${index}"]`);
    if (!valid) return;
    // if question has no text written
    if (!question.Q_txt) {
      valid = false;
      // show msg
      hintViewer.innerText = `برجاء كتابة السؤال ${number}`;
      // make input invalid
      if (input) {
        input.classList.add("invalid");
        input.classList.remove("valid");
      }
    } else {
      // if question has text written
      // hide msg
      hintViewer.innerText = "";
      // make input valid
      if (input) {
        input.classList.remove("invalid");
        input.classList.add("valid");
      }
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

  if (formType === "edit") {
    changed = true;
    submitAddBtn.classList.remove("disabled");
  }

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
  if (!isItValid("not", fontSizeOk, "question_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;
  if (!gameDataIsValid()) return;
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

  putInputValue(formId, "question_font_weight", oldActivitySettings.game_screen.Qtxt.fontWeight);
  putInputValue(formId, "question_font_size", getPixelNumber(oldActivitySettings.game_screen.Qtxt.fontSize));
  putInputValue(formId, "question_color", oldActivitySettings.game_screen.Qtxt.color);
}
//  handle game data -------------------------------------------------
const questionsList = document.querySelector(`#${formId} .questions-list`);
let questions = newGameData.Questions;

// basic question object to be added
const basicQuestion = () => ({
  QID: `${questions.length + 1}`,
  Q_txt: "",
  Q_img: "",
  Q_snd: "",
  Answers: [
    {
      Is_correct: true,
      A_txt: "صواب",
      A_img: "Assets/Data/images/truebtn.png",
      A_snd: ""
    },
    {
      Is_correct: false,
      A_txt: "خطأ",
      A_img: "Assets/Data/images/falsebtn.png",
      A_snd: ""
    }
  ]
});

// used to update questions UI
function putQuestions() {
  updateQuestionIds(); // update all ids of questions
  questionsList.innerHTML = "";
  // put add question btn
  questionsList.innerHTML += `
  <div class="two-inputs">
   <button class="main-btn green add-question-btn">
     اضافة سؤال <i class="fa-solid fa-plus"></i>
   </button>
  </div>
 `;
  //  add question row
  questions.forEach((question, index) => {
    let number = index + 1;
    // check if question is correct or not
    let correct = question.Answers[0].Is_correct;
    // get img file and library id
    let imgLibraryId = question.img_library_id;
    imgLibraryId = imgLibraryId ? `data-library-item-id="${imgLibraryId}"` : "";
    let imgGreen = imgLibraryId ? "green" : "";
    // get sound file and library id
    let sndLibraryId = question.snd_library_id;
    sndLibraryId = sndLibraryId ? `data-library-item-id="${sndLibraryId}"` : "";
    let sndGreen = sndLibraryId ? "green" : "";
    // append question row
    questionsList.innerHTML += `
    <div class="two-inputs question-item">
      <div class="input-group">
        <label>السؤال ${number}</label>
        <div class="inputs line">
          <input data-index="${index}" value="${question.Q_txt}" class="question_input" type="text" />
          <div class="input">
            <div class="buttons">
              <button ${imgLibraryId} data-index="${index}" class="main-btn circle ${imgGreen} library-open-btn question-image" data-file-type="image" data-file-src="Assets/Data/images/question-${index}">
                <i class="fa-solid fa-image"></i>
              </button>
              <button ${sndLibraryId} data-index="${index}" class="main-btn circle ${sndGreen} library-open-btn question-audio" data-file-type="sound_effect" data-file-src="Assets/Data/audio/question-${index}">
                <i class="fa-solid fa-volume-low"></i>
              </button>
              <button data-index="${index}" title="حذف" class="main-btn circle red remove-question-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="input-group smaller">
        <label>الاجابة صحيحة؟</label>
        <button data-index="${index}" data-is-correct="${correct}" class="main-btn ${correct ? "green" : "red"} circle change-answer-btn">
          <i class="fa-solid fa-${correct ? "check" : "x"}"></i>
        </button>
      </div>
    </div>
    `;
  });

  // listen to add question btn
  let addQuestionBtn = document.querySelector(".add-question-btn");
  addQuestionBtn.addEventListener("click", e => {
    e.preventDefault();
    // maximum questions is 15
    if (questions.length >= 15) return;
    questions.push(basicQuestion());
    putQuestions(); // update UI
    validate();
  });

  // listen to remove question btns
  let removeQuestionBtns = document.querySelectorAll(".remove-question-btn");
  removeQuestionBtns.forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      // minimum questions is 2
      if (questions.length <= 2) return;
      // detect which question to remove
      let index = +btn.getAttribute("data-index");
      questions.splice(index, 1);
      putQuestions(); // update UI
      validate();
    })
  );
  // listen to change answer btns
  let changeAnswerBtns = document.querySelectorAll(".change-answer-btn");
  changeAnswerBtns.forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      // check if it was correct or not
      let correct = getBoolean(btn.getAttribute("data-is-correct"));
      // get index of question related to btn
      let index = +btn.getAttribute("data-index");
      if (correct) {
        // make it incorrect
        questions[index].Answers[0].Is_correct = false;
        questions[index].Answers[1].Is_correct = true;
      } else {
        // make it correct
        questions[index].Answers[0].Is_correct = true;
        questions[index].Answers[1].Is_correct = false;
      }
      putQuestions(); // update UI
      validate();
    })
  );
  // listen to inputs
  let questionInputs = document.querySelectorAll(".question_input");
  questionInputs.forEach(input => {
    input.addEventListener("change", e => {
      // detect which question to put text value
      let index = +input.getAttribute("data-index");
      // put value in question text from input
      questions[index].Q_txt = input.value;
    });
  });
  listenToInputs();
  listenToAllLibraryOpenBtns();
}
// used to update every question id to prevent wrong ids when deleting question
const updateQuestionIds = () => (questions = questions.map((q, i) => ({ ...q, QID: `${i + 1}` })));
// used to put imgs and sounds from btns into questions objects
function listenToQuestionsFilesBtns() {
  // get all image and sound buttons
  let allQuestionsFilesBtns = document.querySelectorAll(`#${formId} .questions-list .library-open-btn`);
  allQuestionsFilesBtns.forEach(btn => {
    let index = +btn.getAttribute("data-index");
    // detect file type based on class btn has
    let btnFileType = "";
    if (btn.classList.contains("question-image")) btnFileType = "image";
    if (btn.classList.contains("question-audio")) btnFileType = "audio";
    // get id of selected file (if exist)
    let libraryItemId = btn.getAttribute("data-library-item-id");
    // get file src of file
    let fileSrc = btn.getAttribute("data-file-src");
    // if btn has selected library item
    if (libraryItemId) {
      // put img file src and library id
      if (btnFileType === "image") {
        questions[index].Q_img = fileSrc;
        questions[index].img_library_id = libraryItemId;
      }
      // put sound file src and library id
      if (btnFileType === "audio") {
        questions[index].Q_snd = fileSrc;
        questions[index].snd_library_id = libraryItemId;
      }
    }
  });
}
// used to listen for library open buttons if it has selected file to put them into questions array
setInterval(() => {
  listenToQuestionsFilesBtns();
}, 300);
putQuestions();
