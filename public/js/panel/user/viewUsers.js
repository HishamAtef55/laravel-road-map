let filteredList = [...dataList];
let searchedList = [...filteredList];
let tableLength = 5; // pagination to show rows
let curntPage = 1; // current pagination page
let maximummPages = 1;
let searchValue = "";
let grid = [
    "30px",
    "40px",
    "50px",
    "repeat(3,  minmax(0, 1fr))",
    "50px",
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
    // console.log(selectedItems);
    updatePaginationText(searchedList);
    putList();
}
function updateSearchedList() {
    searchedList = filteredList.filter((item) => {
        const date = new Date(item.created_at);
        function addLeadingZero(num) {
            return num < 10 ? `0${num}` : num;
        }
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        let searchDate = ` ${
            monthNames[monthIndex]
        } ${day} ${year}  - ${addLeadingZero(hour)}:${addLeadingZero(minute)} ${
            hour < 12 ? "AM" : "PM"
        }`;
        if (
            !have(`${item.first_name} ${item.last_name}`, searchValue) &&
            !have(item.mobile, searchValue) &&
            !have(item.email, searchValue) &&
            !have(item.role, searchValue) &&
            !have(searchDate, searchValue)
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
    ${putTableItem("صورة")}
    ${putTableItem("الاسم")}
    ${putTableItem("الموبايل")}
    ${putTableItem("البريد الالكترونى")}
    ${putTableItem("مفعل")}
    ${putTableItem("التاريخ")}
    ${putTableItem("الصلاحية")}
    ${putTableItem("تحكم", "item-controls")}
  </div>
  `;
    // loop over list
    searchedList.forEach((item, index) => {
        let imageSrc = baseUrl + "images/default/defaultImg.png";

        if (item.profile_image) {
            imageSrc = baseUrl + "images/user-guard/" + item.profile_image;
        }
        let csrfToken = document.querySelector(
            'meta[name="csrf-token"]'
        ).content;
        let showProfile =
            appRoot + "/cpanel-manager/admin/users/userProfile/" + item.id;
        let editProfile =
            appRoot + "/cpanel-manager/admin/users/editProfile/" + item.id;
        let acceptUser =
            appRoot + "/cpanel-manager/admin/users/acceptUser/" + item.id;
        let adminShowProfile = appRoot + "/user/users/userProfile/" + item.id;
        let adminEditProfile = appRoot + "/user/users/editProfile/" + item.id;
        let adminAcceptUser = appRoot + "/user/users/acceptUser/" + item.id;
        const date = new Date(item.created_at);
        function addLeadingZero(num) {
            return num < 10 ? `0${num}` : num;
        }
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        let searchDate = ` ${
            monthNames[monthIndex]
        } ${day} ${year}  - ${addLeadingZero(hour)}:${addLeadingZero(minute)} ${
            hour < 12 ? "AM" : "PM"
        }`;

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
    ${putTableItem(`
      <div class="image">
        <img src="${imageSrc}" alt="${item.first_name}" />
      </div>
    `)}
    ${putTableItem(`${item.first_name} ${item.last_name}`)}
    ${putTableItem(item.mobile)}
    ${putTableItem(item.email)}
    ${putTableItem(
        `<i class="fa-solid fa-${
            item.status === "active" ? "check" : "x"
        }"></i>`
    )}
    ${putTableItem(
        ` ${monthNames[monthIndex]} ${day} ${year}  - ${addLeadingZero(
            hour
        )}:${addLeadingZero(minute)} ${hour < 12 ? "AM" : "PM"}`
    )}
    ${putTableItem(item.role[0].toUpperCase() + item.role.slice(1))}
      ${putTableItem(
          ` 
          ${
              adminAuth
                  ? ` <a href="${editProfile}" class="table-btn table-edit-btn"><i class="fa-solid fa-pen"></i></a>`
                  : ""
          }
          ${
              userAuth
                  ? `<a href="${adminEditProfile}" class="table-btn table-edit-btn"><i class="fa-solid fa-pen"></i></a>`
                  : ""
          }         
           ${
               adminAuth
                   ? ` <a href="${showProfile}" class="table-btn"><i class="fa-solid fa-eye"></i></a>`
                   : ""
           }
           ${
               userAuth
                   ? ` <a href="${adminShowProfile}" class="table-btn"><i class="fa-solid fa-eye"></i></a>`
                   : ""
           }         
           ${
               adminAuth
                   ? `        
           <form action="${acceptUser}" method="post"> 
                      <input name="_token" class="hide" value="${csrfToken}" />
                      <input name="item_id" class="hide" value="${
                          item.id
                      }" /> <button title="${
                         item.status === "active" ? "تعطيل" : "تفعيل"
                     }" class="switch ${
                         item.status === "active" ? "active" : ""
                     }">Off</button></form>`
                   : ""
           }

          ${
              userAuth
                  ? `  <form action="${adminAcceptUser}" method="post"> 
          <input name="_token" class="hide" value="${csrfToken}" />
          <input name="item_id" class="hide" value="${
              item.id
          }" /> <button title="${
                        item.status === "active" ? "تعطيل" : "تفعيل"
                    }" class="switch ${
                        item.status === "active" ? "active" : ""
                    }">Off</button></form>`
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
