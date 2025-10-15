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

editProfileBtn.addEventListener("click", function() {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function() {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function() {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function() {
  closeModal(newPostModal);
});

function openModal(modal) {
  modal.classList.add("modal__is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal__is-opened");
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  console.log(newCardImageInput.value);
  console.log(newCardDescriptionInput.value);
  closeModal(newPostModal);
}

newCardForm.addEventListener("submit", handleAddCardFormSubmit);