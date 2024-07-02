let CheckPinCodeSubmit = document.querySelector("#CheckPinCodeSubmit");
console.log(CheckPinCodeSubmit);
const checkPinCodeHintViewer = document.querySelector(
    ".check-pinCode-hint-viewer"
);
if (CheckPinCodeSubmit) {
    CheckPinCodeSubmit.addEventListener("click", (e) => {
        // console.log(CheckPinCodeSubmit);
        e.preventDefault();
        const pinCode = document.querySelector(".pinCode").value;
        const userId = document.querySelector(".userId").value;

        // if pass all validations send data
        forgotPasswordHintViewer.innerText = "جار التحميل...";

        checkPinCode(`user/check-pinCode`, {
            code: pinCode,
            userId: userId,
        });
    });
}

const checkPinCode = async (url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        body: JSON.stringify(data),
    });
    try {
        const checkData = response.json();
        checkData.then((res) => {
            if (res.error == "invalid code") {
                checkPinCodeHintViewer.innerText = "رقم التحقق غير صحيح";
            } else {
                checkPinCodeDarkBg.classList.add("hide");
                checkPinCodePopup.classList.add("hide");
                if (resetPasswordDarkBg)
                    resetPasswordDarkBg.classList.remove("hide");
                if (resetPasswordPopup)
                    resetPasswordPopup.classList.remove("hide");

                document.querySelector(".data").value = res.data;
            }
        });
    } catch (error) {
        console.log("error", error);
    }
};
