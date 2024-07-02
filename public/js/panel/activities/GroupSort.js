const instructionDescriptionsList = document.querySelector(".instruction-descriptions-list");
let formId = "GroupSortForm";
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
    if (formType === "edit" && !changed) return e.preventDefault() ;
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

    settings.game_screen.resultpage.minumum = getInputValue(formId, "success_rate");
    settings.game_screen.resultpage.goodeffect = getOpenLibraryBtnFileSrc(formId, "success_image", settings.game_screen.resultpage.goodeffect);
    settings.game_screen.resultpage.goodaudio = getOpenLibraryBtnFileSrc(formId, "success_sound", settings.game_screen.resultpage.goodaudio);
    settings.game_screen.resultpage.goodvideo = getOpenLibraryBtnFileSrc(formId, "success_video", settings.game_screen.resultpage.goodvideo);

    settings.game_screen.resultpage.badeffect = getOpenLibraryBtnFileSrc(formId, "fail_image", settings.game_screen.resultpage.badeffect);
    settings.game_screen.resultpage.badaudio = getOpenLibraryBtnFileSrc(formId, "fail_sound", settings.game_screen.resultpage.badaudio);
    settings.game_screen.resultpage.badvideo = getOpenLibraryBtnFileSrc(formId, "fail_video", settings.game_screen.resultpage.badvideo);
    // game data settings section
    settings.game_screen.layout.type = +getInputValue(formId, "layout");
    // submit answers btn
    settings.game_screen.submitUI.fontweight = getInputValue(formId, "submit_btn_font_weight");
    settings.game_screen.submitUI.fontSize = getInputValue(formId, "submit_btn_font_size");
    settings.game_screen.submitUI.titleText = getInputValue(formId, "submit_btn_title");
    settings.game_screen.submitUI.color = getInputValue(formId, "submit_btn_text_color");
    settings.game_screen.submitUI.backgroundColor = getInputValue(formId, "submit_btn_background_color");
    // submit answers btn
    settings.game_screen.sentenceBlankUI.fontweight = getInputValue(formId, "answer_box_font_weight");
    settings.game_screen.sentenceBlankUI.fontSize = getInputValue(formId, "answer_box_font_size");
    settings.game_screen.sentenceBlankUI.color = getInputValue(formId, "answer_box_text_color");
    settings.game_screen.sentenceBlankUI.backgroundColor = getInputValue(formId, "answer_box_background_color");

    // handle review link and activity code
    if (formType === "add") {
      let activityCode = getRandomNum();
      let finalReviewLink = `${reviewLink}${activityCode}`;
      settings.game_screen.reviewlink.link = finalReviewLink;
      settings.code = activityCode
      document.querySelector(`#${formId} input.code`).value = activityCode;
    }

    // put settings object in settings input value to send to backend
    settingsInput.value = JSON.stringify(settings);

    let allOpenLibraryBtns = document.querySelectorAll(`#${formId} .library-open-btn`);
    allOpenLibraryBtns.forEach(btn => {
      let library_item_id = btn.getAttribute("data-library-item-id");
      let game_file_path = btn.getAttribute("data-file-src");
      if (!library_item_id) return;

      let defaultCheckbox = document.querySelector(`.${btn.getAttribute("data-checkbox")}`);
      if (defaultCheckbox && defaultCheckbox.checked) return;
      filesPaths.push({ library_item_id, game_file_path });
    });
    filesInput.value = JSON.stringify(filesPaths);
    if (groupTypeSelect.value === "text") {
      newGameData.groups.forEach(group =>
        group.options.forEach(option => {
          option.answer = option.title;
          option.libraryItemId = "";
        })
      );
    }
    data = newGameData;
    console.log("File Paths: ", filesPaths);
    console.log("Settings: ", settings);
    console.log("Data: ", data);
    dataInput.value = JSON.stringify(data);
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

// game data validation
const gameDataIsValid = e => {
  let valid = true;
  newGameData.groups.forEach((group, groupIndex) => {
    // get group title input
    let groupTitleInput = document.querySelector(`.group_title[data-group-index="${groupIndex}"]`);

    if (!group.groupName) {
      if (!valid) return;
      valid = false;
      // give input red border
      if (groupTitleInput) groupTitleInput.classList.add("invalid");
      // show msg
      hintViewer.innerText = `برجاء كتابة عنوان المجموعة ${groupIndex + 1}`;
    }
    group.options.forEach((option, optionIndex) => {
      // get option title input
      let optionTitleInput = document.querySelector(`.group_item_text[data-group-index="${groupIndex}"][data-option-index="${optionIndex}"]`);
      // get option title img
      let optionImageBtn = document.querySelector(`.library-open-btn[data-group-index="${groupIndex}"][data-option-index="${optionIndex}"]`);
      if (!option.title) {
        if (!valid) return;
        valid = false;
        // give input red border
        if (optionTitleInput) optionTitleInput.classList.add("invalid");
        // show msg
        hintViewer.innerText = `برجاء كتابة اسم الاختيار ${optionIndex + 1} فى المجموعة ${groupIndex + 1}`;
      }
      if (formType === "add") {
        if (!option.libraryItemId && groupTypeSelect.value === "image") {
          if (!valid) return;
          valid = false;
          // give btn red border
          if (optionImageBtn) optionImageBtn.classList.add("red");
          // show msg
          hintViewer.innerText = `برجاء اختيار صورة الاختيار ${optionIndex + 1} فى المجموعة ${groupIndex + 1}`;
        }
      }
    });
  });
  // if all validation passed successfully remove msg
  if (valid) hintViewer.innerText = "";
  if (!valid && e.currentTarget.type === "submit") e.preventDefault();
  return valid;
};

const introVideoNotSelected = () => getBoolean(getInputValue(formId, "intro_active")) && fileNotSelected(formId, "intro_video") && formType === "add";

function validate(e) {
  // make all invalid to valid
  changed = true;
  submitAddBtn.classList.remove("disabled");
  let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
  allInvalid.forEach(el => el.classList.remove("invalid"));
  function isItValid(not, condition, className, msg) {
    return isValid(e, formId, hintViewer, not, condition, className, msg);
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
  // validate game content settings
  if (!isItValid("not", fontSizeOk, "submit_btn_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;
  if (!isItValid("", isEmpty, "submit_btn_title", "برجاء كتابة عنوان زر تاكيد الاجابة")) return;
  if (!isItValid("not", titleIsValid, "submit_btn_title", " عنوان زر تاكيد الاجابة يجب ان لا تزيد عن 40 حرف")) return;
  if (!isItValid("not", fontSizeOk, "answer_box_font_size", "حجم الخط يجب ان يكون بين 8 و 100 بيكسل")) return;

  if (!gameDataIsValid(e)) return;
  return true;
}

// game data handle -----------------------------------------------------------------------------------------
let gameDataBox = document.querySelector(".game-data-box");
// basic ggame data options to be added when clicking on add group option btn
const basicGroupOptionData = () => ({
  answer: "",
  title: ""
});
// basic ggame data groups to be added when changing count of groups
const basicGroupData = () => ({
  groupName: "",
  //if groupType: "text" [you can pass text as answer] or if groupType: "image", [you can pass image path as answer]
  options: [
    {
      answer: "",
      title: ""
    },
    {
      answer: "",
      title: ""
    },
    {
      answer: "",
      title: ""
    },
    {
      answer: "",
      title: ""
    }
  ]
});

// min and max group options
const minGroupOptions = 2;
const maxGroupOptions = 6;
const groupsCountSelect = document.querySelector(".groups_count");
// groups count select (is dynamic if added more count options)
groupsCountSelect.addEventListener("change", e => {
  let count = +e.target.value;
  // get current game groups count
  let groupLength = newGameData.groups.length;
  // when selected count is bigger remove extra groups based on selected count
  if (count < groupLength) newGameData.groups.splice(count, groupLength - 1);
  // when selected count is less add more groups based on selected count
  else {
    let toAddCount = count - groupLength;
    for (let i = 0; i < toAddCount; i++) {
      newGameData.groups.push(basicGroupData());
    }
  }

  // update game groups UI
  putGameData();
});

// update game group type
let groupTypeSelect = document.querySelector(".group_type");
groupTypeSelect.addEventListener("change", e => {
  newGameData.groupType = e.target.value;
  // update game groups UI
  putGameData();
});
// create new group option
function addGroupOption(e) {
  if (!e) return;
  e.preventDefault();

  // detect which group to add option into
  let index = +e.currentTarget.getAttribute("data-index");
  // if max options reached in this group don't add more
  if (newGameData.groups[index].options.length >= maxGroupOptions) return;
  // add new option in group
  newGameData.groups[index].options.push(basicGroupOptionData());
  // update game groups UI
  putGameData();
}

function removeGroupOption(e) {
  if (!e) return;
  e.preventDefault();
  // detect which group to remove option from
  let groupIndex = +e.currentTarget.getAttribute("data-group-index");
  // detect which option to be removed
  let optionIndex = +e.currentTarget.getAttribute("data-option-index");
  // if min options reached in this group don't remove
  if (newGameData.groups[groupIndex].options.length <= minGroupOptions) return;
  // remove selected option
  newGameData.groups[groupIndex].options.splice(optionIndex, 1);
  // update game groups UI
  putGameData();
}

// used to update game Groups UI
function putGameData() {
  // remove old HTML
  gameDataBox.innerHTML = "";
  newGameData.groups.forEach((group, groupIndex) => {
    // add group title input and options
    gameDataBox.innerHTML += `
    <div class="input-group">
    <!-- group_title -->
    <label for="group_title">عنوان المجموعة ${groupIndex + 1}</label>
    <input data-group-index="${groupIndex}" value="${group.groupName}" id="group_title" class="group_title" type="text" />
    <div class="inputs">
    ${group.options
      .map((option, optionIndex) => {
        // if (option has selected image make img color green and put file src and library item id again in btn attributes)
        let libraryItemId = option.libraryItemId ? `data-library-item-id="${option.libraryItemId}"` : "";
        let fileSrc = option.libraryItemId ? `data-file-src="${option.answer}"` : "";
        let imgBtnColor = option.libraryItemId ? "green" : "";
        // put option input, add btn, remove btn, img btn
        return `
        <div class="input">
          <input data-group-index="${groupIndex}" data-option-index="${optionIndex}" value="${option.title}" id="group_item_text" class="group_item_text" type="text" />
          <div class="buttons">
          <button onclick="addGroupOption()" data-index="${groupIndex}" class="main-btn add-group-option-btn green circle"><i class="fa-solid fa-plus"></i></button>
          <button data-group-index="${groupIndex}" data-option-index="${optionIndex}" class="main-btn remove-group-option-btn red circle"><i class="fa-solid fa-x"></i></button>
          ${
            newGameData.groupType === "image"
              ? `<button ${libraryItemId} ${fileSrc} data-group-index="${groupIndex}" data-option-index="${optionIndex}" class="main-btn library-open-btn group-option-img circle ${imgBtnColor}" data-file-type="image" data-file-src="Assets/Data/images/group-${groupIndex}-option-${optionIndex}">
                  <i class="fa-solid fa-image"></i>
                </button>`
              : ""
          }
          </div>
        </div>
        `;
      })
      .join("")}
      </div>
    </div>
    `;
  });
  // listen to inputs and library btns
  listenToAllLibraryOpenBtns();
  listenToInputs();

  // get all add option btns and listen to clicks
  let addOptionBtns = document.querySelectorAll(".add-group-option-btn");
  addOptionBtns.forEach(btn => btn.addEventListener("click", addGroupOption));

  // get all remove option btns and listen to clicks
  let removeOptionBtns = document.querySelectorAll(".remove-group-option-btn");
  removeOptionBtns.forEach(btn => btn.addEventListener("click", removeGroupOption));

  // get all group title inputs and listen to change and get values from them
  let groupTitleInputs = document.querySelectorAll(".group_title");
  groupTitleInputs.forEach(input =>
    input.addEventListener("change", () => {
      // detect which group to update it's title
      let index = +input.getAttribute("data-group-index");
      newGameData.groups[index].groupName = input.value;
    })
  );
  // get all group option inputs and listen to change and get values from them
  let groupOptionInputs = document.querySelectorAll(".group_item_text");
  groupOptionInputs.forEach(input =>
    input.addEventListener("change", e => {
      // detect which group that contain this option
      const groupIndex = +input.getAttribute("data-group-index");
      // detect which option to update it's title
      const optionIndex = +input.getAttribute("data-option-index");
      newGameData.groups[groupIndex].options[optionIndex].title = input.value;
    })
  );
}
putGameData();

// used to get file srcs from library image btns and but their srcs in game data object
function handleGroupsOptionsImages() {
  let allOptionsImages = document.querySelectorAll(".group-option-img");
  allOptionsImages.forEach(imgBtn => {
    // get group, option index
    let groupIndex = +imgBtn.getAttribute("data-group-index");
    let optionIndex = +imgBtn.getAttribute("data-option-index");
    // get library item id (used to detect if this image btn has image selected or not)
    let libraryItemId = imgBtn.getAttribute("data-library-item-id");
    // get library item file src
    let fileSrc = imgBtn.getAttribute("data-file-src");
    // if image btn has selected image
    if (libraryItemId) {
      // update file src and library item id in game data object
      newGameData.groups[groupIndex].options[optionIndex].answer = fileSrc;
      newGameData.groups[groupIndex].options[optionIndex].libraryItemId = libraryItemId;
    }
    if (!libraryItemId) {
      // remove file src and library item id in game data object
      newGameData.groups[groupIndex].options[optionIndex].answer = "";
      newGameData.groups[groupIndex].options[optionIndex].libraryItemId = "";
    }
  });
}

// check image btns every half second (when selected item from library it will be added into btn attributes and cannot listen to change so i listen to them this way)
setInterval(() => {
  handleGroupsOptionsImages();
}, 500);

// put inputs values in edit form
if (formType === "edit") {
  console.log(oldActivitySettings);
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
  putInputValue(formId, "layout", oldActivitySettings.game_screen.layout.type);
  // submit btn data
  putInputValue(formId, "submit_btn_font_weight", oldActivitySettings.game_screen.submitUI.fontweight);
  putInputValue(formId, "submit_btn_font_size", getPixelNumber(oldActivitySettings.game_screen.submitUI.fontSize));
  putInputValue(formId, "submit_btn_title", oldActivitySettings.game_screen.submitUI.titleText);
  putInputValue(formId, "submit_btn_text_color", oldActivitySettings.game_screen.submitUI.color);
  putInputValue(formId, "submit_btn_background_color", oldActivitySettings.game_screen.submitUI.backgroundColor);
  // answer box data
  putInputValue(formId, "answer_box_font_weight", oldActivitySettings.game_screen.sentenceBlankUI.fontweight);
  putInputValue(formId, "answer_box_font_size", getPixelNumber(oldActivitySettings.game_screen.sentenceBlankUI.fontSize));
  putInputValue(formId, "answer_box_text_color", oldActivitySettings.game_screen.sentenceBlankUI.color);
  putInputValue(formId, "answer_box_background_color", oldActivitySettings.game_screen.sentenceBlankUI.backgroundColor);
  // game data group settings
  putInputValue(formId, "groups_count", newGameData.groups.length);
  putInputValue(formId, "group_type", newGameData.groupType);
}
