let filteredList = [...activities];
let searchedList = [...filteredList];
let tableLength = 5; // pagination to show rows
let curntPage = 1; // current pagination page
let maximummPages = 1;
let searchValue = "";
let grid = ["repeat(3,  minmax(0, 1fr))", "120px", "80px", "minmax(0, 1fr)"];
let printGrid = [...grid];
let selectedItems = [];
// used to show fields on confirm popup when confirming action
let confirmFields = ["name", "user_name"];

let table = document.querySelector(".data-list");

if (tableSearchInput) {
    tableSearchInput.addEventListener("change", search);
    tableSearchInput.addEventListener("keyup", search);
}
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
        if (!have(item.name, searchValue)) return false;
        return true;
    });
}

// loop over list and put rows in table
function putList() {
    function putTableItem(text, className) {
        return `<div class="data-item ${className ? className : ""}">${
            text ? text : ""
        }</div>`;
    }
    let itemsToShow = 0; // to check how many items are showing
    // put table head
    table.innerHTML = `
  <div class="data-row head-row">
    ${putTableItem("عنوان النشاط")}
    ${putTableItem("الاخصائى")}
    ${putTableItem("نوع النشاط")}
    ${putTableItem("تاريخ النشر")}
    ${putTableItem("عدد مرات الاستخدام")}
    ${putTableItem("تفاصيل النشاط")}
  </div>
  `;
    // loop over list
    searchedList.forEach((item, index) => {
        index = index + 1;
        // check items to show based on current pagination page and table length
        if (index > tableLength * (curntPage - 1) + tableLength) return "";
        if (index <= tableLength * (curntPage - 1)) return "";
        // put table row with data
        table.innerHTML += `
    <div class="data-row body-row">
    ${putTableItem(item.name)}
    ${putTableItem(`${item.users.first_name} ${item.users.last_name}`)}
      ${putTableItem(item.typies.name_ar)}
      ${putTableItem(getDate(new Date(item.created_at)), "date")}
      ${putTableItem(item.usage_count)}
      ${putTableItem(item.description, "item-description")}
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
putPaginationPages();
