const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newCardForm = newPostModal.querySelector(".modal__form");
const newCardImageInput = newPostModal.querySelector("#card-image-input");
const newCardDescriptionInput = newPostModal.querySelector("#card-description-input");

const profileNameEl = document.querySelector(".profile__title");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardImageEL = document.querySelector(".card__image");
const cardDescriptionEL = document.querySelector(".card__title");

editProfileBtn.addEventListener("click", function() {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileModal.classList.add("modal_is-opened")
});

editProfileCloseBtn.addEventListener("click", function() {
  editProfileModal.classList.remove("modal_is-opened")
});

newPostBtn.addEventListener("click", function() {
  newPostModal.classList.add("modal_is-opened")
});

newPostCloseBtn.addEventListener("click", function() {
  newPostModal.classList.remove("modal_is-opened")
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened")
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  console.log(newCardImageInput.value);
  console.log(newCardDescriptionInput.value);
  newPostModal.classList.remove("modal_is-opened")
}

newCardForm.addEventListener("submit", handleAddCardFormSubmit);