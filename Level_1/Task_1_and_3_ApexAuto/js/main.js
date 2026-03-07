const openBtn = document.querySelector("#open-booking-btn");
const dialog = document.querySelector("#booking-modal");
const closeBtn = document.querySelector("#close-modal-btn");
const bookingForm = document.querySelector("#booking-form");
const serviceList = document.querySelector("#service-dropdown");
const selectedServiceInput = document.querySelector("#selected-service");
const emailInput = document.querySelector("#client-email");
const emailError = document.querySelector("#email-error");
let isFormDirty = false;

openBtn.addEventListener("click", () => {
  dialog.showModal();
});
closeBtn.addEventListener("click", () => {
  if (isFormDirty)
    if (!confirm("Are you sure? You have unsaved changes.")) return;
  dialog.close();
  isFormDirty = false;
});
bookingForm.addEventListener("input", () => {
  isFormDirty = true;
});

serviceList.addEventListener("click", (event) => {
  const clickedItem = event.target;

  if (clickedItem.tagName === "LI") {
    const serviceValue = clickedItem.getAttribute("data-value");

    selectedServiceInput.value = serviceValue;

    document.querySelectorAll("#service-dropdown li").forEach((li) => {
      li.classList.remove("selected");
    });

    clickedItem.classList.add("selected");

    console.log("Engineer, Service Selected:", serviceValue);

    isFormDirty = true;
  }
});

function debounce(callback, delay) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
const validateEmail = (emailValue) => {
  console.log("Checking Email: ", emailValue);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailPattern.test(emailValue)) {
    emailError.textContent = "";
    emailInput.style.borderColor = "var(--primary-color)";
  } else {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.style.borderColor = "var(--error-color)";
  }
};
const debouncedValidation = debounce((e) => {
  validateEmail(e.target.value);
}, 500);

emailInput.addEventListener("input", debouncedValidation);

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  alert(
    "Success! Your booking for " +
      selectedServiceInput.value +
      " has been sent.",
  );

  isFormDirty = false; 
  dialog.close();
  bookingForm.reset(); 
});
