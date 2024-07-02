let filteredList = [...dataList];
let searchedList = [...filteredList];
let tableLength = 5; // pagination to show rows
let curntPage = 1; // current pagination page
let maximummPages = 1;
let searchValue = "";
let grid = [
    "30px",
    "40px",
    "repeat(3,  minmax(0, 1fr))",
    "50px",
    "minmax(0, 1fr)",
    "minmax(0, 1fr)",
    "120px",
];
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
            !have(
                item.users &&
                    `${item.users.first_name} ${item.users.last_name}`,
                searchValue
            ) &&
            !have(item.users && item.users.mobile, searchValue) &&
            !have(item.description, searchValue) &&
            !have(item.typies && item.typies.name_ar, searchValue) &&
            !have(item.typies && item.typies.name_en, searchValue)
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
    ${putTableItem("اسم النشاط")}
    ${putTableItem("المستخدم")}
    ${putTableItem("رقم الموبايل")}
    ${putTableItem("معتمد")}
    ${putTableItem("الوصف")}
    
    ${putTableItem("نوع النشاط")}
    ${putTableItem("تحكم", "item-controls")}
  </div>
  `;
    // loop over list
    searchedList.forEach((item, index) => {
        let csrfToken = document.head.querySelector(
            'meta[name="csrf-token"]'
        ).content;
        let baseUrl =
            AppRoot +
            "/cpanel-manager/admin/activities/update-activity/" +
            item.id;
        let adminPermissionbaseUrl =
            AppRoot + "/user/activities/update-activity/" + item.id;
        let viewActivity = AppRoot + "/user/activities/view/" + item.id;
        let viewAdminActivity =
            AppRoot + "/cpanel-manager/admin/activities/view/" + item.id;
        let editActivity = AppRoot + "/user/activities/edit/" + item.id;
        let editAdminActivity =
            AppRoot + "/cpanel-manager/admin/activities/edit/" + item.id;
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
    ${putTableItem(
        item.users ? `${item.users.first_name} ${item.users.last_name}` : ""
    )}
    ${putTableItem(item.users.mobile)}
    ${putTableItem(
        `<i class="fa-solid fa-${
            item.activity_status === "approved" ? "check" : "x"
        }"></i>`
    )}
    ${putTableItem(item.description, "item-description")}
        
    ${putTableItem(item.typies ? `${item.typies.name_ar}` : "")}
      ${putTableItem(
          `
                     ${
                         userAuth
                             ? `<a
                                 href="${editActivity}"
                                 class="table-btn table-edit-btn"
                             >
                                 <i class="fa-solid fa-pen"></i>
                             </a>`
                             : ""
                     }
                     ${
                         adminAuth
                             ? `<a
                                href="${editAdminActivity}"
                                class="table-btn table-edit-btn"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </a>`
                             : ""
                     }
                    
                     ${
                         userAuth
                             ? `                      <a href="${viewActivity}" class="table-btn"><i class="fa-solid fa-eye"></i></a>
                            `
                             : ""
                     }
                            ${
                                adminAuth
                                    ? `                      <a href="${viewAdminActivity}" class="table-btn"><i class="fa-solid fa-eye"></i></a>
                                    `
                                    : ""
                            }
                   
                    ${
                        adminAuth
                            ? `
                            <form action=${baseUrl} method="POST">
                    <input name="_token" class="hide" value="${csrfToken}" />
                    <input name="item_id" class="hide" value="${
                        item.id
                    }" /> <button title="${
                                  item.activity_status === "approved"
                                      ? "تعطيل"
                                      : "تفعيل"
                              }" class="switch ${
                                  item.activity_status === "approved"
                                      ? "active"
                                      : ""
                              }">Off</button></form>


                    `
                            : ""
                    }
                    ${
                        adminPermission == "admin"
                            ? `
                            <form action=${adminPermissionbaseUrl} method="POST">
                    <input name="_token" class="hide" value="${csrfToken}" />
                    <input name="item_id" class="hide" value="${
                        item.id
                    }" /> <button title="${
                                  item.activity_status === "approved"
                                      ? "تعطيل"
                                      : "تفعيل"
                              }" class="switch ${
                                  item.activity_status === "approved"
                                      ? "active"
                                      : ""
                              }">Off</button></form>


                    `
                            : ""
                    }
                   
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
