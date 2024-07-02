// tabs handle
console.log(libraryItems);
const chooseLibraryTab = document.querySelector(".tab.choose-tab");
const uploadLibraryTab = document.querySelector(".tab.upload-tab");

const chooseLibraryBtn = document.querySelector(".library-popup-switch.choose");
const uploadLibraryBtn = document.querySelector(".library-popup-switch.upload");
console.log(uploadLibraryBtn);
const librarySubmitBtn = document.querySelector(".library-popup-sumbit");
// switch to upload tab
uploadLibraryBtn.addEventListener("click", () => {
    librarySubmitBtn.classList.remove("hide");
    // tabs
    uploadLibraryTab.classList.remove("hide");
    chooseLibraryTab.classList.add("hide");
    // buttons
    chooseLibraryBtn.classList.remove("active");
    uploadLibraryBtn.classList.add("active");
});
// switch to choose tab
chooseLibraryBtn.addEventListener("click", () => {
    librarySubmitBtn.classList.add("hide");
    // tabs
    uploadLibraryTab.classList.add("hide");
    chooseLibraryTab.classList.remove("hide");
    // buttons
    chooseLibraryBtn.classList.add("active");
    uploadLibraryBtn.classList.remove("active");
});
// Close library popup handle -------------------------------------------------
const libraryPopup = document.querySelector(".library-popup");
// close elements
const closeLibraryPopupBtn = document.querySelector(".close-library-popup");
const libraryPopupBg = document.querySelector(".library-popup-bg");
const cancelLibraryPopupBtn = document.querySelector(
    ".library-popup-cancel-btn"
);
const allCloseLibraryBtns = [
    closeLibraryPopupBtn,
    libraryPopupBg,
    cancelLibraryPopupBtn,
];
// when any close element clicked close popup
allCloseLibraryBtns.forEach(
    (btn) => btn && btn.addEventListener("click", () => closeLibraryPopup())
);

// close popup function (hide using class name)
function closeLibraryPopup() {
    libraryPopup.classList.add("hide");
    libraryPopupBg.classList.add("hide");

    let libraryForm = document.getElementById(libraryFormId);
    if (libraryForm) libraryForm.reset();

    librarySearchInput.value = "";
    librarySearchValue = "";

    selectedCategory = "";
    libraryPopupCategoryFilter.value = "";
    updateFilteredLibraryItems();
}

// library choose cards handle -----------------------------------------------
const libraryItemsList = document.querySelector(".library-items-list");
let libraryItemsToShow = [];
let filteredLibraryItems = [];
let searchedLibraryItems = [];

function updateLibraryItemsToShow() {
    libraryItemsToShow = [...libraryItems].filter((item) => {
        // console.log(item);
        // only show files that match required file type
        if (item.item_type !== libraryFileType) return false;
        // only show files that match current activity
        let activity = item.activity_types
            ? item.activity_types.find(
                  (activity) => activity.id == curntActivityId
              )
            : undefined;
        if (!activity) return false;
        return true;
    });
    // searched list is the last list that is shown (if no search value show filtered list)
    searchedLibraryItems = [...filteredLibraryItems];
}
updateLibraryItemsToShow();
let libraryPopupCategoryFilter = document.querySelector(
    ".library-popup-category-select"
);
let selectedCategory = "";
libraryPopupCategoryFilter.addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    updateFilteredLibraryItems();
});
function updateFilteredLibraryItems() {
    let newFilteredItems = [...libraryItemsToShow];
    newFilteredItems = newFilteredItems.filter((item) => {
        if (!selectedCategory) return true;
        let exist = false;
        if (item.library_types) {
            console.log(item.library_types);
            item.library_types.forEach((category) => {
                if (category.id == selectedCategory) exist = true;
            });
        }

        return exist;
    });
    filteredLibraryItems = [...newFilteredItems];
    search();
}

// put cards in library items list
function putLibraryItems() {
    libraryItemsList.innerHTML = "";
    // if no found items to show
    if (searchedLibraryItems.length < 1) {
        // show 'No Result' Msg
        libraryItemsList.innerHTML = `<p class="no-result">لا يوجد نتائج!</p>`;
        return;
    }
    // loop over items and put cards
    searchedLibraryItems.forEach((item) => {
        let filePath = assetRoot + item.item;
        // get file type
        let foundType = fileTypes.find((type) => type.key === item.item_type);
        let fileType = foundType.fileType;
        // check if item is selected
        let selected =
            activityFormBtnToSetFileIn &&
            activityFormBtnToSetFileIn.getAttribute("data-library-item-id") ===
                item.id;
        // change file viewer based on selected file type (image, video, audio)
        let fileViewer = `<div class="${fileType}">
                           <${fileType} src="${filePath}" alt="${item.name}" controls />
                         </div>
        `;
        // put item card
        libraryItemsList.innerHTML += `
          <div class="library-item-card ${fileType} ${item.item_type}  ${
            selected ? "active" : ""
        }">
              <h3 class="name">${item.name}</h3>
              ${fileViewer}
              <p class="description">${item.description}</p>
              <button data-id="${
                  item.id
              }" class="main-btn choose-library-item-btn">اختر</button>
          </div>
          `;
    });
    // listen to select item button and run selectItem function
    let selectItemBtns = document.querySelectorAll(".choose-library-item-btn");
    selectItemBtns.forEach((btn) => btn.addEventListener("click", selectItem));
}

// Search handle --------------------------------------------------
let librarySearchInput = document.querySelector(".search-library-item-input");
let librarySearchBtn = document.querySelector(".search-library-item-btn");
let librarySearchValue = "";

// update search value from input
librarySearchInput.addEventListener(
    "change",
    () => (librarySearchValue = librarySearchInput.value)
);
// when search input change update search value
librarySearchBtn.addEventListener("click", search);
// when clicked on enter and focused on search input run search function
librarySearchInput.addEventListener(
    "keypress",
    (e) => e.key === "Enter" && search()
);
function search() {
    librarySearchValue = librarySearchInput.value;
    // search by item name and description
    searchedLibraryItems = [...filteredLibraryItems].filter((item) => {
        if (
            !have(item.name, librarySearchValue) &&
            !have(item.description, librarySearchValue)
        )
            return false;
        return true;
    });
    putLibraryItems();
}
// update file viewer in upload popup ------------------------------------------
function updateFileViewer() {
    let foundType = fileTypes.find((type) => type.key === libraryFileType);
    let imgSrc = assetRoot + "images/default/defaultImg.png";
    if (foundType) {
        // change input file accepted files
        libraryFileInput.accept = foundType.accpet;
        // remove file from input type file
        curntFileDetails.innerHTML = "";
        updateFilePreview(foundType, null, imgSrc);
    }
}
updateFileViewer();
// open library popup -----------------------------------------------------------
let activityFormBtnToSetFileIn; // used to set selected file in it

function listenToAllLibraryOpenBtns() {
    let allLibraryOpenBtns = document.querySelectorAll(".library-open-btn");
    // when any btn clicked (show library popup to select item)
    allLibraryOpenBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openLibraryPopup(btn);
        });
    });
}
listenToAllLibraryOpenBtns();

function openLibraryPopup(btn) {
    // get file type from button element
    let fileType = btn.getAttribute("data-file-type");
    let foundType = fileTypes.find((type) => type.key === libraryFileType);
    // update library file type
    libraryFileType = fileType;
    // get items that has same type as clicked btn (image, audio, background, video, gif)
    updateLibraryItemsToShow();
    updateFilteredLibraryItems();
    // update current clicked buttom
    activityFormBtnToSetFileIn = btn;
    // update file viewer in upload file tab (show video if selected type is video, etc..)
    updateFileViewer(foundType);
    // update UI cards
    putLibraryItems();
    // show popup and dark background
    libraryPopupBg.classList.remove("hide");
    libraryPopup.classList.remove("hide");
    // show which type is currently selected next to popup title
    let fileTypeViewer = document.querySelector(".file-type-view");
    if (fileTypeViewer) fileTypeViewer.innerText = `(${foundType.name})`;
}
// select item from library ----------------------------------------------------
function selectItem(e) {
    console.log(e);
    // get item id
    let id = e.currentTarget.getAttribute("data-id");
    // get item object using id
    let foundItem = libraryItems.find((item) => item.id == id);
    if (!foundItem) return;
    // close popup after selecting item
    closeLibraryPopup();
    // put selected item data in clicked button (item id, file src)
    if (activityFormBtnToSetFileIn) {
        activityFormBtnToSetFileIn.setAttribute(
            "data-library-item-id",
            foundItem.id
        );
        activityFormBtnToSetFileIn.title = `الملف المختار: ${foundItem.name}`;
        // make selected button green to know that it has file selected
        activityFormBtnToSetFileIn.classList.add("green");
        validate(e);
    }
}
updateFilteredLibraryItems();
putLibraryItems();
