let sidebar = document.querySelector(".sidebar");
let sidebarBg = document.querySelector(".sidebar-bg");
let pageContainer = document.querySelector(".page-container");
let header = document.querySelector(".header");
let closeSidebar = document.querySelector(".close-sidebar");

function changeSidebarWidth() {
  if (sidebar) {
    if (sidebar.classList.contains("smaller")) {
      sidebar.classList.remove("smaller");
      sidebarBg.classList.add("hide");
      if (header) header.classList.remove("expand");
    } else {
      sidebar.classList.add("smaller");
      sidebarBg.classList.remove("hide");
      if (header) header.classList.add("expand");
    }
  }
  if (pageContainer) pageContainer.classList.toggle("expand");
}

closeSidebar.addEventListener("click", () => changeSidebarWidth("x"));
sidebarBg.addEventListener("click", () => changeSidebarWidth("bg"));
// remove transition for all sidebar elements for a while (to resize when on mobile)
let allElements = document.querySelectorAll(".sidebar *");
sidebar.style.transition = "0s";
allElements.forEach(el => (el.style.transition = "0s"));
setTimeout(() => {
  sidebar.style.transition = "0.2s";
  allElements.forEach(el => (el.style.transition = "0.2s"));
}, 200);
