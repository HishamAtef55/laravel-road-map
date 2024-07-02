let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// get time that is passed
function getTime(dateToGet) {
  let date = new Date(dateToGet);
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let AmPm = hours >= 12 ? "PM" : "AM";
  hours = hours >= 12 ? hours - 12 : hours;
  hours = hours <= 9 ? `0${hours}` : hours;
  hours = hours == `00` ? `12` : hours;
  minutes = minutes <= 9 ? `0${minutes}` : minutes;
  return `${hours}:${minutes} ${AmPm}`; // 10:30 PM
}

// get time now
function getTimeNow() {
  let date = new Date();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let AmPm = hours >= 12 ? "PM" : "AM";
  hours = hours >= 12 ? hours - 12 : hours;
  hours = hours <= 9 ? `0${hours}` : hours;
  hours = hours == `00` ? `12` : hours;
  minutes = minutes <= 9 ? `0${minutes}` : minutes;
  return `${hours}:${minutes} ${AmPm}`; // 10:30 PM (Now)
}

// get now time with seconds
function getFullTimeNow() {
  let date = new Date();
  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let AmPm = hours >= 12 ? "PM" : "AM";
  hours = hours >= 12 ? hours - 12 : hours;
  hours = hours <= 9 ? `0${hours}` : hours;
  hours = hours == `00` ? `12` : hours;
  minutes = minutes <= 9 ? `0${minutes}` : minutes;
  seconds = seconds <= 9 ? `0${seconds}` : seconds;
  return `${hours}:${minutes}:${seconds} ${AmPm}`; // 10:30:12 PM
}

// get todat date
function getDateNow() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day} ${months[month]} ${year}`; // 12 May 2023 (today)
}

// get passed date with year
function getDate(dateToGet) {
  let date = new Date(dateToGet);
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  return `${day} ${months[month]} ${year}`; // 12 May 2023
}

// get passed date without year
function getDateNoYear(dateToGet) {
  let date = new Date(dateToGet);
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  return `${day} ${months[month]}`; // 12 May
}

// get full passed date
function getFullDate(dateToGet) {
  return `${getDate(dateToGet)} - ${getTime(dateToGet)}`; // 12 May 2023 - 10:30 PM
}

function getFullDateNoYear(dateToGet) {
  return `${getDateNoYear(dateToGet)} - ${getTime(dateToGet)}`; // 12 May - 10:30 PM
}

function isToday(theDate) {
  if (!theDate) return "No Date";
  let date = new Date(theDate);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

// used to ckeck if date reached
function dateReached(date) {
  let now = new Date().getTime();
  let date2 = new Date(date).getTime();
  return date2 < now;
}

// used to check if date is passed amount of days
function daysPassed(date, days) {
  let now = new Date();
  now.setDate(now.getDate() - days);
  now = new Date(now).getTime();

  let compareDate = new Date(date);
  compareDate.setDate(compareDate.getDate());
  compareDate = new Date(compareDate).getTime();

  return now > compareDate;
}

// check if date is between two dates
function dateBetween(dateFrom, dateTo, date) {
  let dateToCompare = new Date(date).getTime();
  let dateF = new Date(dateFrom).getTime();
  let dateT = new Date(dateTo).getTime();
  return dateToCompare > dateF && dateToCompare < dateT;
}
