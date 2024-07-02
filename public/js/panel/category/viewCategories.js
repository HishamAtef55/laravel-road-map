let filteredList = [...dataList];
let searchedList = [...filteredList];

let tableLength = 5; // pagination to show rows
let curntPage = 1; // current pagination page
let maximummPages = 1;
let searchValue = "";
let grid = ["30px", "40px", "repeat(2,  minmax(0, 1fr))", "80px", "120px"];
let printGrid = getPrintGrid();
let selectedItems = [];
// used to show fields on confirm popup when confirming action
let confirmFields = ["name", "user_name"];

let table = document.querySelector(".data-list");

tableSearchInput.addEventListener("change", search);
tableSearchInput.addEventListener("keyup", search);
// update search list when search input changed
function search(e) {
    searchedList = [];
    curntPage = 1;
    searchValue = e.target.value;
    updateSearchedList();

    updatePaginationText(searchedList);
    putList();
}
function updateSearchedList() {
    searchedList = filteredList.filter((item) => {
        if (
            !have(item.name, searchValue) &&
            !have(item.created_at, searchValue)
        )
            return false;
        return true;
    });
}

// loop over list and put rows in table
function putList() {
    function putTableItem(text, className) {
        return `<div class="data-item ${
            className ? className : ""
        }">${text}</div>`;
    }
    let itemsToShow = 0; // to check how many items are showing
    // put table head
    table.innerHTML = `
  <div class="data-row head-row">
    ${putTableItem("#")}
    ${putTableItem(
        `<input type="checkbox" class="table-checkbox select-all" />`,
        "item-checkbox"
    )}
    ${putTableItem("الاسم")}
    ${putTableItem("تاريخ الانشاء")}
    ${putTableItem("مفعل")}
    ${putTableItem("تحكم", "item-controls")}
  </div>
  `;
    // loop over list
    searchedList.forEach((item, index) => {
        let updateCategoryStatus = APP_ROOT;
        let editLibraryCategory = APP_ROOT;
        if (userAuth) {
            updateCategoryStatus =
                APP_ROOT +
                "/user/libraries/categories/update-status/" +
                item.id;
            editLibraryCategory =
                APP_ROOT + "/user/libraries/categories/edit/" + item.id;
        } else {
            updateCategoryStatus =
                APP_ROOT +
                "/cpanel-manager/admin/libraries/categories/update-status/" +
                item.id;
            editLibraryCategory =
                APP_ROOT +
                "/cpanel-manager/admin/libraries/categories/edit/" +
                item.id;
        }

        let csrfToken = document.head.querySelector(
            'meta[name="csrf-token"]'
        ).content;
        index = index + 1;
        let addedToSelectedItems = selectedItems.find((id) => id == item.id);
        // check items to show based on current pagination page and table length
        if (index > tableLength * (curntPage - 1) + tableLength) return "";
        if (index <= tableLength * (curntPage - 1)) return "";
        // put table row with data
        table.innerHTML += `
    <div class="data-row body-row">
    ${putTableItem(index)}
    ${putTableItem(
        `<input ${addedToSelectedItems ? "checked" : ""} value="${
            item.id
        }" type="checkbox" class="table-checkbox" />`,
        "item-checkbox"
    )}
    ${putTableItem(item.name)}
    ${putTableItem(getDate(item.created_at), "date")}
    ${putTableItem(
        `<i class="fa-solid fa-${+item.status ? "check" : "x"}"></i>`
    )}
      ${putTableItem(
          `
                      <a href="${editLibraryCategory}" class="table-btn table-edit-btn"><i class="fa-solid fa-pen"></i></a>
                      
                      <form action="${updateCategoryStatus}" method="POST">
      <input name="_token" class="hide" value="${csrfToken}" />
                      <input name="item_id" class="hide" value="${
                          item.id
                      }" /> <button title="${
              +item.status ? "تعطيل" : "تفعيل"
          }" class="switch ${+item.status ? "active" : ""}">Off</button></form>
                     `,
          "item-controls"
      )}
    </div>`;
        itemsToShow += 1;
    });
    // if no items to show, show no results text
    if (itemsToShow < 1)
        table.innerHTML += `<p class="no-results-text" >لا يوجد نتائج</p>`;
    updateGrid(grid);
    listenToAllChecckboxes();
}
updateGrid(grid);
putList();
updatePaginationText(searchedList);
updateMaximumPages(searchedList);
