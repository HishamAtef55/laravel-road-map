const headerLoginBtn = document.querySelector(".header-login-btn");
const headerRegisterBtn = document.querySelector(".header-register-btn");

function showPopup(name) {
  let loginPopup = document.querySelector(`.${name}-popup`);
  let loginBg = document.querySelector(`.${name}-bg`);
  loginPopup.classList.remove("hide");
  loginBg.classList.remove("hide");
}

if (headerLoginBtn) headerLoginBtn.addEventListener("click", () => showPopup("login"));
if (headerRegisterBtn) headerRegisterBtn.addEventListener("click", () => showPopup("register"));
