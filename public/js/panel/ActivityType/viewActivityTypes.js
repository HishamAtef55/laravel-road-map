let filteredList = [...dataList];
let searchedList = [...filteredList];
let tableLength = 5; // pagination to show rows
let curntPage = 1; // current pagination page
let maximummPages = 1;
let searchValue = "";
let grid = ["30px", "40px", "60px", "repeat(4, 1fr)", "120px"];
let printGrid = getPrintGrid();
let selectedItems = [];

let table = document.querySelector(".data-list");

tableSearchInput.addEventListener("change", search);
tableSearchInput.addEventListener("keyup", search);
// update search list when search input changed
function search(e) {
  searchedList = [];
  curntPage = 1;
  searchValue = e.target.value;
  searchedList = filteredList.filter(item => {
    if (!have(item.name_en, searchValue) && !have(item.name_ar, searchValue) && !have(item.description, searchValue) && !have(item.code, searchValue))
      return false;
    return true;
  });
  updatePaginationText(searchedList);
  putList();
}

// loop over list and put rows in table
function putList() {
  function putTableItem(text, className) {
    return `<div class="data-item ${className ? className : ""}">${text}</div>`;
  }
  let itemsToShow = 0; // to check how many items are showing
  // put table head
  table.innerHTML = `
  <div class="data-row head-row">
    ${putTableItem("#")}
    ${putTableItem(`<input type="checkbox" class="table-checkbox select-all" />`, "item-checkbox")}
    ${putTableItem("صورة")}
    ${putTableItem("الاسم انجليزى")}
    ${putTableItem("الاسم عربى")}
    ${putTableItem("الوصف")}
    ${putTableItem("الكود")}
    ${putTableItem("تحكم", "item-controls")}
  </div>
  `;
  // loop over list
  searchedList.forEach((item, index) => {

    let editActivityType = APP_ROOT + "/cpanel-manager/admin/activityType/edit/" + item.id;
    let viewActivityType = APP_ROOT + "/cpanel-manager/admin/activityType/view/" + item.id;
    let imageSrc = baseUrl + "images/activities-type/" + item.master_image
    if(!item.master_image){
      imageSrc = baseUrl + "images/default/defaultImg.png"
    }
    index = index + 1;
    let addedToSelectedItems = selectedItems.find(id => id == item.id);
    // check items to show based on current pagination page and table length
    if (index > tableLength * (curntPage - 1) + tableLength) return "";
    if (index <= tableLength * (curntPage - 1)) return "";

    // put table row with data
    table.innerHTML += `
    <div class="data-row body-row">
    ${putTableItem(index)}
    ${putTableItem(`<input ${addedToSelectedItems ? "checked" : ""} value="${item.id}" type="checkbox" class="table-checkbox" />`, "item-checkbox")}
    ${putTableItem(`<div class="image">
                      <img src="${imageSrc}" alt="Activity Type" />
                    </div>`)}
      ${putTableItem(item.name_en)}
      ${putTableItem(item.name_ar)}
      ${putTableItem(item.description, "item-description")}
      ${putTableItem(item.code)}
      ${putTableItem(
        `
                      <a href="${editActivityType}" class="table-btn table-edit-btn"><i class="fa-solid fa-pen"></i></a>
                      <a href="${viewActivityType}" class="table-btn"><i class="fa-solid fa-eye"></i></a>
                     `,
        "item-controls"
      )}
    </div>`;
    itemsToShow += 1;
  });
  // if no items to show, show no results text
  if (itemsToShow < 1) table.innerHTML += `<p class="no-results-text" >لا يوجد نتائج</p>`;
  updateGrid(grid);
  listenToAllChecckboxes();
}
updateGrid(grid);
putList();
updatePaginationText(searchedList);
updateMaximumPages(searchedList);
