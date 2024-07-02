const instructionDescriptionsList = document.querySelector(
    ".instruction-descriptions-list"
);
let formId = "StoryForm";
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
let minScenes = 1;
let maxScenes = 5;

let maxQuestions = 10;

let maxAnswers = 5;
let minAnswers = 2;

fonts.forEach((font) => {
    selectFont.forEach(
        (select) =>
            (select.innerHTML += `<option style="font-family: ${font}" value=${font} >${font}</option>`)
    );
});

const basicScene = () => ({
    SceneID: "3",
    SceneTitle: "",
    SceneTxt: "",
    SceneImg: "",
    SceneSnd: "",
    SceneVid: "Assets/Data/vedio/scene3.mp4",
    videoOrImage: "image",
    SceneQ: [],
});

const basicQuestion = () => ({
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
const basicAnswer = () => ({
    Is_correct: false,
    A_txt: "",
    A_img: "",
    A_snd: "",
});

let scenesList = document.querySelector(".scenes-list");
let scenes = newGameData.Scenes;
function handleQuestions() {
    let reachedMinScenes = scenes.length <= minScenes ? "disabled" : "";
    let reachedMaxScenes = scenes.length >= maxScenes ? "disabled" : "";

    scenesList.innerHTML = "";
    scenesList.innerHTML += `
  <div class="two-inputs">
    <!-- question -->
    <div class="input-group smaller">
      <button class="main-btn green ${reachedMaxScenes} add-scene-btn">اضافة مشهد <i class="fa-solid fa-plus"></i> (${scenes.length}/${maxScenes})</button>
    </div>
  </div>
  `;

    scenes.forEach((scene, sceneIndex) => {
        let sceneNumber = sceneIndex + 1;
        let sceneIndexs = `data-scene-index="${sceneIndex}"`;
        if (formType === "add" && !scene.videoOrImage)
            scene.videoOrImage = "image";
        if (formType === "edit" && !scene.videoOrImage) {
            if (scene.SceneVid) scene.videoOrImage = "video";
            if (scene.SceneImg) scene.videoOrImage = "image";
        }

        let videoSelected = scene.videoOrImage === "video";
        let imageSelected = scene.videoOrImage === "image";

        let sceneImage = scene.SceneImg ? "green" : "";
        let sceneImageId = scene.SceneImgLibraryId
            ? `data-library-item-id="${scene.SceneImgLibraryId}"`
            : "";
        let sceneAudio = scene.SceneSnd ? "green" : "";
        let sceneAudioId = scene.SceneSndLibraryId
            ? `data-library-item-id="${scene.SceneSndLibraryId}"`
            : "";
        let sceneVideo = scene.SceneVid ? "green" : "";
        let sceneVideoId = scene.SceneVidLibraryId
            ? `data-library-item-id="${scene.SceneVidLibraryId}"`
            : "";

        let reachedMaxQuestions =
            scene.SceneQ.length >= maxQuestions ? "disabled" : "";

        // scene item
        scenesList.innerHTML += `
      <div class="scene-item">
        <div class="two-inputs">
          <div class="input-group smaller">
            <h4>المشهد ${sceneNumber}</h4>
          </div>
        </div>
        <div class="two-inputs">
          <!-- question -->
          <div class="input-group">
            <label for="question_${sceneNumber}">عنوان المشهد</label>
            <div class="inputs line">
              <div class="input">
                <input ${sceneIndexs} value="${
            scene.SceneTitle
        }" class="scene-title-input" type="text" />
                <div class="buttons">
                <button ${sceneIndexs} class="main-btn red ${reachedMinScenes} remove-scene-btn">حذف المشهد</button>
                </div> 
              </div>
            </div>
          </div>
        </div>
        <div class="two-inputs">
          <div class="input-group">
            <label>نص المشهد</label>
            <div class="inputs line">
              <div class="input small-textarea">
                <textarea ${sceneIndexs} value="${
            scene.SceneTitle
        }" class="scene-text-input" type="text" >${scene.SceneTxt}</textarea>
                <div class="buttons">
                <div class="checkbox-group">
                  <label for="scene-video-${sceneIndex}">فيديو</label>
                  <input ${sceneIndexs} ${
            videoSelected ? "checked" : ""
        } id="scene-video-${sceneIndex}" class="video-or-image" value="video" type="checkbox"/>
                </div>
                ${
                    videoSelected
                        ? `
                <!-- scene video -->
                <button ${sceneIndexs} ${sceneVideoId} title="اختر فيديو" class="main-btn circle ${sceneVideo} library-open-btn scene-video" data-file-type="video" data-file-src="Assets/Data/vedio/scene-${sceneIndex}" ><i class="fa-solid fa-film"></i></button>
                `
                        : ""
                }
                <div class="checkbox-group">
                  <label for="scene-image-${sceneIndex}">صورة وصوت</label>
                  <input ${sceneIndexs} ${
            imageSelected ? "checked" : ""
        } id="scene-image-${sceneIndex}" class="video-or-image" value="image" type="checkbox"/>
                </div>

                ${
                    imageSelected
                        ? `
                <!-- scene image -->
                <button ${sceneIndexs} ${sceneImageId} title="اختر صورة" class="main-btn circle ${sceneImage} library-open-btn scene-image" data-file-type="image" data-file-src="Assets/Data/images/scene-${sceneIndex}" ><i class="fa-solid fa-image"></i></button>
                <!-- scene audio -->
                <button ${sceneIndexs} ${sceneAudioId} title="اختر صوت" class="main-btn circle ${sceneAudio} library-open-btn scene-audio" data-file-type="sound_effect" data-file-src="Assets/Data/audio/scene-${sceneIndex}" ><i class="fa-solid fa-volume-low"></i></button>
                `
                        : ""
                }
                </div> 
              </div>
            </div>
          </div>
        </div>
        <hr/>
        <!-- scene questions -->
        <div class="two-inputs">
          <div class="input-group smaller">
            <h4>اسئلة واجابات المشهد ${sceneNumber}</h4>
          </div>
        </div>
        <!-- scene add question btn -->
        <div class="two-inputs">
          <div class="input-group smaller">
            <button data-scene-index="${sceneIndex}" class="main-btn green ${reachedMaxQuestions} add-question-btn">اضافة سؤال <i class="fa-solid fa-plus"></i> (${
            scene.SceneQ.length
        }/${maxQuestions})</button>
          </div>
        </div>
        ${scene.SceneQ.map((question, questionIndex) => {
            // get question image and sound file src and put them into select file btn

            let questionImg = question.Q_img ? "green" : "";
            let questionImgId = question.QuestionImgLibraryId
                ? `data-library-item-id="${question.QuestionImgLibraryId}"`
                : "";
            let questionSound = question.Q_snd ? "green" : "";
            let questionSoundId = question.QuestionSndLibraryId
                ? `data-library-item-id="${question.QuestionSndLibraryId}"`
                : "";

            let questionNumber = questionIndex + 1;
            let questionIndexs = `data-scene-index="${sceneIndex}" data-question-index="${questionIndex}"`;

            let reachedMaxAnswers =
                question.Answers.length >= maxAnswers ? "disabled" : "";
            let reachedMinAnswers =
                question.Answers.length <= minAnswers ? "disabled" : "";

            return `
        
          <div class="two-inputs">
            <!-- question -->
            <div class="input-group">
              <label for="question_${questionNumber}">السؤال ${questionNumber} - المشهد ${sceneNumber}</label>
              <div class="inputs line">
                <div class="input">
                  <input ${questionIndexs} value="${
                question.Q_txt
            }" class="question-input" type="text" />
                  <div class="buttons">
                    <button ${questionIndexs} title="حذف السؤال" class="main-btn red circle remove-question-btn"><i class="fa-solid fa-x"></i></button>
                    <!-- question image -->
                    <button ${questionIndexs} title="اختر صورة" ${questionImgId}  class="main-btn ${questionImg} circle library-open-btn question-image" data-file-type="image" data-file-src="Assets/Data/images/scene-${sceneIndex}-question-${questionIndex}" ><i class="fa-solid fa-image"></i></button>
                    <!-- question audio -->
                    <button ${questionIndexs} title="اختر صوت" ${questionSoundId}  class="main-btn ${questionSound} circle library-open-btn question-audio" data-file-type="sound_effect" data-file-src="Assets/Data/audio/scene-${sceneIndex}-question-${questionIndex}" ><i class="fa-solid fa-volume-low"></i></button>
                  </div> 
                </div>
              </div>
            </div>
          </div>
          <div class="two-inputs">
            <!-- answers -->
            <div class="input-group">
              <label for="answer_1"> الاجابات / الاختيارات (بحد اقصى 5)</label>
              <div class="inputs answers_${questionNumber}">
              
              ${question.Answers.map((answer, answerIndex) => {
                  // get answer image and sound file src and put them into select file btn

                  let answerImg = answer.A_img ? "green" : "";
                  let answerImgId = answer.AnswerImgLibraryId
                      ? `data-library-item-id="${answer.AnswerImgLibraryId}"`
                      : "";
                  let answerSound = answer.A_snd ? "green" : "";
                  let answerSoundId = answer.AnswerSndLibraryId
                      ? `data-library-item-id="${answer.AnswerSndLibraryId}"`
                      : "";

                  let answerCorrect = answer.Is_correct ? "green" : "gray";
                  let answerIndexs = `data-scene-index="${sceneIndex}" data-question-index="${questionIndex}" data-answer-index="${answerIndex}"`;

                  return `
                  <div class="input">
                    <input ${answerIndexs} value="${answer.A_txt}" class="answer-input" type="text" />
                    <div class="buttons">
                      <button ${answerIndexs} title="الاجابة الصحيحة" class="main-btn correct-answer-btn ${answerCorrect} circle"><i class="fa-solid fa-check"></i></button>
        
                      <button ${answerIndexs} title="حذف الاجابة" class="main-btn red circle ${reachedMinAnswers} remove-answer-btn"><i class="fa-solid fa-x"></i></button>
                      <!-- Answer image -->
                      <button ${answerIndexs} title="اختر صورة" ${answerImgId}  class="main-btn ${answerImg} circle library-open-btn answer-image" data-file-type="image" data-file-src="Assets/Data/images/scene-${sceneIndex}-question-${questionIndex}-answer-${answerIndex}" ><i class="fa-solid fa-image"></i></button>
                      <!-- Answer audio -->
                      <button ${answerIndexs} title="اختر صوت" ${answerSoundId}  class="main-btn ${answerSound} circle library-open-btn answer-audio" data-file-type="sound_effect" data-file-src="Assets/Data/audio/scene-${sceneIndex}-question-${questionIndex}-answer-${answerIndex}" ><i class="fa-solid fa-volume-low"></i></button>
                    </div>
                  </div>
                `;
              }).join("")}
              <div class="two-inputs">
                <!-- question -->
                <div class="input-group smaller">
                  <button ${questionIndexs} class="main-btn green ${reachedMaxAnswers} add-answer-btn">اضافة اجابة <i class="fa-solid fa-plus"></i> (${
                question.Answers.length
            }/${maxAnswers})</button>
                </div>
              </div>
              </div>
            </div>
          </div>
          `;
        }).join("")}
      </div>
      <hr class="bold-hr"/>
    `;
    });

    listenToInputs();
    const updateQuestionIds = () =>
        (scenes = scenes.map((scene, i) => ({
            ...scene,
            SceneID: `${i + 1}`,
            SceneQ: scene.SceneQ.map((question, qi) => ({
                ...question,
                QID: `${qi + 1}`,
            })),
        })));
    // listen to add scene button
    let addSceneBtn = document.querySelector(".add-scene-btn");
    addSceneBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (scenes.length >= 15) return;
        scenes.push(basicScene());
        updateQuestionIds();
        handleQuestions();
    });
    // listen to add question button
    let addQuestionBtns = document.querySelectorAll(".add-question-btn");
    addQuestionBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let sceneIndex = btn.getAttribute("data-scene-index");
            if (scenes[sceneIndex].SceneQ.length >= maxQuestions) return;
            scenes[sceneIndex].SceneQ.push(basicQuestion());
            updateQuestionIds();
            handleQuestions();
            validate(e);
        })
    );
    // listen to add answer button
    let addAnswerBtns = document.querySelectorAll(".add-answer-btn");
    addAnswerBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let sceneIndex = +btn.getAttribute("data-scene-index");
            let questionIndex = +btn.getAttribute("data-question-index");
            if (
                scenes[sceneIndex].SceneQ[questionIndex].Answers.length >=
                maxAnswers
            )
                return;
            scenes[sceneIndex].SceneQ[questionIndex].Answers.push(
                basicAnswer()
            );
            handleQuestions();
            validate(e);
        })
    );
    // listen to remove scene button
    let removeSceneBtns = document.querySelectorAll(".remove-scene-btn");
    removeSceneBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let sceneIndex = +btn.getAttribute("data-scene-index");
            if (scenes.length <= minScenes) return;
            scenes = scenes.filter((q, index) => index !== sceneIndex);
            updateQuestionIds();
            handleQuestions();
            validate(e);
        })
    );
    // listen to remove question button
    let removeQuestionBtns = document.querySelectorAll(".remove-question-btn");
    removeQuestionBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let sceneIndex = btn.getAttribute("data-scene-index");
            let questionIndex = btn.getAttribute("data-question-index");
            scenes[sceneIndex].SceneQ = scenes[sceneIndex].SceneQ.filter(
                (q, index) => index !== +questionIndex
            );
            updateQuestionIds();
            handleQuestions();
            validate(e);
        })
    );
    // listen to add question button
    let videoOrImageInputs = document.querySelectorAll(".video-or-image");
    videoOrImageInputs.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let sceneIndex = btn.getAttribute("data-scene-index");
            scenes[sceneIndex].videoOrImage = btn.value;
            if (btn.value === "image") {
                scenes[sceneIndex].SceneImg = "";
                delete scenes[sceneIndex].SceneImgLibraryId;
                scenes[sceneIndex].SceneSnd = "";
                delete scenes[sceneIndex].SceneSndLibraryId;
            }
            if (btn.value === "video") {
                scenes[sceneIndex].SceneVid = "";
                delete scenes[sceneIndex].SceneVidLibraryId;
            }
            updateQuestionIds();
            handleQuestions();
            validate(e);
        })
    );
    // listen to remove answer button
    let removeAnswerBtns = document.querySelectorAll(".remove-answer-btn");
    removeAnswerBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let sceneIndex = +btn.getAttribute("data-scene-index");
            let questionIndex = +btn.getAttribute("data-question-index");
            let answerIndex = +btn.getAttribute("data-answer-index");
            if (
                scenes[sceneIndex].SceneQ[questionIndex].Answers.length <=
                minAnswers
            )
                return;
            let removedCorrect = false;
            if (
                scenes[sceneIndex].SceneQ[questionIndex].Answers[answerIndex]
                    .Is_correct
            )
                removedCorrect = true;
            scenes[sceneIndex].SceneQ[questionIndex].Answers = scenes[
                sceneIndex
            ].SceneQ[questionIndex].Answers.filter(
                (answer, ansIndex) => ansIndex !== answerIndex
            );
            if (removedCorrect)
                scenes[sceneIndex].SceneQ[
                    questionIndex
                ].Answers[0].Is_correct = true;
            handleQuestions();
            validate(e);
        })
    );
    // listen to make correct answer button
    let correctAnswerBtns = document.querySelectorAll(".correct-answer-btn");
    correctAnswerBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let sceneIndex = +btn.getAttribute("data-scene-index");
            let questionIndex = +btn.getAttribute("data-question-index");
            let answerIndex = +btn.getAttribute("data-answer-index");
            scenes[sceneIndex].SceneQ[questionIndex].Answers.forEach(
                (answer) => (answer.Is_correct = false)
            );
            scenes[sceneIndex].SceneQ[questionIndex].Answers[
                answerIndex
            ].Is_correct = true;
            handleQuestions();
            validate(e);
        })
    );
    // listen to scene title inputs change
    let sceneTitleInputs = document.querySelectorAll(".scene-title-input");
    sceneTitleInputs.forEach((input) =>
        input.addEventListener("change", (e) => {
            let index = +input.getAttribute("data-scene-index");
            scenes[index].SceneTitle = input.value;
            validate(e);
        })
    );
    // listen to scene text inputs change
    let sceneTextInputs = document.querySelectorAll(".scene-text-input");
    sceneTextInputs.forEach((input) =>
        input.addEventListener("change", (e) => {
            let index = +input.getAttribute("data-scene-index");
            scenes[index].SceneTxt = input.value;
            validate(e);
        })
    );
    // listen to question inputs change
    let questionInputs = document.querySelectorAll(".question-input");
    questionInputs.forEach((input) =>
        input.addEventListener("change", (e) => {
            let sceneIndex = +input.getAttribute("data-scene-index");
            let questionIndex = +input.getAttribute("data-question-index");
            scenes[sceneIndex].SceneQ[questionIndex].Q_txt = input.value;
            validate(e);
        })
    );
    // listen to answer inputs change
    let answerInputs = document.querySelectorAll(".answer-input");
    answerInputs.forEach((input) =>
        input.addEventListener("change", (e) => {
            let sceneIndex = +input.getAttribute("data-scene-index");
            let questionIndex = +input.getAttribute("data-question-index");
            let answerIndex = +input.getAttribute("data-answer-index");
            scenes[sceneIndex].SceneQ[questionIndex].Answers[
                answerIndex
            ].A_txt = input.value;
            validate(e);
        })
    );
    listenToInputs();
    listenToAllLibraryOpenBtns();
}
handleQuestions();
// function to get data from every question or answer file select btn and put its file src and id in questions array
function handleScenesFiles() {
    let allSceneVideoBtns = document.querySelectorAll(
        ".library-open-btn.scene-video"
    );
    allSceneVideoBtns.forEach((btn) => {
        let sceneIndex = +btn.getAttribute("data-scene-index");
        let libraryItemId = btn.getAttribute("data-library-item-id");
        let fileSrc = btn.getAttribute("data-file-src");
        if (!libraryItemId) return;
        scenes[sceneIndex].SceneVid = fileSrc;
        scenes[sceneIndex].SceneVidLibraryId = libraryItemId;
    });

    let allSceneImageBtns = document.querySelectorAll(
        ".library-open-btn.scene-image"
    );
    allSceneImageBtns.forEach((btn) => {
        let sceneIndex = +btn.getAttribute("data-scene-index");
        let libraryItemId = btn.getAttribute("data-library-item-id");
        let fileSrc = btn.getAttribute("data-file-src");
        if (!libraryItemId) return;
        scenes[sceneIndex].SceneImg = fileSrc;
        scenes[sceneIndex].SceneImgLibraryId = libraryItemId;
    });

    let allSceneAudioBtns = document.querySelectorAll(
        ".library-open-btn.scene-audio"
    );
    allSceneAudioBtns.forEach((btn) => {
        let sceneIndex = +btn.getAttribute("data-scene-index");
        let libraryItemId = btn.getAttribute("data-library-item-id");
        let fileSrc = btn.getAttribute("data-file-src");
        if (!libraryItemId) return;
        scenes[sceneIndex].SceneSnd = fileSrc;
        scenes[sceneIndex].SceneSndLibraryId = libraryItemId;
    });

    let allQuestionImageBtns = document.querySelectorAll(
        ".library-open-btn.question-image"
    );
    allQuestionImageBtns.forEach((btn) => {
        let sceneIndex = +btn.getAttribute("data-scene-index");
        let questionIndex = +btn.getAttribute("data-question-index");
        let libraryItemId = btn.getAttribute("data-library-item-id");
        let fileSrc = btn.getAttribute("data-file-src");
        if (!libraryItemId) return;
        scenes[sceneIndex].SceneQ[questionIndex].Q_img = fileSrc;
        scenes[sceneIndex].SceneQ[questionIndex].QuestionImgLibraryId =
            libraryItemId;
    });

    let allQuestionAudioBtns = document.querySelectorAll(
        ".library-open-btn.question-audio"
    );
    allQuestionAudioBtns.forEach((btn) => {
        let sceneIndex = +btn.getAttribute("data-scene-index");
        let questionIndex = +btn.getAttribute("data-question-index");
        let libraryItemId = btn.getAttribute("data-library-item-id");
        let fileSrc = btn.getAttribute("data-file-src");
        if (!libraryItemId) return;
        scenes[sceneIndex].SceneQ[questionIndex].Q_snd = fileSrc;
        scenes[sceneIndex].SceneQ[questionIndex].QuestionSndLibraryId =
            libraryItemId;
    });

    let allAnswerImageBtns = document.querySelectorAll(
        ".library-open-btn.answer-image"
    );
    allAnswerImageBtns.forEach((btn) => {
        let sceneIndex = +btn.getAttribute("data-scene-index");
        let questionIndex = +btn.getAttribute("data-question-index");
        let answerIndex = +btn.getAttribute("data-answer-index");
        let libraryItemId = btn.getAttribute("data-library-item-id");
        let fileSrc = btn.getAttribute("data-file-src");
        if (!libraryItemId) return;
        scenes[sceneIndex].SceneQ[questionIndex].Answers[answerIndex].A_img =
            fileSrc;
        scenes[sceneIndex].SceneQ[questionIndex].Answers[
            answerIndex
        ].AnswerImgLibraryId = libraryItemId;
    });

    let allAnswerAudioBtns = document.querySelectorAll(
        ".library-open-btn.answer-audio"
    );
    allAnswerAudioBtns.forEach((btn) => {
        let sceneIndex = +btn.getAttribute("data-scene-index");
        let questionIndex = +btn.getAttribute("data-question-index");
        let answerIndex = +btn.getAttribute("data-answer-index");
        let libraryItemId = btn.getAttribute("data-library-item-id");
        let fileSrc = btn.getAttribute("data-file-src");
        if (!libraryItemId) return;
        scenes[sceneIndex].SceneQ[questionIndex].Answers[answerIndex].A_snd =
            fileSrc;
        scenes[sceneIndex].SceneQ[questionIndex].Answers[
            answerIndex
        ].AnswerSndLibraryId = libraryItemId;
    });
}
setInterval(() => {
    handleScenesFiles();
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

        // scene data handle
        settings.game_screen.StoryboardUI.AutoPlaySound = getBoolean(
            getInputValue(formId, "scene_audio_autoplay")
        );
        settings.game_screen.StoryboardUI.AutoPlayVideo = getBoolean(
            getInputValue(formId, "scene_video_autoplay")
        );
        settings.game_screen.StoryboardUI.AutoPlayQuiz = getBoolean(
            getInputValue(formId, "scene_questions_autoplay")
        );
        settings.game_screen.StoryboardUI.backgroundColor = getInputValue(
            formId,
            "scene_image_background_color"
        );

        // scene text handle
        settings.game_screen.SceneTxtUI.fontWeight = getInputValue(
            formId,
            "scene_text_font_weight"
        );
        settings.game_screen.SceneTxtUI.fontSize = `${getInputValue(
            formId,
            "scene_text_font_size"
        )}px`;
        settings.game_screen.SceneTxtUI.fontFamily = getInputValue(
            formId,
            "scene_text_font_family"
        );
        settings.game_screen.SceneTxtUI.color = getInputValue(
            formId,
            "scene_text_color"
        );
        settings.game_screen.SceneTxtUI.backgroundColor = getInputValue(
            formId,
            "scene_text_background_color"
        );

        // scene question handle
        settings.game_screen.QUI.fontWeight = getInputValue(
            formId,
            "question_font_weight"
        );
        settings.game_screen.QUI.fontSize = `${getInputValue(
            formId,
            "question_font_size"
        )}px`;
        settings.game_screen.QUI.color = getInputValue(
            formId,
            "question_color"
        );
        settings.game_screen.QUI.backgroundColor = getInputValue(
            formId,
            "question_background_color"
        );

        // scene answer handle
        settings.game_screen.AUI.fontWeight = getInputValue(
            formId,
            "answer_font_weight"
        );
        settings.game_screen.AUI.fontSize = `${getInputValue(
            formId,
            "answer_font_size"
        )}px`;
        settings.game_screen.AUI.color = getInputValue(formId, "answer_color");
        settings.game_screen.AUI.backgroundColor = getInputValue(
            formId,
            "answer_background_color"
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
        data.Scenes = scenes;

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

function gameDataIsValid() {
    let valid = true;
    scenes.forEach((scene, sceneIndex) => {
        if (!valid) return;
        let sceneNumber = sceneIndex + 1;
        let sceneTitleInput = document.querySelector(
            `.scene-title-input[data-scene-index="${sceneIndex}"]`
        );
        let sceneTextInput = document.querySelector(
            `.scene-text-input[data-scene-index="${sceneIndex}"]`
        );
        if (!scene.SceneTitle) {
            valid = false;
            sceneTitleInput.classList.add("invalid");
            sceneTitleInput.classList.remove("valid");
            hintViewer.innerText = `برجاء ادخال عنوان المشهد ${sceneNumber}`;
        } else if (scene.SceneTitle.length > 50) {
            valid = false;
            sceneTitleInput.classList.add("invalid");
            sceneTitleInput.classList.remove("valid");
            hintViewer.innerText = `الحد الاقصى لعدد حروف عنوان المشهد هو 50 حرف فى مشهد ${sceneNumber}`;
        } else if (
            (scene.videoOrImage === "image" &&
                !scene.SceneImg &&
                !scene.SceneTxt) ||
            (scene.videoOrImage === "video" &&
                !scene.SceneVid &&
                !scene.SceneTxt)
        ) {
            valid = false;
            sceneTextInput.classList.add("invalid");
            sceneTextInput.classList.remove("valid");

            hintViewer.innerText = `برجاء ادخال نص المشهد ${sceneNumber} او اختيار ملف فيديو او صورة`;
        }
        scene.SceneQ.forEach((question, questionIndex) => {
            if (!valid) return;
            let questionNumber = questionIndex + 1;
            let questionInput = document.querySelector(
                `.question-input[data-scene-index="${sceneIndex}"][data-question-index="${questionIndex}"]`
            );
            if (!question.Q_txt) {
                valid = false;
                questionInput.classList.add("invalid");
                questionInput.classList.remove("valid");
                hintViewer.innerText = `برجاء ادخال السؤال ${questionNumber} فى المشهد ${sceneNumber}`;
            }
            question.Answers.forEach((answer, answerIndex) => {
                if (!valid) return;
                let answerNumber = answerIndex + 1;
                let answerInput = document.querySelector(
                    `.answer-input[data-scene-index="${sceneIndex}"][data-question-index="${questionIndex}"][data-answer-index="${answerIndex}"]`
                );
                if (!answer.A_txt) {
                    valid = false;
                    answerInput.classList.add("invalid");
                    answerInput.classList.remove("valid");
                    hintViewer.innerText = `برجاء ادخال الاجابة ${answerNumber} فى السؤال ${questionNumber} فى المشهد ${sceneNumber}`;
                }
            });
        });
    });
    return valid;
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
            "scene_text_font_size",
            "حجم الخط يجب ان يكون بين 8 و 100 بيكسل"
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
        !isItValid(
            "not",
            fontSizeOk,
            "answer_font_size",
            "حجم الخط يجب ان يكون بين 8 و 100 بيكسل"
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
        "scene_audio_autoplay",
        oldActivitySettings.game_screen.StoryboardUI.AutoPlaySound
    );
    putInputValue(
        formId,
        "scene_video_autoplay",
        oldActivitySettings.game_screen.StoryboardUI.AutoPlayVideo
    );
    putInputValue(
        formId,
        "scene_questions_autoplay",
        oldActivitySettings.game_screen.StoryboardUI.AutoPlayQuiz
    );
    putInputValue(
        formId,
        "scene_image_background_color",
        oldActivitySettings.game_screen.StoryboardUI.backgroundColor
    );

    putInputValue(
        formId,
        "scene_text_font_weight",
        oldActivitySettings.game_screen.SceneTxtUI.fontWeight
    );
    putInputValue(
        formId,
        "scene_text_font_family",
        oldActivitySettings.game_screen.SceneTxtUI.fontFamily
    );
    putInputValue(
        formId,
        "scene_text_font_size",
        getPixelNumber(oldActivitySettings.game_screen.SceneTxtUI.fontSize)
    );
    putInputValue(
        formId,
        "scene_text_color",
        oldActivitySettings.game_screen.SceneTxtUI.color
    );
    putInputValue(
        formId,
        "scene_text_background_color",
        oldActivitySettings.game_screen.SceneTxtUI.backgroundColor
    );

    putInputValue(
        formId,
        "question_font_weight",
        oldActivitySettings.game_screen.QUI.fontWeight
    );
    putInputValue(
        formId,
        "question_font_size",
        getPixelNumber(oldActivitySettings.game_screen.QUI.fontSize)
    );
    putInputValue(
        formId,
        "question_color",
        oldActivitySettings.game_screen.QUI.color
    );
    putInputValue(
        formId,
        "question_background_color",
        oldActivitySettings.game_screen.QUI.backgroundColor
    );

    putInputValue(
        formId,
        "answer_font_weight",
        oldActivitySettings.game_screen.AUI.fontWeight
    );
    putInputValue(
        formId,
        "answer_font_size",
        getPixelNumber(oldActivitySettings.game_screen.AUI.fontSize)
    );
    putInputValue(
        formId,
        "answer_color",
        oldActivitySettings.game_screen.AUI.color
    );
    putInputValue(
        formId,
        "answer_background_color",
        oldActivitySettings.game_screen.AUI.backgroundColor
    );
}
