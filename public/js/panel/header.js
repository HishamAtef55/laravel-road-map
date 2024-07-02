let userBox = document.querySelector(".user-box .box");
let userDropdown = document.querySelector(".header-user-dropdown");

userBox.addEventListener("click", () => {
  if (userDropdown) userDropdown.classList.toggle("show");
});
