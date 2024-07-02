const instructionDescriptionsList = document.querySelector(
    ".instruction-descriptions-list"
);
let formId = "MazeForm";
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
        if (formType === "edit" && !changed) return e.preventDefault();
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

        settings.game_screen.MazeUI.enemySpeedmSec = +getInputValue(
            formId,
            "enemy_speed"
        );
        settings.game_screen.MazeUI.NumberOfEnemies = +getInputValue(
            formId,
            "enemy_count"
        );
        settings.game_screen.MazeUI.MazeTotCols = +getInputValue(
            formId,
            "col_count"
        );
        settings.game_screen.MazeUI.MazeTotRows = +getInputValue(
            formId,
            "row_count"
        );
        settings.game_screen.MazeUI.RandomizeZones = getBoolean(
            getInputValue(formId, "randomize_zones")
        );

        settings.game_screen.MazeUI.playerImage = getOpenLibraryBtnFileSrc(
            formId,
            "player_image",
            settings.game_screen.MazeUI.playerImage
        );
        settings.game_screen.MazeUI.enemyImage = getOpenLibraryBtnFileSrc(
            formId,
            "enemy_image",
            settings.game_screen.MazeUI.enemyImage
        );
        settings.game_screen.MazeUI.GameBGTile = getOpenLibraryBtnFileSrc(
            formId,
            "tile_image",
            settings.game_screen.MazeUI.GameBGTile
        );

        settings.game_screen.MazeUI.correctSound = getOpenLibraryBtnFileSrc(
            formId,
            "correct_zone_sound",
            settings.game_screen.MazeUI.correctSound
        );
        settings.game_screen.MazeUI.wrongSound = getOpenLibraryBtnFileSrc(
            formId,
            "wrong_zone_sound",
            settings.game_screen.MazeUI.wrongSound
        );
        settings.game_screen.MazeUI.GameOverSnd = getOpenLibraryBtnFileSrc(
            formId,
            "game_end_sound",
            settings.game_screen.MazeUI.GameOverSnd
        );

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
        data.Zones = zones;

        // console.log("File Paths: ", filesPaths);
        // console.log("Settings: ", settings);
        // console.log("Data: ", data);

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
    let correctZones = 0;
    zones.forEach((zone, index) => {
        let number = index + 1;
        let zoneImageBtn = document.querySelector(
            `.zone-image[data-index="${index}"]`
        );
        if (!valid) return;
        if (zone.isCorrect) correctZones += 1;
        let samePlaceZone = zones.find(
            (z, i) => z.col === zone.col && z.row === zone.row && i !== index
        );
        if (samePlaceZone && !randomizeZones) {
            valid = false;
            // show msg
            hintViewer.innerText = `لا يمكن ان يكون هناك منطقتين فى نفس المكان فى المنطقة رقم ${number}`;
        }
        if (!valid) return;
        // if zone has no image
        if (!zone.img) {
            valid = false;
            // show msg
            hintViewer.innerText = `برجاء اختيار صورة المنطقة ${number}`;
            // make zoneImageBtn invalid
            if (zoneImageBtn) {
                zoneImageBtn.classList.add("invalid");
                zoneImageBtn.classList.remove("valid");
            }
        } else {
            // hide msg
            hintViewer.innerText = "";
            // make zoneImageBtn valid
            if (zoneImageBtn) {
                zoneImageBtn.classList.remove("invalid");
                zoneImageBtn.classList.add("valid");
            }
        }
    });
    if (correctZones <= 0) {
        valid = false;
        hintViewer.innerText = `برجاء تحديد على الاقل منطقة واحدة صحيحة`;
    }
    return valid;
};
function validate(e) {
    // make all invalid to valid
    let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
    allInvalid.forEach((el) => el.classList.remove("invalid"));
    function isItValid(not, condition, className, msg) {
        return isValid(e, formId, hintViewer, not, condition, className, msg);
    }

    if (formType === "edit") {
        changed = true;
        submitAddBtn.classList.remove("disabled");
    }

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
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "player_image"),
            "player_image",
            "برجاء اختيار صورة اللاعب"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "enemy_image"),
            "enemy_image",
            "برجاء اختيار صورة العدو"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "tile_image"),
            "tile_image",
            "برجاء اختيار صورة مربع الخلفية"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "enemy_hit_sound"),
            "enemy_hit_sound",
            "برجاء اختيار صوت الاصتدام بالعدو"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "wrong_zone_sound"),
            "wrong_zone_sound",
            "برجاء اختيار صوت المنطقة الخطا"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "correct_zone_sound"),
            "correct_zone_sound",
            "برجاء اختيار صوت المنطقة الصحيحة"
        )
    )
        return;
    if (
        formType === "add" &&
        !isItValid(
            "",
            () => fileNotSelected(formId, "game_end_sound"),
            "game_end_sound",
            "برجاء اختيار صوت نهاية اللعبة"
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
        "randomize_zones",
        oldActivitySettings.game_screen.MazeUI.RandomizeZones
    );
    putInputValue(
        formId,
        "col_count",
        oldActivitySettings.game_screen.MazeUI.MazeTotCols
    );
    putInputValue(
        formId,
        "row_count",
        oldActivitySettings.game_screen.MazeUI.MazeTotRows
    );
    putInputValue(
        formId,
        "enemy_count",
        oldActivitySettings.game_screen.MazeUI.NumberOfEnemies
    );
    putInputValue(
        formId,
        "enemy_speed",
        oldActivitySettings.game_screen.MazeUI.enemySpeedmSec
    );
}
//  handle game data -------------------------------------------------
const zonesList = document.querySelector(`#${formId} .zones-list`);
let zones = newGameData.Zones;
let maxZones = 5;
let minZones = 1;
// basic zone object to be added
const basicZone = () => ({
    col: 1,
    row: 1,
    bg_color: "#000000",
    img: "",
    isCorrect: false,
});

// used to update zones UI
function putZones() {
    let maxZonesReached = zones.length >= maxZones ? "disabled" : "";
    let minZonesReached = zones.length <= minZones ? "disabled" : "";
    zonesList.innerHTML = "";
    // put add zone btn
    zonesList.innerHTML += `
  <div class="two-inputs">
   <div class="input-group">
    <label for"maze_question" >نص السؤال للعبة</label>
    <input value="${newGameData.QuestionTxt}" id="maze_question" class="maze_question" type="text" />
   </div>
  </div>
 `;
    zonesList.innerHTML += `
  <div class="two-inputs">
   <button class="main-btn green ${maxZonesReached} add-zone-btn">
     اضافة منطفة وصول <i class="fa-solid fa-plus"></i> (${zones.length}/${maxZones})
   </button>
  </div>
 `;
    //  add zone row
    zones.forEach((zone, index) => {
        let number = index + 1;
        // check if zone is correct or not
        let correct = zone.isCorrect;
        // get img file and library id
        let imgLibraryId = zone.img_library_id;
        imgLibraryId = imgLibraryId
            ? `data-library-item-id="${imgLibraryId}"`
            : "";
        let imgGreen = zone.img ? "green" : "";

        let columnsSelect = document.querySelector(".col_count");
        let columns = [];
        for (let i = 1; i <= +columnsSelect.value; i++) columns.push(i);

        let rowsSelect = document.querySelector(".row_count");
        let rows = [];
        for (let i = 1; i <= +rowsSelect.value; i++) rows.push(i);
        // append zone row
        zonesList.innerHTML += `
    <div class="two-inputs zone-item">
      <div class="input-group small">
        <label>المنطقة ${number}</label>
        <div class="inputs line">
          <div class="input">
            <button ${imgLibraryId} data-index="${index}" class="main-btn circle ${imgGreen} library-open-btn zone-image" data-file-type="image" data-file-src="Assets/Data/images/zone-${index}">
              <i class="fa-solid fa-image"></i>
            </button>
            <button data-index="${index}" title="حذف" class="main-btn circle ${minZonesReached} red remove-zone-btn">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    <div class="input-group small">
      <label>صواب</label>
      <button data-index="${index}" data-is-correct="${correct}" class="main-btn ${
            correct ? "green" : "red"
        } circle is-correct-btn">
        <i class="fa-solid fa-${correct ? "check" : "x"}"></i>
      </button>
    </div>
      <div class="input-group">
        ${
            randomizeZones
                ? ""
                : `
        <label>العمود</label>
        <select data-index="${index}" class="column-select" >
        ${columns.map(
            (column) =>
                `<option ${
                    zone.col === +column ? "selected" : ""
                } value="${column}">${column}</option>`
        )}
        </select>
        `
        }
      </div>
      <div class="input-group">
        ${
            randomizeZones
                ? ""
                : `
        <label>الصف</label>
        <select data-index="${index}" class="row-select" >
        ${rows.map(
            (row) =>
                `<option ${
                    zone.row === +row ? "selected" : ""
                } value="${row}">${row}</option>`
        )}
        </select>
        `
        }
      </div>
    </div>
    `;
    });

    // listen to maze question input
    let mazeQuestionInput = document.querySelector(".maze_question");
    mazeQuestionInput.addEventListener("change", (e) => {
        newGameData.QuestionTxt = mazeQuestionInput.value;
        validate(e);
    });

    // listen to add zone btn
    let addZoneBtn = document.querySelector(".add-zone-btn");
    addZoneBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // maximum zones is 5
        if (zones.length >= maxZones) return;
        zones.push(basicZone());
        putZones(); // update UI
        validate(e);
    });

    // listen to remove zone btns
    let removeZoneBtns = document.querySelectorAll(".remove-zone-btn");
    removeZoneBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            // minimum zones is 2
            if (zones.length <= minZones) return;
            // detect which zone to remove
            let index = +btn.getAttribute("data-index");
            zones.splice(index, 1);
            putZones(); // update UI
            validate(e);
        })
    );
    // listen to change answer btns
    let isCorrectBtns = document.querySelectorAll(".is-correct-btn");
    isCorrectBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            // check if it was correct or not
            let correct = getBoolean(btn.getAttribute("data-is-correct"));
            // get index of zone related to btn
            let index = +btn.getAttribute("data-index");
            zones[index].isCorrect = !correct;
            putZones(); // update UI
            validate(e);
        })
    );
    // listen to col selects
    let zoneColSelects = document.querySelectorAll(".column-select");
    zoneColSelects.forEach((select) => {
        select.addEventListener("change", (e) => {
            // detect which zone to put text value
            let index = +select.getAttribute("data-index");
            // put value in zone text from select
            zones[index].col = +select.value;
        });
    });

    // listen to row selects
    let zoneRowSelects = document.querySelectorAll(".row-select");
    zoneRowSelects.forEach((select) => {
        select.addEventListener("change", (e) => {
            // detect which zone to put text value
            let index = +select.getAttribute("data-index");
            // put value in zone text from select
            zones[index].row = +select.value;
        });
    });
    listenToInputs();
    listenToAllLibraryOpenBtns();
}
// used to update every zone id to prevent wrong ids when deleting zone
// used to put imgs and sounds from btns into zones objects
function listenTozonesFilesBtns() {
    // get all image and sound buttons
    let allzonesFilesBtns = document.querySelectorAll(
        `#${formId} .zones-list .library-open-btn`
    );
    allzonesFilesBtns.forEach((btn) => {
        let index = +btn.getAttribute("data-index");
        // detect file type based on class btn has
        // get id of selected file (if exist)
        let libraryItemId = btn.getAttribute("data-library-item-id");
        // get file src of file
        let fileSrc = btn.getAttribute("data-file-src");
        // if btn has selected library item
        if (libraryItemId) {
            zones[index].img = fileSrc;
            zones[index].img_library_id = libraryItemId;
        }
    });
}
// used to listen for library open buttons if it has selected file to put them into zones array
setInterval(() => {
    listenTozonesFilesBtns();
}, 300);

let columnsSelect = document.querySelector(".col_count");
let rowsSelect = document.querySelector(".row_count");

let selects = [columnsSelect, rowsSelect];

selects.forEach((select) =>
    select.addEventListener("change", () => putZones())
);

let randomizeZonesSelect = document.querySelector(".randomize_zones");
let randomizeZones = getBoolean(randomizeZonesSelect.value);

randomizeZonesSelect.addEventListener("change", () => {
    randomizeZones = getBoolean(randomizeZonesSelect.value);
    putZones();
});

putZones();
