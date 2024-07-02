const alert = document.querySelector(".alert");
const progress = document.querySelector(".alert .progress-bar .progress");
const closeAlertBtn = document.querySelector(".close-alert");

const seconds = 5;
const milSeconds = seconds * 1000;

let newMilSeconds = milSeconds;
let stop = false;

function closeAlert() {
  alert.classList.add("hide");
  setTimeout(() => {
    alert.remove();
  }, 500);
}

alert.addEventListener("mouseenter", () => (stop = true));
alert.addEventListener("mouseleave", () => (stop = false));
closeAlertBtn.addEventListener("click", closeAlert);

if (progress) {
  let interval = setInterval(() => {
    if (newMilSeconds < 0) {
      if (alert) closeAlert();
      clearInterval(interval);
    } else {
      if (!stop) {
        newMilSeconds -= 20;
        progress.style.width = `${(newMilSeconds * 100) / milSeconds}%`;
      }
    }
  }, 20);
}
