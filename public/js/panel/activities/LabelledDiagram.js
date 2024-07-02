const instructionDescriptionsList = document.querySelector(
    ".instruction-descriptions-list"
);
let formId = "LabelledDiagramForm";
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
    let allInstDescInputs = document.querySelectorAll(
        ".instruction_description"
    );
    allInstDescInputs.forEach((input, index) => {
        input.addEventListener(
            "change",
            (e) => (instructionDescriptions[index] = input.value)
        );
    });

    let addInstructionDescriptionBtns = document.querySelectorAll(
        ".add-instruction-description"
    );
    addInstructionDescriptionBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
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

fonts.forEach((font) => {
    selectFont.forEach(
        (select) =>
            (select.innerHTML += `<option style="font-family: ${font}" value=${font} >${font}</option>`)
    );
});

// validation

function listenToInputs() {
    let allInputs = document.querySelectorAll(
        `#${formId} input, #${formId} select, #${formId} textarea`
    );
    allInputs.forEach((input) => {
        input.addEventListener("keydown", validate);
        input.addEventListener("keyup", validate);
        input.addEventListener("change", validate);
    });
}

let submitAddBtn = document.querySelector(".add-activity-submit");
if (submitAddBtn)
    submitAddBtn.addEventListener("click", (e) => {
        // e.preventDefault();
        if (!changed && formType === "edit") return e.preventDefault();
        if (!validate(e)) return e.preventDefault();
        let dataInput = document.querySelector(".data-input");
        let settingsInput = document.querySelector(".settings-input");
        let filesInput = document.querySelector(".files-input");
        let filesPaths = [];
        let data = gamedata;
        let settings =
            formType === "add"
                ? JSON.parse(JSON.stringify(game_ui))
                : oldActivitySettings;
        // put settings data from inputs -----------------------------------------------
        // main section
        settings.language.type = getInputValue(formId, "language_type");
        settings.game_screen.settimer.timeval = +getInputValue(
            formId,
            "timeval"
        );
        settings.game_screen.settimer.count = getInputValue(
            formId,
            "timer_type"
        );
        let livesEnabled = getBoolean(getInputValue(formId, "lives_enable"));
        settings.game_screen.lives.enable = livesEnabled;
        settings.game_screen.lives.number = +getInputValue(formId, "lives");
        // Instruction section
        settings.instruction_screen.titleUI.titleText = getInputValue(
            formId,
            "game_title"
        );
        settings.instruction_screen.titleUI.fontSize = `${getInputValue(
            formId,
            "instruction_font_size"
        )}px`;
        settings.instruction_screen.titleUI.color = getInputValue(
            formId,
            "instruction_text_color"
        );

        settings.instruction_screen.agegrp.titleText = getInputValue(
            formId,
            "age_fit"
        );
        settings.instruction_screen.agegrp.fontSize = `${getInputValue(
            formId,
            "instruction_font_size"
        )}px`;
        settings.instruction_screen.agegrp.color = getInputValue(
            formId,
            "instruction_text_color"
        );

        settings.instruction_screen.descriptionUI.titleText = getInputValue(
            formId,
            "game_description"
        );
        settings.instruction_screen.descriptionUI.fontSize = `${getInputValue(
            formId,
            "instruction_font_size"
        )}px`;
        settings.instruction_screen.descriptionUI.color = getInputValue(
            formId,
            "instruction_text_color"
        );

        settings.instruction_screen.objUI.titleText = getInputValue(
            formId,
            "instruction_title"
        );
        settings.instruction_screen.objUI.fontSize = `${getInputValue(
            formId,
            "instruction_font_size"
        )}px`;
        settings.instruction_screen.objUI.color = getInputValue(
            formId,
            "instruction_text_color"
        );

        let instDesc1 = getInputValue(formId, "instruction_description1");
        let instDesc2 = getInputValue(formId, "instruction_description2");
        let instDesc3 = getInputValue(formId, "instruction_description3");
        let instDesc4 = getInputValue(formId, "instruction_description4");
        let instDesc5 = getInputValue(formId, "instruction_description5");
        let instDescriptions = [
            instDesc1,
            instDesc2,
            instDesc3,
            instDesc4,
            instDesc5,
        ];
        settings.instruction_screen.objelms = `<ul style="direction: rtl">${instDescriptions
            .map((desc) => (desc ? `<li>${desc}</li>` : ""))
            .join("")}</ul>`;

        settings.instruction_screen.backgroundColor = getInputValue(
            formId,
            "instruction_background_color"
        );
        if (!checkboxChecked(formId, "instruction_background_default")) {
            settings.instruction_screen.backgroundImage =
                getOpenLibraryBtnFileSrc(
                    formId,
                    "instruction_background",
                    settings.instruction_screen.backgroundImage
                );
        }

        // intro video section
        settings.intro_vedio.display = getBoolean(
            getInputValue(formId, "intro_active")
        );
        settings.intro_vedio.src = getOpenLibraryBtnFileSrc(
            formId,
            "intro_video",
            settings.intro_vedio.src
        );
        // start section
        settings.start_screen.titleUI.titleText = getInputValue(
            formId,
            "start_title"
        );
        settings.start_screen.titleUI.fontSize = `${getInputValue(
            formId,
            "start_font_size"
        )}px`;
        settings.start_screen.titleUI.color = getInputValue(
            formId,
            "start_text_color"
        );

        settings.start_screen.instructionUI.titleText = getInputValue(
            formId,
            "start_description"
        );
        settings.start_screen.instructionUI.fontSize = `${getInputValue(
            formId,
            "start_description_font_size"
        )}px`;
        settings.start_screen.instructionUI.color = getInputValue(
            formId,
            "start_text_color"
        );
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

        settings.start_screen.backgroundColor = getInputValue(
            formId,
            "start_background_color"
        );
        if (!checkboxChecked(formId, "start_background_default")) {
            settings.start_screen.backgroundImage = getOpenLibraryBtnFileSrc(
                formId,
                "start_background",
                settings.start_screen.backgroundImage
            );
        }
        settings.start_screen.startButtonUI.backgroundImage =
            getOpenLibraryBtnFileSrc(
                formId,
                "start_button",
                settings.start_screen.startButtonUI.backgroundImage
            );
        // game section
        settings.game_screen.backgroundColor = getInputValue(
            formId,
            "game_background_color"
        );

        if (!checkboxChecked(formId, "game_background_default")) {
            settings.game_screen.backgroundImage = getOpenLibraryBtnFileSrc(
                formId,
                "game_background",
                settings.game_screen.backgroundImage
            );
        }
        settings.game_screen.randomQuestions.randomval = getBoolean(
            getInputValue(formId, "random_questions")
        );
        // correct, wrong section
        settings.game_screen.tryagainUI.soundEffect = getOpenLibraryBtnFileSrc(
            formId,
            "wrong_answer_sound",
            settings.game_screen.tryagainUI.soundEffect
        );
        settings.game_screen.tryagainUI.backgroundImage =
            getOpenLibraryBtnFileSrc(
                formId,
                "wrong_answer_background",
                settings.game_screen.tryagainUI.backgroundImage
            );

        settings.game_screen.correctfeedbackUI.soundEffect =
            getOpenLibraryBtnFileSrc(
                formId,
                "correct_answer_sound",
                settings.game_screen.correctfeedbackUI.soundEffect
            );
        settings.game_screen.correctfeedbackUI.backgroundImage =
            getOpenLibraryBtnFileSrc(
                formId,
                "correct_answer_background",
                settings.game_screen.correctfeedbackUI.backgroundImage
            );

        settings.game_screen.resultpage.minumum = +getInputValue(
            formId,
            "success_rate"
        );
        settings.game_screen.resultpage.goodeffect = getOpenLibraryBtnFileSrc(
            formId,
            "success_image",
            settings.game_screen.resultpage.goodeffect
        );
        settings.game_screen.resultpage.goodaudio = getOpenLibraryBtnFileSrc(
            formId,
            "success_sound",
            settings.game_screen.resultpage.goodaudio
        );
        settings.game_screen.resultpage.goodvideo = getOpenLibraryBtnFileSrc(
            formId,
            "success_video",
            settings.game_screen.resultpage.goodvideo
        );

        settings.game_screen.resultpage.badeffect = getOpenLibraryBtnFileSrc(
            formId,
            "fail_image",
            settings.game_screen.resultpage.badeffect
        );
        settings.game_screen.resultpage.badaudio = getOpenLibraryBtnFileSrc(
            formId,
            "fail_sound",
            settings.game_screen.resultpage.badaudio
        );
        settings.game_screen.resultpage.badvideo = getOpenLibraryBtnFileSrc(
            formId,
            "fail_video",
            settings.game_screen.resultpage.badvideo
        );

        settings.game_screen.optionUI.fontweight = getInputValue(
            formId,
            "question_font_weight"
        );
        settings.game_screen.optionUI.fontSize = `${getInputValue(
            formId,
            "question_font_size"
        )}px`;
        settings.game_screen.optionUI.color = getInputValue(
            formId,
            "question_text_color"
        );

        settings.game_screen.layout.type = +getInputValue(formId, "layout");

        // handle review link and activity code
        if (formType === "add") {
            let activityCode = getRandomNum();
            let finalReviewLink = `${reviewLink}${activityCode}`;
            settings.game_screen.reviewlink.link = finalReviewLink;
            settings.code = activityCode;
            document.querySelector(`#${formId} input.code`).value =
                activityCode;
        }

        // put settings object in settings input value to send to backend

        let allOpenLibraryBtns = document.querySelectorAll(
            `#${formId} .library-open-btn`
        );
        allOpenLibraryBtns.forEach((btn) => {
            let library_item_id = btn.getAttribute("data-library-item-id");
            let game_file_path = btn.getAttribute("data-file-src");
            if (!library_item_id) return;

            let defaultCheckbox = document.querySelector(
                `.${btn.getAttribute("data-checkbox")}`
            );
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
    submitEditBtn.addEventListener("click", (e) => {
        validate(e);
    });
// validation functions
const livesLimitReached = (number) => number > 5;
const livesIsZero = (number) => number <= 0;
const timerIsOk = (number) => number >= 15;

const descIsValid = (description) =>
    description.length <= 200 && description.length > 0;
const titleIsValid = (description) =>
    description.length <= 40 && description.length > 0;

const successRateOk = () => {
    let successRate = document.querySelector(`#${formId} .success_rate`);
    let rate = +successRate.value;
    return rate >= 10 && rate <= 100;
};

const introVideoNotSelected = () =>
    getBoolean(getInputValue(formId, "intro_active")) &&
    fileNotSelected(formId, "intro_video") &&
    formType === "add";

const gameDataIsValid = () => {
    let valid = true;
    options.forEach((option, index) => {
        let textInput = document.querySelector(
            `.question_title[data-index="${index}"]`
        );
        let hotspotMarker = document.querySelector(
            `.hotspot-marker[data-index="${index}"]`
        );
        let number = index + 1;
        if (!valid) return;
        if (!option.opt_txt) {
            valid = false;
            textInput.classList.add("invalid");
            textInput.classList.remove("valid");
            hintViewer.innerText = `برجاء ادخال العنوان ${number}`;
        } else if (option.opt_txt.length > 10) {
            valid = false;
            textInput.classList.add("invalid");
            textInput.classList.remove("valid");
            hintViewer.innerText = `الحد الاقصى لعدد الحروف 10 فى العنوان ${number}`;
        } else if (!option.hotspot.x || !option.hotspot.y) {
            valid = false;
            hotspotMarker.classList.add("red");
            hintViewer.innerText = `برجاء تحديد المكان للعنوان ${number}`;
        } else {
            textInput.classList.remove("invalid");
            textInput.classList.add("valid");
            hotspotMarker.classList.remove("red");
            hintViewer.innerText = "";
        }
    });

    return valid;
};

function validate(e) {
    // make all invalid to valid
    let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
    allInvalid.forEach((el) => el.classList.remove("invalid"));
    function isItValid(not, condition, className, msg) {
        return isValid(e, formId, hintViewer, not, condition, className, msg);
    }
    changed = true;
    submitAddBtn.classList.remove("disabled");
    // Validate game title
    if (!isItValid("", isEmpty, "game_title", "برجاء ادخال عنوان اللعبة"))
        return;
    if (
        !isItValid(
            "not",
            titleIsValid,
            "game_title",
            " عنوان اللعبة يجب ان لا تزيد عن 40 حرف"
        )
    )
        return;
    // Validate timeval
    if (!isItValid("", isEmpty, "timeval", "برجاء ادخال الوقت")) return;
    if (
        !isItValid(
            "not",
            timerIsOk,
            "timeval",
            "الوقت يجب ان لا يقل عن 15 ثانية"
        )
    )
        return;
    // Validate game description
    if (
        !isItValid("", isEmpty, "game_description", "برجاء ادخال تفاصيل النشاط")
    )
        return;
    if (
        !isItValid(
            "not",
            descIsValid,
            "game_description",
            "تفاصيل النشاط يجب ان لا تزيد عن 200 حرف"
        )
    )
        return;
    // Validate age fit
    if (!isItValid("", isEmpty, "age_fit", "برجاء ادخال العمر")) return;
    // validate lives
    if (!isItValid("", isEmpty, "lives", "برجاء ادخال عدد مرت الخطأ")) return;
    if (
        !isItValid(
            "",
            livesLimitReached,
            "lives",
            "الحد الاقصى لعدد مرات الخطأ 5"
        )
    )
        return;
    if (!isItValid("", livesIsZero, "lives", "يجب تحديد عدد مرات الخطأ"))
        return;
    // Validate instruction title
    if (
        !isItValid(
            "",
            isEmpty,
            "instruction_title",
            "برجاء ادخال عنوان التعليمات"
        )
    )
        return;
    if (
        !isItValid(
            "not",
            titleIsValid,
            "instruction_title",
            " عنوان التعليمات يجب ان لا تزيد عن 40 حرف"
        )
    )
        return;
    // Validate instruction font size
    if (
        !isItValid(
            "",
            isEmpty,
            "instruction_font_size",
            "برجاء ادخال حجم خط التعليمات"
        )
    )
        return;
    if (
        !isItValid(
            "not",
            fontSizeOk,
            "instruction_font_size",
            "حجم الخط يجب ان يكون بين 8 و 100 بيكسل"
        )
    )
        return;

    // Validate instruction description
    if (
        instructionDescriptions[0] === "" &&
        !isItValid(
            "",
            isEmpty,
            "instruction_description1",
            "1 برجاء ادخال وصف التعليمات"
        )
    )
        return;
    if (
        instructionDescriptions[1] === "" &&
        !isItValid(
            "",
            isEmpty,
            "instruction_description2",
            "2 برجاء ادخال وصف التعليمات"
        )
    )
        return;
    if (
        instructionDescriptions[2] === "" &&
        !isItValid(
            "",
            isEmpty,
            "instruction_description3",
            "3 برجاء ادخال وصف التعليمات"
        )
    )
        return;
    if (
        instructionDescriptions[3] === "" &&
        !isItValid(
            "",
            isEmpty,
            "instruction_description4",
            "4 برجاء ادخال وصف التعليمات"
        )
    )
        return;
    if (
        instructionDescriptions[4] === "" &&
        !isItValid(
            "",
            isEmpty,
            "instruction_description5",
            "5 برجاء ادخال وصف التعليمات"
        )
    )
        return;
    // validate intro video
    if (
        !isItValid(
            "",
            () => introVideoNotSelected(),
            "intro_video",
            "برجاء رفع فيديو المقدمة او الغاء تفعيله"
        )
    )
        return;
    // validate start title
    if (!isItValid("", isEmpty, "start_title", "برجاء ادخال عنوان الصفحة"))
        return;
    if (
        !isItValid(
            "not",
            titleIsValid,
            "start_title",
            " عنوان البداية يجب ان لا تزيد عن 40 حرف"
        )
    )
        return;
    // Validate start font size
    if (
        !isItValid(
            "",
            isEmpty,
            "start_font_size",
            "برجاء ادخال حجم خط شريحة البداية"
        )
    )
        return;
    if (
        !isItValid(
            "not",
            fontSizeOk,
            "start_font_size",
            "حجم الخط يجب ان يكون بين 8 و 100 بيكسل"
        )
    )
        return;
    // validate start button
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "start_button"),
            "start_button",
            "برجاء اختيار ايقون البداية"
        )
    )
        return;
    // validate start description
    if (
        !isItValid(
            "",
            isEmpty,
            "start_description",
            "برجاء ادخال ملاحظات البداية"
        )
    )
        return;
    if (
        !isItValid(
            "not",
            descIsValid,
            "start_description",
            "ملاحظات البداية يجب ان لا تزيد عن 200 حرف"
        )
    )
        return;
    if (
        !isItValid(
            "not",
            fontSizeOk,
            "start_description_font_size",
            "حجم الخط يجب ان يكون بين 8 و 100 بيكسل"
        )
    )
        return;

    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "correct_answer_background"),
            "correct_answer_background",
            "برجاء اختيار صورة الاجابة الصحيحة"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "correct_answer_sound"),
            "correct_answer_sound",
            "برجاء اختيار صوت الاجابة الصحيحة"
        )
    )
        return;

    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "wrong_answer_background"),
            "wrong_answer_background",
            "برجاء اختيار صورة الاجابة الخاظئة"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "wrong_answer_sound"),
            "wrong_answer_sound",
            "برجاء اختيار  صوت الاجابة الخاظئة"
        )
    )
        return;

    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "success_image"),
            "success_image",
            "برجاء اختيار صورة النجاح"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "success_sound"),
            "success_sound",
            "برجاء اختيار صوت النجاح"
        )
    )
        return;
    // validate success rate
    if (!isItValid("", isEmpty, "success_rate", "برجاء تحديد نسبة النجاح"))
        return;
    if (
        !isItValid(
            "not",
            successRateOk,
            "success_rate",
            "نسبة النجاح يجب ان تكون بين %10 و %100"
        )
    )
        return;

    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "fail_image"),
            "fail_image",
            "برجاء اختيار صورة الرسوب"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "fail_sound"),
            "fail_sound",
            "برجاء اختيار صوت الرسوب"
        )
    )
        return;

    if (
        !isItValid(
            "not",
            fontSizeOk,
            "question_font_size",
            "حجم الخط يجب ان يكون بين 8 و 100 بيكسل"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "questions_background"),
            "questions_background",
            "برجاء اختيار صورة الرسمة"
        )
    )
        return;
    if (!gameDataIsValid()) return;
    return true;
}

// put inputs values in edit form
if (formType === "edit") {
    // main data
    putInputValue(
        formId,
        "game_title",
        oldActivitySettings.instruction_screen.titleUI.titleText
    );
    putInputValue(
        formId,
        "timer_type",
        oldActivitySettings.game_screen.settimer.count
    );
    putInputValue(
        formId,
        "timeval",
        oldActivitySettings.game_screen.settimer.timeval
    );
    putInputValue(
        formId,
        "game_description",
        oldActivitySettings.instruction_screen.descriptionUI.titleText
    );

    putInputValue(formId, "language_type", oldActivitySettings.language.type);
    putInputValue(
        formId,
        "age_fit",
        oldActivitySettings.instruction_screen.agegrp.titleText
    );
    putInputValue(
        formId,
        "lives_enable",
        oldActivitySettings.game_screen.lives.enable
    );
    putInputValue(
        formId,
        "lives",
        oldActivitySettings.game_screen.lives.number
    );
    // instruction section data
    putInputValue(
        formId,
        "instruction_title",
        oldActivitySettings.instruction_screen.objUI.titleText
    );
    putInputValue(
        formId,
        "instruction_font_size",
        getPixelNumber(oldActivitySettings.instruction_screen.objUI.fontSize)
    );
    putInputValue(
        formId,
        "instruction_text_color",
        oldActivitySettings.instruction_screen.titleUI.color
    );
    putInputValue(
        formId,
        "instruction_background_color",
        oldActivitySettings.instruction_screen.backgroundColor
    );
    // instruction descriptions
    let descriptionElement = document.createElement("div");
    descriptionElement.innerHTML =
        oldActivitySettings.instruction_screen.objelms;
    instructionDescriptions = [];
    [...descriptionElement.children[0].children].forEach((li) =>
        instructionDescriptions.push(li.innerText)
    );
    handleInstructionDescriptions();
    // intro video data
    putInputValue(
        formId,
        "intro_active",
        oldActivitySettings.intro_vedio.display
    );
    // start section data
    putInputValue(
        formId,
        "start_title",
        oldActivitySettings.start_screen.titleUI.titleText
    );
    putInputValue(
        formId,
        "start_font_size",
        getPixelNumber(oldActivitySettings.start_screen.titleUI.fontSize)
    );
    putInputValue(
        formId,
        "start_text_color",
        oldActivitySettings.start_screen.titleUI.color
    );
    putInputValue(
        formId,
        "start_background_color",
        oldActivitySettings.start_screen.backgroundColor
    );
    putInputValue(
        formId,
        "start_description",
        oldActivitySettings.start_screen.instructionUI.titleText
    );
    putInputValue(
        formId,
        "start_description_font_size",
        getPixelNumber(oldActivitySettings.start_screen.instructionUI.fontSize)
    );
    // handle start button position
    let buttonPixel = oldActivitySettings.start_screen.startButtonUI.top;
    let startBtnPosition = "";
    if (buttonPixel === "100px") startBtnPosition = "top";
    if (buttonPixel === "278px") startBtnPosition = "center";
    if (buttonPixel === "400px") startBtnPosition = "bottom";
    if (!startBtnPosition) startBtnPosition = "top";
    putInputValue(formId, "start_button_place", startBtnPosition);
    // game data
    putInputValue(
        formId,
        "game_background_color",
        oldActivitySettings.game_screen.backgroundColor
    );
    putInputValue(
        formId,
        "success_rate",
        oldActivitySettings.game_screen.resultpage.minumum
    );
    putInputValue(
        formId,
        "random_questions",
        oldActivitySettings.game_screen.randomQuestions.randomval
    );

    putInputValue(
        formId,
        "question_font_weight",
        oldActivitySettings.game_screen.optionUI.fontweight
    );
    putInputValue(
        formId,
        "question_font_size",
        getPixelNumber(oldActivitySettings.game_screen.optionUI.fontSize)
    );
    putInputValue(
        formId,
        "question_text_color",
        oldActivitySettings.game_screen.optionUI.color
    );
    putInputValue(
        formId,
        "layout",
        oldActivitySettings.game_screen.layout.type
    );
}
// game data handle
let questionsBgInput = document.querySelector(
    `#${formId} .questions_background`
);
// main structure of game data option
const basicOption = () => ({
    opt_txt: "",
    opt_bg_color: "#000000",
    opt_bg_img: "",
    hotspot: { x: "", y: "" },
});
// min max allowed options
let minOptions = 2;
let maxOptions = 12;
// used to detect which option to mark it's hotspot
let currentSelectedOption = 0;

// listen to game options center image change
setInterval(() => {
    if (questionsBgInput) {
        // get library item id from button
        let libraryItemId = questionsBgInput.getAttribute(
            "data-library-item-id"
        );
        // image viewer to show image in
        let questionsImageViewer = document.querySelector(
            `#${formId} .questions-image-viewer`
        );
        // if selected an image
        if (libraryItemId) {
            // get library item
            let libraryItem = libraryItems.find(
                (item) => item.id == libraryItemId
            );
            if (libraryItem) {
                // get src of image
                let src = libraryItem.src || libraryItem.item;
                if (src) {
                    // update src of image viewer
                    questionsImageViewer.src = assetRoot + src;
                    // update src of game data
                    newGameData.centerImage =
                        "Assets/Data/images/question-bg.jpg";
                    newGameData.centerImageLibraryId = libraryItemId;
                } else console.log("failed to get library item file src");
            }
        } else {
            // if in edit form update image viewer src from current activity
            if (formType === "edit") {
                questionsImageViewer.src = gameOptionsCenterImage;
            }
        }
    }
}, 200);

let titlesList = document.querySelector(
    `.labelled-diagram-game-data-section .titles-list`
);
const options = newGameData.boxOptions;

function putOptions() {
    titlesList.innerHTML = "";
    // put add new option btn and grid head
    titlesList.innerHTML += `
  <div class="input-group small">
    <button onclick="addOption(event)" class="main-btn green">اضافة عنوان <i class="fa-solid fa-plus"></i></button>
  </div>
  <div class="input-group head">
    <span class="title">#</span>
    <span class="title">العنوان</span>
    <span class="bg-img-and-clr">صورة ولون الخلفية</span>
    <span class="delete">حذف</span>
    <span class="choose-place">تحديد المكان</span>
  </div>
  `;
    // put options
    options.forEach((option, index) => {
        let number = index + 1;
        // check if marked or not
        let hotSpotMarkedClr =
            option.hotspot.x && option.hotspot.y
                ? currentSelectedOption === index
                    ? ""
                    : "green"
                : "";
        // check if it's current selected option
        let currentOption =
            currentSelectedOption === index
                ? ""
                : hotSpotMarkedClr
                ? "green"
                : "gray";
        // get marked icon
        let hotSpotMarked =
            option.hotspot.x && option.hotspot.y ? "check" : "arrow-pointer";
        // get library id
        let libraryItemId = option.libraryItemId;
        // check if has selected image
        let imageIdExist = libraryItemId
            ? `data-library-item-id="${libraryItemId}"`
            : "";
        let optionImage = option.opt_bg_img;
        // check if has selected image make image button green
        let imageExist = optionImage ? "green" : "";
        // put option
        titlesList.innerHTML += `
    <div class="input-group body-item">
      <div class="row-item">
        ${number}
      </div>
      <div class="row-item">
        <input onkeyup="handleOptionText(event)" onkeydown="handleOptionText(event)" onchange="handleOptionText(event)" data-index="${index}" value="${option.opt_txt}" id="question_title" class="question_title" type="text" />
      </div>
      <div class="row-item">
        <button data-index="${index}" ${imageIdExist} class="main-btn circle ${imageExist} library-open-btn question_title_background_image" data-file-type="background_image" data-file-src="Assets/Data/images/option-${number}">
          <i class="fa-solid fa-image"></i>
        </button>
        <input onkeyup="handleOptionColor(event)" onkeydown="handleOptionColor(event)" onchange="handleOptionColor(event)" data-index="${index}" title="لون الخلفية" value="${option.opt_bg_color}" id="question_text_color" class="question_text_color" type="color" />
      </div>
      <div class="row-item">
        <button onclick="removeOption(event)" data-index="${index}" title="حذف" class="main-btn circle red"><i class="fa-solid fa-x"></i></button>
      </div>
      <div class="row-item">
        <button onmouseenter="showOptionHotspot(event)" onmouseleave="hideOptionHotspot(event)" onclick="markHotspot(event)" data-index="${index}" title="تحديد المكان فى الصورة" class="main-btn circle hotspot-marker ${currentOption} ${hotSpotMarkedClr}"><i class="fa-solid fa-${hotSpotMarked}"></i></button>
      </div>
    </div>
    `;
    });
    listenToInputs();
    refreshQuestionsImage();
    listenToAllLibraryOpenBtns();
}
putOptions();

// listen to remove btn
function removeOption(e) {
    e.preventDefault();
    // min count
    if (options.length <= minOptions) return;
    let index = +e.currentTarget.getAttribute("data-index");
    options.splice(index, 1); // remove item
    putOptions();
    validate(e);
}

// listen to add btn
function addOption(e) {
    e.preventDefault();
    // max count
    if (options.length >= maxOptions) return;
    options.push(basicOption()); // add item
    putOptions();
    validate(e);
}

// listen to option text
function handleOptionText(e) {
    let value = e.currentTarget.value;
    let index = +e.currentTarget.getAttribute("data-index");
    // update option title
    options[index].opt_txt = value;
    refreshQuestionsImage();
}

// listen to option color
function handleOptionColor(e) {
    let value = e.currentTarget.value;
    let index = +e.currentTarget.getAttribute("data-index");
    // update option background color
    options[index].opt_bg_color = value;
}

// listen to option mark btn
function markHotspot(e) {
    let index = +e.currentTarget.getAttribute("data-index");
    // make it as current option
    currentSelectedOption = index;
    putOptions();
    // make all mark buttons unactive
    let allHotspotItems = document.querySelectorAll(`.hotspot-item`);
    allHotspotItems.forEach((item) => item.classList.remove("active"));
    // make current mak button active
    let hotspotItem = document.querySelector(
        `.hotspot-item[data-index="${index}"]`
    );
    if (hotspotItem) hotspotItem.classList.add("active");
}

// hanlde option bg images
function handleOptionsBgImages() {
    let allOptionsImages = document.querySelectorAll(
        ".question_title_background_image"
    );
    allOptionsImages.forEach((image) => {
        let index = +image.getAttribute("data-index");
        // get selected library id
        let libraryItemId = image.getAttribute("data-library-item-id");
        let imageSrc = image.getAttribute("data-file-src");
        // if selected image from library put it's src and id into option
        if (!libraryItemId) return;
        options[index].opt_bg_img = imageSrc;
        options[index].libraryItemId = libraryItemId;
    });
}
// used to listen for options bg images change
setInterval(() => {
    handleOptionsBgImages();
}, 500);

// used to show which hotspot is currently hovered
function showOptionHotspot(e) {
    let index = +e.currentTarget.getAttribute("data-index");
    let hotspotItem = document.querySelector(
        `.hotspot-item[data-index="${index}"]`
    );
    if (hotspotItem) hotspotItem.classList.add("show");
}
// used to hide hotspot that was hovered
function hideOptionHotspot(e) {
    let index = +e.currentTarget.getAttribute("data-index");
    let hotspotItem = document.querySelector(
        `.hotspot-item[data-index="${index}"]`
    );
    if (hotspotItem) hotspotItem.classList.remove("show");
}

function getImageHotspot(e) {
    // get game width and height
    let gameWidth = 1280;
    let gameHeight = 720;
    // get center image dimentions
    let rect = e.currentTarget.getBoundingClientRect();
    // get width and height of image
    const imgWidth = rect.width; // 1000px
    const imgHeight = rect.height; // 600px
    // detect clicked position of image
    const clickedX = e.clientX - rect.left; // 500px
    const clickedY = e.clientY - rect.top; // 300px
    // get clicked position in %
    const clickedXPercent = (clickedX * 100) / imgWidth; // 50%
    const clickedYPercent = (clickedY * 100) / imgHeight; // 50%
    // get clicked position but with game dimentions
    const finalTop = (gameHeight * clickedYPercent) / 100; // 640px
    const finalLeft = (gameWidth * clickedXPercent) / 100; // 360px
    // update hotspot x and y
    options[currentSelectedOption].hotspot.x = Math.floor(finalLeft);
    options[currentSelectedOption].hotspot.y = Math.floor(finalTop);
    putOptions();
    validate(e);
}

// update center image with selected hotspots
function refreshQuestionsImage() {
    let questionsImageBox = document.querySelector(
        ".questions-image-box .options-hotspots"
    );
    questionsImageBox.innerHTML = "";
    options.forEach((option, index) => {
        // check if hotspot active
        let active = index === currentSelectedOption ? "active" : "";
        // main game width and height
        let gameWidth = 1280;
        let gameHeight = 720;
        // get percentage of hotspot position
        const clickedXPercent = (option.hotspot.x * 100) / gameWidth;
        const clickedYPercent = (option.hotspot.y * 100) / gameHeight;
        if (!clickedXPercent || !clickedYPercent) return;
        // put hotspot position
        questionsImageBox.innerHTML += `
      <span title="${option.opt_txt}" data-index="${index}" class="hotspot-item ${active}" style="top: ${clickedYPercent}%; left: ${clickedXPercent}%" ></span>
    `;
    });
}
