// this file will handle table data viewer in any page

let tableLengthSelect = document.querySelector(".table-length-select");
let tableSearchInput = document.querySelector(".search-input");
// Pagination buttons
let firstPageBtn = document.querySelector(".first-page-btn");
let previewsPageBtn = document.querySelector(".previews-page-btn");
let nextPageBtn = document.querySelector(".next-page-btn");
let lastPageBtn = document.querySelector(".last-page-btn");
// pagination text viewer
let paginationText = document.querySelector(".pagination-text");

// Filters handle ---------------------------------------------------------------
let allFilters = document.querySelectorAll(".filter-select");
allFilters.forEach((select) => {
    select.addEventListener("change", (e) => {
        // listen to all filters
        // array of new filtered list
        tableSearchInput.value = "";

        let newFilteredList = [...dataList];
        // loop again over all filter selects
        allFilters.forEach((filterSelect) => {
            // update filtered list based on every select value
            let field = filterSelect.getAttribute("data-field");
            let isObject = false;
            let isArrayOfObjects = false;
            // detect if required field is inside object
            if (field.includes(".")) {
                isObject = true;
                field = field.split(".");
            }
            if (field.includes("[{}]")) {
                isArrayOfObjects = true;
                field = field.split("[{}]");
            }

            if (filterSelect.value)
                newFilteredList = newFilteredList.filter((item) => {
                    if (isArrayOfObjects) {
                        let found = item[field[0]].find(
                            (ite) => ite[field[1]] == filterSelect.value
                        );
                        if (found) return found;
                    }
                    return isObject
                        ? item[field[0]][field[1]]
                        : item[field] == filterSelect.value;
                });
        });
        filteredList = [...newFilteredList];
        searchedList = [...filteredList];
        curntPage = 1;
        updatePaginationText(searchedList);
        updateMaximumPages(searchedList);
        putList();
    });
});
// Pagination handle -----------------------------------------------------------
function updatePaginationText(searchedList) {
    let dataLength = searchedList.length;
    let firstItem = curntPage * tableLength - (tableLength - 1);
    let lastItem = firstItem + (tableLength - 1);
    // check if reached last page replace last number with data length
    if (lastItem > dataLength) lastItem = dataLength;
    paginationText.innerHTML = `${lastItem}-${firstItem} من ${dataLength} - الصفحة ${curntPage}`;
}
// update table grid style
function updateGrid(grid) {
    let gridString = "";
    grid.forEach((item) => (gridString += `${item} `));
    let dataRows = document.querySelectorAll(".data-row");
    dataRows.forEach((row) => (row.style.gridTemplateColumns = gridString));
}
function getPrintGrid() {
    // remove checkbox and controls items when printing
    return [...grid]
        .filter((t, i) => i !== 1)
        .filter((t, i) => i !== grid.length - 2);
}
// update table max pages based on list length
function updateMaximumPages(searchedList) {
    maximummPages = Math.ceil(searchedList.length / tableLength);
}

// change table length to show
if (tableLengthSelect) {
    tableLengthSelect.addEventListener("change", (e) => {
        tableLength = +e.target.value;
        curntPage = 1;
        putList();
        updateMaximumPages(searchedList);
        updatePaginationText(searchedList);
    });
}

// update page based on pagination button clicked
function updatePage(btn) {
    // to next page
    if (btn === "next") {
        if (curntPage >= maximummPages) return;
        curntPage += 1;
    }
    // to previews page
    if (btn === "previews") {
        if (curntPage <= 1) return;
        curntPage -= 1;
    }
    // to first page
    if (btn === "first") curntPage = 1;
    // to last page
    if (btn === "last") curntPage = maximummPages;
    // refresh viewed list and pagination text
    updatePaginationText(searchedList);
    updatePageBtns();
    putPaginationPages();
    putList();
}

function updatePageBtns() {
    let paginationPageBtns = document.querySelectorAll(".pagination-page-btn");
    if (paginationPageBtns)
        paginationPageBtns.forEach((button) => {
            let page = +button.getAttribute("data-page");
            if (page === curntPage) button.classList.add("active");
            else button.classList.remove("active");
        });
}
// Pagination buttons listen
nextPageBtn.addEventListener("click", () => updatePage("next"));
previewsPageBtn.addEventListener("click", () => updatePage("previews"));
firstPageBtn.addEventListener("click", () => updatePage("first"));
lastPageBtn.addEventListener("click", () => updatePage("last"));
function putPaginationPages() {
    let paginationPages = document.querySelector(".pagination-pages");
    if (paginationPages) {
        paginationPages.innerHTML = "";
        let maxReached = false;
        for (let i = curntPage - 1; i <= maximummPages; i++) {
            if (i >= curntPage + 5) {
                if (!maxReached) {
                    paginationPages.innerHTML += `
          <button class="pagination-btn ${
              i === curntPage ? "active" : ""
          }">...</button>
          `;
                    maxReached = true;
                }
            } else {
                if (i > 0) {
                    paginationPages.innerHTML += `
        <button data-page="${i}" title="الصفحة ${i}" class="pagination-btn pagination-page-btn ${
                        i === curntPage ? "active" : ""
                    }">${i}</button>
        `;
                }
            }
        }
        let paginationPageBtns = document.querySelectorAll(
            ".pagination-page-btn"
        );
        paginationPageBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                let pageNumber = +btn.getAttribute("data-page");
                curntPage = pageNumber;
                updatePaginationText(searchedList);
                updatePageBtns();
                putPaginationPages();
                putList();
            });
        });
    }
}
// print handle -----------------------------------------------------------
// function will run when print start and end
function whenPrint(action) {
    let display = action === "print" ? "none" : "flex";
    let newGrid = action === "print" ? printGrid : grid;
    let newTableLength = action === "print" ? 100000 : 5;
    // show all data list in table
    tableLength = newTableLength;
    // change value of table length select
    if (tableLengthSelect) tableLengthSelect.value = newTableLength;
    // if there are selected items print only selected
    if (selectedItems.length) {
        if (action === "print") {
            let newList = [];
            dataList.forEach((item) => {
                let selected = selectedItems.find((id) => id == item.id);
                if (selected) newList.push(item);
            });
            searchedList = [...newList];
        } else searchedList = [...filteredList];
    }
    curntPage = 1;
    updatePage();
    // get all checkboes and change display
    let allCheckboxesItems = document.querySelectorAll(
        ".data-item.item-checkbox"
    );
    allCheckboxesItems.forEach((item) => (item.style.display = display));
    // get all controls and change display
    let allControlsItems = document.querySelectorAll(
        ".data-item.item-controls"
    );
    allControlsItems.forEach((item) => (item.style.display = display));
    if (updateGrid) updateGrid(newGrid);
}
// when printing
window.onbeforeprint = () => whenPrint("print");
// when end printing
window.onafterprint = () => whenPrint("endprint");
// downlaod btn
let tableDownloadBtn = document.querySelector(".table-top-btn.download");
let downlaodListInput = document.querySelector(".download-list-input");
if (tableDownloadBtn)
    tableDownloadBtn.addEventListener("click", (e) => {
        if (selectedItems.length) downlaodListInput.value = selectedItems;
        else {
            let ids = [];
            searchedList.forEach((item) => ids.push(item.id));
            downlaodListInput.value = ids;
        }
    });

// selected items (checkboxes) -----------------------------------------------------
function listenToAllChecckboxes() {
    let allCheckboxes = document.querySelectorAll(
        ".table-checkbox:not(.select-all)"
    );
    // listen to all visible checkboxes change
    allCheckboxes.forEach((checkbox) =>
        checkbox.addEventListener("change", (e) => {
            selectAllCheckbox.checked = false;
            let id = checkbox.value;
            // if item added remove it, if not add it
            let added = selectedItems.find((item) => item === id);
            if (added)
                selectedItems = selectedItems.filter((item) => item !== id);
            else selectedItems.push(id);
            updateDeleteBtnStyle();
            updateSelectedCount();
        })
    );
    // listen to select all checkbox change
    let selectAllCheckbox = document.querySelector(
        ".table-checkbox.select-all"
    );
    if (selectAllCheckbox)
        selectAllCheckbox.addEventListener("change", (e) => {
            let checked = selectAllCheckbox.checked;
            allCheckboxes.forEach((checkbox) => {
                let id = checkbox.value;
                checkbox.checked = checked;
                // if item added remove it, if not add it
                let added = selectedItems.find((item) => item === id);
                if (added)
                    selectedItems = selectedItems.filter((item) => item !== id);
                if (checked) selectedItems.push(checkbox.value);
            });
            updateDeleteBtnStyle();
            updateSelectedCount();
        });
}
function updateSelectedCount() {
    let selectedCount = document.querySelector(".selected-count span");
    selectedCount.innerText = selectedItems.length;
}
function updateDeleteBtnStyle() {
    if (deleteSelectedBtn) {
        if (selectedItems.length)
            deleteSelectedBtn.classList.remove("disabled");
        else deleteSelectedBtn.classList.add("disabled");
    }
}
// confirm popup handle ------------------------------------------------------
let confirmPopup = document.querySelector(".confirm-popup");
let confirmPopupCancelBtn = document.querySelector(
    ".confirm-popup .cancel-btn"
);
let confirmPopupDarkBg = document.querySelector(".confirm-popup-bg");
let allHidePopupBtns = [confirmPopupCancelBtn, confirmPopupDarkBg];
allHidePopupBtns.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        confirmPopupDarkBg.classList.add("hide");
        confirmPopup.classList.add("hide");
    });
});

let deleteSelectedBtn = document.querySelector(".delete-selected");
if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener("click", () => {
        if (!selectedItems.length) return;
        // show confirm Popup
        confirmPopup.classList.remove("hide");
        confirmPopupDarkBg.classList.remove("hide");
        // popup view change
        let confirmInput = document.querySelector(".confirm-input");
        confirmInput.value = selectedItems;
        // put delete title
        let popupTitle = document.querySelector(".confirm-popup .popup-title");
        popupTitle.innerText = "هل انت متاكد؟";
        // put delete description
        let popupDescription = document.querySelector(
            ".confirm-popup .popup-description"
        );
        popupDescription.innerText = `هل انت متاكد انك تريد حذف ال (${selectedItems.length}) عنصر الاتية؟`;
        // show list that will be deleted
        let popupList = document.querySelector(".confirm-popup .popup-list");
        popupList.innerHTML = "";
        selectedItems.forEach((id, index) => {
            let number = index + 1;
            let foundItem = dataList.find((item) => item.id === id);
            // name will be displayed on popup when confirming action (to show items that action will be done on it)
            let name = confirmFields
                .map(
                    (field, i) =>
                        `${foundItem[field]}${
                            i !== confirmFields.length - 1 ? " - " : ""
                        } `
                )
                .join("");
            if (foundItem)
                popupList.innerHTML += `<span class="popup-item">${number} - ${name}</span>`;
        });
    });
}
