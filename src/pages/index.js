import { data } from "autoprefixer";
import "../pages/index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },

  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "aeb240e6-c252-471d-9c51-9cacba72847b",
    "Content-Type": "application/json",
  },
});

// Destructure the second item in te callback of the .then()
api
  .getAppInfo()
  .then(([cards]) => {
    console.log(cards);
    initialCards.forEach(function (item) {
      const list = document.querySelector(".cards__list");
      list.append(getCardElement(item));
    });

    // - TODO Handle the users information
    // - set the src of the avatar image
    // - set the textContent of both the text elements
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

const handleOverlayClick = (e) => {
  if (e.target.classList.contains("modal")) {
    const modal = document.querySelector(".modal_is-opened");
    closeModal(modal);
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

const closePreviewModal = document.querySelector(".modal__close-btn_preview");
const previewModal = document.querySelector("#preview-modal");
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

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

let cardToDelete = null;

function handleLike(evt, id) {
  evt.target.classList.toggle("card__like-button_active");
  // 1. check whether card is currently liked or not
  // const isLiked = ???
  // 2. call the changeLikeStatus method, passing the appropriate arguments
  // 3. handle the response (.then and .catch)
  // 4. in the .then, toggle active class
}

cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));
deleteButton.addEventListener("click", () =>
  handleDeleteCard(cardElement, data._id),
);

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  //TODO - if the card is liked, set the acrive class on the card

  cardDeleteBtnEl.addEventListener("click", (evt) => {
    openModal(deleteModal);
    cardToDelete = evt.target.closest(".card");
  });

  cardImageEl.addEventListener("click", () => {
    handleImageClick(data);
    openModal(previewModal);
  });

  return cardElement;
}

function handleImageClick(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewCaption.textContent = data.name;
}

deleteSubmitBtn.addEventListener("click", () => {
  if (cardToDelete) {
    cardToDelete.remove();
    cardToDelete = null;
  }
  closeModal(deleteModal);
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
  api
    .editUserInfo({
      name: editProfileNameInput,
      about: editProfileDescriptionInput,
    })
    .then((data) => {
      // TODO Use data argument instead of input values
      profileNameEl.textContent = editProfileNameInput.value;
      profileDescriptionEl.textContent = editProfileDescriptionInput.value;
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const cardElement = getCardElement({
    link: newPostImageInput.value,
    name: newPostNameInput.value,
  });

  cardsList.prepend(cardElement);

  closeModal(newPostModal);
  evt.target.reset();
  disableButton(newPostSubmitBtn, settings);
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
closePreviewModal.addEventListener("click", function () {
  closeModal(previewModal);
});

enableValidation(settings);
