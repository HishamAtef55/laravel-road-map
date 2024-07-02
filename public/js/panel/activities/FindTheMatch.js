const instructionDescriptionsList = document.querySelector(
    ".instruction-descriptions-list"
);
let formId = "FindTheMatchForm";
let hintViewer = document.querySelector(`#${formId} .hint-viewer`);

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

let questionsList = document.querySelector(".questions-list");
function handleQuestions() {
    questionsList.innerHTML = "";
    questions.forEach((question, index) => {
        // get question image and sound file src and put them into select file btn
        let questionImgId = "";
        let questionSoundId = "";

        if (question.imgLibraryItemId)
            questionImgId = `data-library-item-id="${question.imgLibraryItemId}"`;
        if (question.soundLibraryItemId)
            questionSoundId = `data-library-item-id="${question.soundLibraryItemId}"`;

        let questionImgActive = questionImgId ? "green" : "";
        let questionSoundActive = questionSoundId ? "green" : "";

        let number = index + 1;
        questionsList.innerHTML += `
    ${number !== 1 ? "<hr/>" : ""} 
    <div class="two-inputs">
      <!-- question -->
      <div class="input-group">
        <label for="question_${number}"> السؤال ${number} (بحد اقصى 15 سؤال)</label>
        <div class="inputs line">
          <div class="input">
            <input value="${
                question.Q_txt
            }" data-index="${index}" id="question_${number}" class="question-input" type="text" data-name="question_${number}" />
            <div class="buttons">
              <button title="اضافة سؤال" class="main-btn circle add_question"><i class="fa-solid fa-plus"></i></button>
              <button data-index="${index}" title="حذف السؤال" class="main-btn red circle remove_question"><i class="fa-solid fa-x"></i></button>
              <!-- question image -->
              <button ${questionImgId} data-index="${index}" class="main-btn ${questionImgActive} circle library-open-btn" data-file-type="image"><i class="fa-solid fa-image"></i></button>
              <!-- question audio -->
              <button ${questionSoundId} data-index="${index}" class="main-btn ${questionSoundActive} circle library-open-btn" data-file-type="sound_effect"><i class="fa-solid fa-volume-low"></i></button>
            </div> 
          </div>
        </div>
      </div>
    </div>
    <div class="two-inputs">
    <!-- answers -->
    <div class="input-group">
      <label for="answer_1"> الاجابات / الاختيارات (بحد اقصى 5)</label>
      <div class="inputs answers_${number}"></div>
    </div>
  </div>
  
    `;
    });

    questions.forEach((question, index) => {
        let number = index + 1;
        let answerBox = document.querySelector(`.answers_${number}`);
        question.Answers.forEach((answer, answerIndex) => {
            // get answer image and sound file src and put them into select file btn
            let answerImgId = "";
            let answerSoundId = "";

            if (answer.imgLibraryItemId)
                answerImgId = `data-library-item-id="${answer.imgLibraryItemId}"`;
            if (answer.soundLibraryItemId)
                answerSoundId = `data-library-item-id="${answer.soundLibraryItemId}"`;

            let answerImgActive = answerImgId ? "green" : "";
            let answerSoundActive = answerSoundId ? "green" : "";

            let answerNumber = answerIndex + 1;
            answerBox.innerHTML += `
      <div class="input">
        <input data-question-index="${index}" data-answer-index="${answerIndex}" value="${
                answer.A_txt
            }" id="answer_${answerNumber}" class="answer-input" type="text" data-name="answer_${answerNumber}" />
        <div class="buttons">
          <button data-question-index="${index}" data-answer-index="${answerIndex}" title="الاجابة الصحيحة" class="main-btn correct_answer ${
                answer.Is_correct ? "green" : "gray"
            } circle"><i class="fa-solid fa-check"></i></button>
          <button data-question-index="${index}" title="اضافة اجابة" class="main-btn circle add_answer"><i class="fa-solid fa-plus"></i></button>
          <button data-question-index="${index}" data-answer-index="${answerIndex}" title="حذف الاجابة" class="main-btn red circle remove_answer"><i class="fa-solid fa-x"></i></button>
          <!-- Answer image -->
          <button ${answerImgId} data-question-index="${index}" data-answer-index="${answerIndex}" class="main-btn ${answerImgActive} circle library-open-btn" data-file-type="image"><i class="fa-solid fa-image"></i></button>
          <!-- Answer audio -->
          <button ${answerSoundId} data-question-index="${index}" data-answer-index="${answerIndex}" class="main-btn ${answerSoundActive} circle library-open-btn" data-file-type="sound_effect"><i class="fa-solid fa-volume-low"></i></button>
        </div>
      </div>
      `;
        });
    });
    listenToInputs();
    // listen to add question button
    const updateQuestionIds = () =>
        (questions = questions.map((q, i) => ({ ...q, QID: `${i + 1}` })));
    let addQuestionBtns = document.querySelectorAll(".add_question");
    addQuestionBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (questions.length >= 15) return;
            questions.push({
                QID: "",
                Q_txt: "",
                Q_img: "",
                Q_snd: "",
                Answers: [
                    {
                        Is_correct: true,
                        A_txt: "",
                        A_img: "",
                        A_snd: "",
                    },
                    {
                        Is_correct: false,
                        A_txt: "",
                        A_img: "",
                        A_snd: "",
                    },
                ],
            });
            updateQuestionIds();
            handleQuestions();
        })
    );
    // listen to remove question button
    let removeQuestionBtns = document.querySelectorAll(".remove_question");
    removeQuestionBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            let removeIndex = btn.getAttribute("data-index");
            e.preventDefault();
            if (questions.length < 2) return;
            questions = questions.filter(
                (question, index) => index !== +removeIndex
            );
            updateQuestionIds();
            handleQuestions();
        })
    );
    // listen to add answer button
    let addAnswerBtns = document.querySelectorAll(".add_answer");
    addAnswerBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let index = +btn.getAttribute("data-question-index");
            if (questions[index].Answers.length >= 5) return;
            questions[index].Answers.push({
                Is_correct: false,
                A_txt: "",
                A_img: "",
                A_snd: "",
            });
            handleQuestions();
        })
    );
    // listen to remove answer button
    let removeAnswerBtns = document.querySelectorAll(".remove_answer");
    removeAnswerBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let questionIndex = +btn.getAttribute("data-question-index");
            let answerIndex = +btn.getAttribute("data-answer-index");
            if (questions[questionIndex].Answers.length <= 2) return;
            let removedCorrect = false;
            if (questions[questionIndex].Answers[answerIndex].Is_correct)
                removedCorrect = true;
            questions[questionIndex].Answers = questions[
                questionIndex
            ].Answers.filter((answer, ansIndex) => ansIndex !== answerIndex);
            if (removedCorrect)
                questions[questionIndex].Answers[0].Is_correct = true;
            handleQuestions();
        })
    );
    // listen to make correct answer button
    let correctAnswerBtns = document.querySelectorAll(".correct_answer");
    correctAnswerBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let questionIndex = +btn.getAttribute("data-question-index");
            let answerIndex = +btn.getAttribute("data-answer-index");
            questions[questionIndex].Answers.forEach(
                (answer) => (answer.Is_correct = false)
            );
            questions[questionIndex].Answers[answerIndex].Is_correct = true;
            handleQuestions();
        })
    );
    // listen to question inputs change
    let questionInputs = document.querySelectorAll(".question-input");
    questionInputs.forEach((input) =>
        input.addEventListener("change", (e) => {
            let index = +input.getAttribute("data-index");
            questions[index].Q_txt = input.value;
        })
    );
    // listen to answer inputs change
    let answerInputs = document.querySelectorAll(".answer-input");
    answerInputs.forEach((input) =>
        input.addEventListener("change", (e) => {
            let questionIndex = +input.getAttribute("data-question-index");
            let answerIndex = +input.getAttribute("data-answer-index");
            questions[questionIndex].Answers[answerIndex].A_txt = input.value;
        })
    );
    listenToAllLibraryOpenBtns();
}
handleQuestions();
// function to get data from every question or answer file select btn and put its file src and id in questions array
function getItemFiles(item, index, answerIndex) {
    let attributes =
        answerIndex || answerIndex === 0
            ? `[data-question-index="${`${index}`}"][data-answer-index="${`${answerIndex}`}"]`
            : `[data-index="${`${index}`}"]`;
    let isQuestion = answerIndex || answerIndex === 0 ? false : true;
    // get image btn element
    let itemImgBtn = document.querySelector(
        `#${formId} .library-open-btn${attributes}[data-file-type="image"]`
    );
    if (!itemImgBtn) return;
    // get image id from element
    let imgLibraryItemId = itemImgBtn.getAttribute("data-library-item-id");
    if (imgLibraryItemId) item.imgLibraryItemId = imgLibraryItemId;
    // get sound btn element
    let itemSoundBtn = document.querySelector(
        `#${formId} .library-open-btn${attributes}[data-file-type="sound_effect"]`
    );
    if (!itemSoundBtn) return;
    // get sound id from element
    let soundLibraryItemId = itemSoundBtn.getAttribute("data-library-item-id");
    if (soundLibraryItemId) item.soundLibraryItemId = soundLibraryItemId;
    // put item img and sound src
    if (isQuestion) {
        if (imgLibraryItemId) {
            item.Q_img = `Assets/Data/images/question-${index}.png`;
            itemImgBtn.setAttribute("data-file-src", item.Q_img);
        }
        if (soundLibraryItemId) {
            item.Q_snd = `Assets/Data/audio/question-${index}.mp3`;
            itemSoundBtn.setAttribute("data-file-src", item.Q_snd);
        }
    } else {
        if (imgLibraryItemId) {
            item.A_img = `Assets/Data/images/answer-${index}-${answerIndex}.png`;
            itemImgBtn.setAttribute("data-file-src", item.A_img);
        }
        if (soundLibraryItemId) {
            item.A_snd = `Assets/Data/audio/answer-${index}-${answerIndex}.mp3`;
            itemSoundBtn.setAttribute("data-file-src", item.A_snd);
        }
    }
}
setInterval(() => {
    // update question files from file select btns
    questions.forEach((ques, i) => getItemFiles(ques, i));
    // update answers files from file select btns
    questions.forEach((ques, i) =>
        ques.Answers.forEach((ans, ansIdx) => getItemFiles(ans, i, ansIdx))
    );
}, 500);
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
        data.Questions = [...questions];

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

function questionIsEmpty(e) {
    let questionIsEmpty = false;
    let answerIsEmpty = false;
    questions.forEach((question, qIndex) => {
        let element = document.querySelector(
            `#${formId} .question-input[data-index="${qIndex}"]`
        );
        if (!question.Q_txt && !question.Q_img && !question.Q_snd) {
            questionIsEmpty = true;
            element.classList.add("invalid");
            element.classList.remove("valid");
            if (e.currentTarget.type === "submit") e.preventDefault();
            hintViewer.innerHTML = `برجاء كتابة السؤال ${
                qIndex + 1
            } او رفع صورة او صوت`;
        } else {
            element.classList.remove("invalid");
            element.classList.add("valid");
            hintViewer.innerHTML = "";
        }
        question.Answers.forEach((answer, aIndex) => {
            let answerElement = document.querySelector(
                `#${formId} .answer-input[data-question-index="${qIndex}"][data-answer-index="${aIndex}"]`
            );
            if (!answer.A_txt && !answer.A_img && !answer.A_snd) {
                answerIsEmpty = true;
                answerElement.classList.add("invalid");
                answerElement.classList.remove("valid");
                hintViewer.innerHTML = `برجاء كتابة الاجابة ${
                    aIndex + 1
                } فى السؤال ${qIndex + 1} او رفع صورة او صوت`;
            } else {
                answerElement.classList.remove("invalid");
                answerElement.classList.add("valid");
                hintViewer.innerHTML = "";
            }
        });
    });
    return questionIsEmpty || answerIsEmpty;
}

const introVideoNotSelected = () =>
    getBoolean(getInputValue(formId, "intro_active")) &&
    fileNotSelected(formId, "intro_video") &&
    formType === "add";

function validate(e) {
    // make all invalid to valid
    let allInvalid = document.querySelectorAll(`#${formId} .invalid`);
    allInvalid.forEach((el) => el.classList.remove("invalid"));
    function isItValid(not, condition, className, msg) {
        return isValid(e, formId, hintViewer, not, condition, className, msg);
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
    if (questionIsEmpty(e)) return;
    return true;
}

// put inputs values in edit form
if (formType === "edit") {
    console.log(oldActivitySettings);
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
}
