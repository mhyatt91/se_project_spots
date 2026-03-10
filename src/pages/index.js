import { data } from "autoprefixer";
import "../pages/index.css";
import {
  resetValidation,
  enableValidation,
  settings,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "aeb240e6-c252-471d-9c51-9cacba72847b",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => cardsList.append(getCardElement(item)));

    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  .catch(console.error);

// PROFILE ELEMENTS
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const createCardForm = document.querySelector("#add-card-form");
const createCardFormCTA = createCardForm.querySelector(".modal__submit-btn");

const handleOverlayClick = (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target);
  }
};

const handleEscPress = (event) => {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_is-opened");
    closeModal(modal);
  }
};

const openModal = (modal) => {
  modal.classList.add("modal_is-opened");
  modal.addEventListener("click", handleOverlayClick);

  document.addEventListener("keydown", handleEscPress);
};

const closeModal = (modal) => {
  modal.classList.remove("modal_is-opened");
  modal.removeEventListener("click", handleOverlayClick);
  document.removeEventListener("keydown", handleEscPress);
};

const previewModal = document.querySelector("#preview-modal");
const closePreviewModal = previewModal.querySelector(".modal__close-btn");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostNameInput = newPostModal.querySelector("#card-caption-input");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardsList = document.querySelector(".cards__list");
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const cancelModalCloseBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteSubmitBtn = deleteModal.querySelector(".modal__submit-btn");
const profileAvatarBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar");
const editAvatarModalCloseBtn =
  editAvatarModal.querySelector(".modal__close-btn");
const avatarImageInput = editAvatarModal.querySelector("#avatar-input");
const profileAvatar = document.querySelector(".profile__avatar");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

let cardToDelete = null;
let cardToDeleteid = null;

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_active");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_active");
  }

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteBtnEl.addEventListener("click", (evt) => {
    openModal(deleteModal);
    cardToDelete = cardElement;
    cardToDeleteid = data._id;
  });

  cardImageEl.addEventListener("click", () => {
    handleImageClick(data);
    openModal(previewModal);
  });

  return cardElement;
}

profileAvatarBtn.addEventListener("click", () => {
  openModal(editAvatarModal);
});

editAvatarModalCloseBtn.addEventListener("click", () => {
  closeModal(editAvatarModal);
});

function handleImageClick(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewCaption.textContent = data.name;
}

deleteSubmitBtn.addEventListener("click", () => {
  if (cardToDelete) {
    setButtonText(deleteSubmitBtn, true, "Delete", "Deleting...");

    api
      .deleteCard(cardToDeleteid)
      .then(() => {
        cardToDelete.remove();
        cardToDelete = null;
        closeModal(deleteModal);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setButtonText(deleteSubmitBtn, true, "Deleting...", "Delete");
      });
  }
});

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});
deleteModalCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

cancelModalCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const newPostSubmitBtn = evt.submitter;
  setButtonText(newPostSubmitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      // TODO - Use data argument instead of the input values
      console.log(data);
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      // TODO - call setButtonText instead
      setButtonText(newPostSubmitBtn, false);
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editAvatar(avatarImageInput.value)
    .then((data) => {
      console.log(data);
      profileAvatar.src = data.avatar;
      evt.target.reset();
      disableButton(submitBtn, settings);
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  setButtonText(evt.submitter, true, "Save", "Saving...");

  const cardData = {
    link: newPostImageInput.value,
    name: newPostNameInput.value,
  };

  api
    .createCard(cardData)
    .then((card) => {
      const cardElement = getCardElement(card);

      cardsList.prepend(cardElement);

      closeModal(newPostModal);
      evt.target.reset();

      setButtonText(evt.submitter, true, "Saving...", "Save");
      disableButton(newPostSubmitBtn, settings);
    })
    .catch(console.error);
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
closePreviewModal.addEventListener("click", function () {
  closeModal(previewModal);
});

enableValidation(settings);
