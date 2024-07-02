console.log(dataList);
let filteredList = [...dataList];
let searchedList = [...filteredList];
let tableLength = 5; // pagination to show rows
let curntPage = 1; // current pagination page
let maximummPages = 1;
let searchValue = "";
let grid = [
    "30px",
    "40px",
    "repeat(2,  minmax(0, 1fr))",
    "120px",
    "minmax(0, 1fr)",
    "60px",
    "minmax(0, 1fr)",
    "110px",
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
        let foundType = fileTypes.find((type) => type.key === item.item_type);
        if (
            !have(item.name, searchValue) &&
            !have(foundType && foundType.name, searchValue) &&
            !have(item.users.first_name, searchValue) &&
            !have(item.users.mobile, searchValue) &&
            !have(item.description, searchValue) &&
            !have(item.age_gender, searchValue)
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
    ${putTableItem("نوع العنصر")}
    ${putTableItem("المستخدم")}
    ${putTableItem("الموبايل")}
    ${putTableItem("معتمد")}
    ${putTableItem("الوصف")}
    ${putTableItem("المرحلة العمرية")}
    ${putTableItem("تحكم", "item-controls")}
  </div>
  `;
    // loop over list
    searchedList.forEach((item, index) => {
        let status = item.status;
        let updateAdminStatus = APP_ROOT;
        if (status == "approved") {
            status = "1";
        } else {
            status = "0";
        }

        if (adminAuth) {
            updateAdminStatus =
                APP_ROOT +
                "/cpanel-manager/admin/libraries/update-status/" +
                item.id;
        } else {
            updateAdminStatus =
                APP_ROOT + "/user/libraries/update-status/" + item.id;
        }
        let csrfToken = document.head.querySelector(
            'meta[name="csrf-token"]'
        ).content;
        let updateEnabed =
            APP_ROOT + "/user/libraries/update-enabled/" + item.id;
        let editlibrary = APP_ROOT + "/user/libraries/edit/" + item.id;
        let viewlibrary = APP_ROOT + "/user/libraries/view/" + item.id;
        let editAdminlibrary =
            APP_ROOT + "/cpanel-manager/admin/libraries/edit/" + item.id;
        let viewAdminlibrary =
            APP_ROOT + "/cpanel-manager/admin/libraries/view/" + item.id;
        let updateStatus =
            APP_ROOT +
            "/cpanel-manager/admin/libraries/update-status/" +
            item.id;
        index = index + 1;
        let addedToSelectedItems = selectedItems.find((id) => id == item.id);
        let foundFileType = fileTypes.find(
            (type) => type.key === item.item_type
        );
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
    ${putTableItem(foundFileType ? foundFileType.name : "")}
      
      ${putTableItem(item.users.first_name)}
      ${putTableItem(item.users.mobile)}
      ${putTableItem(`<i class="fa-solid fa-${+status ? "check" : "x"}"></i>`)}
      ${putTableItem(item.description, "item-description")}
      ${putTableItem(item.age_group)}
      ${putTableItem(
          `
        ${
            userAuth
                ? `<a href="${editlibrary}" class="table-btn table-edit-btn"><i class="fa-solid fa-pen"></i></a>`
                : ""
        }
        ${
            adminAuth
                ? `<a href="${editAdminlibrary}" class="table-btn table-edit-btn"><i class="fa-solid fa-pen"></i></a>`
                : ""
        }
      ${
          userAuth
              ? `<a href="${viewlibrary}" class="table-btn"><i class="fa-solid fa-eye"></i></a>`
              : ""
      }
    ${
        adminAuth
            ? `<a href="${viewAdminlibrary}" class="table-btn"><i class="fa-solid fa-eye"></i></a>`
            : ""
    }        
                      
                      
    ${
        adminPermission == "specialist"
            ? `       <form action=${updateEnabed} method="POST">
      <input name="_token" class="hide" value="${csrfToken}" />
      <input name="item_id" class="hide" value="${item.id}" /> 
      <button title="${+item.enabled ? "تعطيل" : "تفعيل"}" class="switch ${
                  +item.enabled ? "active" : ""
              }">Off</button>
    
   </form>`
            : ""
    }     


    ${
        adminAuth || adminPermission == "admin"
            ? `       <form action="${updateAdminStatus}" method="POST">
      <input name="_token" class="hide" value="${csrfToken}" />
      <input name="item_id" class="hide" value="${item.id}" /> 
      <button title="${+status ? "تعطيل" : "تفعيل"}" class="switch ${
                  +status ? "active" : ""
              }">Off</button>
    
   </form>`
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
