import "core-js/stable";
import "regenerator-runtime/runtime";

import Api from "../utils/Api.js";
import "./index.css";
import { validationConfig, initialCards } from "../utils/constants.js";
import {enableValidation, resetValidation, disableButton } from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";

// Instantiate the Api class
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "114e703e-6e3a-4a6f-b3c4-795424dff5a4",
    "Content-Type": "application/json"
  }
});

// Profile elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");
const editProfileSubmitBtn = editProfileModal.querySelector(".modal__submit-btn");

const profileNameEl = document.querySelector(".profile__title");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

// Avatar
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarUrlInput = avatarModal.querySelector("#profile-avatar-input");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");

// New post elements
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newCardForm = newPostModal.querySelector(".modal__form");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newCardImageInput = newPostModal.querySelector("#card-image-input");
const newCardDescriptionInput = newPostModal.querySelector("#card-description-input");

// Delete modal
const deleteModal = document.querySelector("#delete-modal");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteSubmitBtn = deleteModal.querySelector(".modal__submit-btn");
const deleteCancelBtn = deleteModal.querySelector(".modal__button_type_cancel");

// Preview image popups
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

// Cards
const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

// State variables for deleted cards
let selectedCard = null;
let selectedCardId = null;

// Modal helpers
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal__is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal__is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal__is-opened");
  if (!document.querySelector(".modal__is-opened")) {
    document.removeEventListener("keydown", handleEscClose);
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});


// Cards rendering
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  // Fill content
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Like state from server
  if (data.isLiked) cardLikeBtnEl.classList.add("card__like-btn_active");

  // Preview image modal
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  cardLikeBtnEl.addEventListener("click", () => {
    const isActive = cardLikeBtnEl.classList.contains("card__like-btn_active");
    const request = isActive ? api.unlikeCard(data._id) : api.likeCard(data._id);

    request.then((updatedCard) => {
    if (updatedCard.isLiked) cardLikeBtnEl.classList.add("card__like-btn_active");
    else cardLikeBtnEl.classList.remove("card__like-btn_active");
  })
  .catch(console.error);
  });

  // Delete
  cardDeleteBtnEl.addEventListener("click", () => handleDeleteCard(cardElement, data));

  return cardElement;
}

function renderCards(cards) {
  cardsList.innerHTML = "";
  cards.forEach((item) => {
    cardsList.append(getCardElement(item));
  });
}

// Delete flow
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

// Delete confirmation
function handleDeleteSubmit(evt) {
  evt.preventDefault();

  setButtonText(deleteSubmitBtn, true, "Yes, delete", "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteSubmitBtn, false, "Yes, delete");
    });
}

// Form submit handlers

// Profile
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  setButtonText(editProfileSubmitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(editProfileSubmitBtn, false);
    });
}

// New card
function handleCardSubmit(evt) {
  evt.preventDefault();

  setButtonText(cardSubmitBtn, true);

  console.log("Submitting new card:", {
    name: newCardDescriptionInput.value,
    link: newCardImageInput.value
  });

  api
    .addCard({
      name: newCardDescriptionInput.value,
      link: newCardImageInput.value,
    })
    .then((cardData) => {
      cardsList.prepend(getCardElement(cardData));
      newCardForm.reset();
      disableButton(cardSubmitBtn, validationConfig);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitBtn, false);
    });
}

// Avatar
function handleAvatarSubmit(evt) {
  evt.preventDefault();

  setButtonText(avatarSubmitBtn, true);

  api
    .updateUserAvatar({ avatar: avatarUrlInput.value })
    .then((userData) => {
      profileAvatarEl.src = userData.avatar;
      avatarForm.reset();
      disableButton(avatarSubmitBtn, validationConfig);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitBtn, false);
    });
}
// Modal event listeners

// Edit profile modal
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  //Optional: reset validation errors and disable button when opening the form
  resetValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
});
editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));

// New post opening and closing
newPostBtn.addEventListener("click", () => {
  resetValidation(newCardForm, validationConfig);
  openModal(newPostModal);
});
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

// Avatar opening and closing
avatarModalBtn.addEventListener("click", () => {
  avatarUrlInput.value = "";
  resetValidation(avatarForm, validationConfig);
  openModal(avatarModal);
});
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));

previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

deleteCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteCancelBtn.addEventListener("click", () => closeModal(deleteModal));

// Form submits
editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newCardForm.addEventListener("submit", handleCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

/* Initial data fetching and rendering */
api
  .getAppInfo()
  .then(([userData, cards]) => {
    const isPlaceholderUser =
      userData.name === "Placeholder name" &&
      userData.about === "Placeholder description" &&
      userData.avatar?.includes("avatar_placeholder");

    // initiazlize once if this token is still the default placeholder user
    if (isPlaceholderUser) {
      return Promise.all([
        api.editUserInfo({ name: "Bessie Coleman", about: "Civil Aviator" }),
        // Use a real URL (hosted). The API cannot store your local avatar.jpg file
        api.updateUserAvatar({
          avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Bessie_Coleman_in_1923.jpg/1280px-Bessie_Coleman_in_1923.jpg",
        }),
        Promise.resolve(cards),
      ]).then(([updatedUserData, , existingCards]) => [updatedUserData, existingCards]);
    }

    return [userData, cards];
  })
  .then(([userData, cards]) => {
    // TEMP SEED only if server returns no cards
    if (!cards || cards.length === 0) {
      return Promise.all(initialCards.map((card) => api.addCard(card)))
        .then(() => api.getInitialCards())
        .then((freshCards) => [userData, freshCards]);
    }

    return [userData, cards];
  })
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;

    renderCards(cards);
    document.querySelector(".page").classList.remove("page_is-loading");
  }).catch(console.error);

  enableValidation(validationConfig);