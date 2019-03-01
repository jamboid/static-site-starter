// Modal Components Module
"use strict";

import PubSub from "pubsub-js";
import Events from "Modules/Events";
import { createNodeFromHTML } from "Modules/Utils"; 

const MODAL_TEMPLATE = `
  <div class="cp_Modal" aria-modal="true">
    <div id="confirmation-popup" class="cp_Modal__inner">
      <div class="cp_Modal__content">
        <div class="cp_Modal__close">
          <a class="cp_Modal__closeLink" href="#" title="Close this modal">Close</a>
        </div>
      </div>
    </div>
  </div>`;

const MODAL_SCREEN_TEMPLATE = `<div class='cp_ModalScreen'></div>`;

// const SEL_MODAL_COMPONENT = ".cp_Modal";
const SEL_MODAL_LINK = "[data-modal-source]";
const SEL_MODAL_CLOSE = ".cp_Modal__closeLink";
const SEL_MODAL_CONTENT = ".cp_Modal__content";
const SEL_MODAL_SCREEN = ".cp_ModalScreen";

const BODY_ELEMENT = document.getElementsByTagName('body')[0];

/** 
 *
 *
 * @class Modal
 */
class Modal {

  /**
   *Creates an instance of Modal.
   * @param {*} element
   * @param {*} modalType
   * @param {*} modalID
   * @memberof Modal
   */
  constructor(content, modalType, modalID) {
    this.modal = createNodeFromHTML(MODAL_TEMPLATE);
    this.modalScreen = createNodeFromHTML(MODAL_SCREEN_TEMPLATE);
    
    this.modalID = modalID;
    this.modalType = modalType;
    this.modalContent = content;
    
    this.closeButton = this.modal.querySelector(SEL_MODAL_CLOSE);

    this.bindCustomMessageEvents();
    this.subscribeToEvents();

    BODY_ELEMENT.appendChild(this.modal);
    BODY_ELEMENT.appendChild(this.modalScreen);

    if (this.modalType === "inpage") {
      this.displayPageContentInModal();
    } else if (this.modalType === "image") {
      this.displaySmartImageInModal();
    } else if (this.modalType === "iframe") {
      this.displayContentInModal();
    }

    PubSub.publish("modal/opened");
  }

  /**
   *
   *
   * @memberof Modal
   */
  displaySmartImageInModal () {
    this.modal.classList.add("cp_Modal--image");

    const modalContent = this.modal.querySelector(SEL_MODAL_CONTENT);
    modalContent.appendChild(this.modalContent);

    //BODY_ELEMENT.classList.add("modalDisplayed");
    
    this.positionModal();
    PubSub.publish(Events.messages.contentChange, this.modalContent);
  }

  /**
   *
   *
   * @memberof Modal
   */
  positionModal () {
    this.modal.classList.add("is_Displayed");
  }

  /**
   *
   *
   * @memberof Modal
   */
  activateModal () {
    this.modal.classList.add("is_Loaded");
    this.positionModal();

    // Site.analytics.trackPageEvent("Modal Image", "Modal Opened", "Image ID: " + thisModalID);

    // let delayPosition = setTimeout(this.positionModal.bind(this), 1000);
  }

  /**
   *
   *
   * @memberof Modal
   */
  closeModal () {
    BODY_ELEMENT.removeChild(this.modal); 
    BODY_ELEMENT.removeChild(this.modalScreen);
  }


  /**
   * 
   *
   * @memberof Modal
   */
  bindCustomMessageEvents () {
    this.modal.addEventListener(
      "closeModal",
      this.closeModal.bind(this)
    );

    this.modal.addEventListener(
      "updatelayout",
      this.positionModal.bind(this)
    );

    this.modal.addEventListener(
      "activateModal",
      this.activateModal.bind(this)
    );

    this.modalScreen.addEventListener(
      "closeModal",
      this.closeModal.bind(this)
    );
  }

  /**
   * Subscribe object to Global Messages
   * @function
   */
  subscribeToEvents () {

    // PubSub.subscribe(Events.messages.resize, () => {
    //   this.modal.dispatchEvent(Events.createCustomEvent("updatelayout"));
    // });

    // PubSub.subscribe(Events.messages.contentChange, () => {
    //   this.modal.dispatchEvent(Events.createCustomEvent("updatelayout"));
    // });

    PubSub.subscribe(Events.messages.imageLoaded, () => {
      this.modal.dispatchEvent(Events.createCustomEvent("activateModal"));
    });
  }
}

/**
 * ModalLinkManager - Class for managing links that generate page modals
 *
 * @class ModalLinkManager
 */
class ModalLinkManager {
  /**
   *Creates an instance of ModalLinkManager.
   * @memberof ModalLinkManager
   */
  constructor() {
    this.modalLinkContent = document.createElement("div");
    this.modalLinkContent.classList.add("cp_Modal__contentHolder");

    // Call initial methods
    this.subscribeToEvents();
  }

  /**
   *
   *
   * @param {object} data
   * @memberof ModalLinkManager
   */
  createModalContent(linkElement) {
    const MODAL_LINK = linkElement;
    const MODAL_LINK_ID = MODAL_LINK.getAttribute("id") || "unidentified";
    const MODAL_LINK_URL = MODAL_LINK.getAttribute("href");
    const MODAL_MODE = MODAL_LINK.dataset.modalSource;

    let modalContent;    

    this.modalLinkContent.innerHTML = "";

    if (MODAL_MODE === "iframe") {
      modalContent = `<iframe src="${MODAL_LINK_URL}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
    } else if (MODAL_MODE === "image") {
      modalContent = `<div class="ob_Media--image ob_Media" data-image-load="pageload" data-image-config='{ "type" : "inline", "reload" : true }' data-src-set='{ "max": "${MODAL_LINK_URL}"}'></div>`;
    }

    if (modalContent) {
      this.modalLinkContent.innerHTML = modalContent;
      this.createModal(MODAL_MODE, MODAL_LINK_ID);
    } 
  }

  /**
   *
   *
   * @memberof ModalLinkManager
   */
  createModal(mode, id) {
    const NEW_MODAL = new Modal(this.modalLinkContent, mode, id);
  }

  /**
   *
   *
   * @memberof ModalLinkManager
   */
  subscribeToEvents() {
    PubSub.subscribe("display/modal", (topic, data) => {
      let modalLink;

      if (data.target.matches(SEL_MODAL_LINK)) {
        modalLink = data.target;
      } else {
        modalLink = data.target.closest(SEL_MODAL_LINK);
      } 

      if(modalLink) {
        this.createModalContent(modalLink);
      }
    });
  }
}

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  Events.delegate("click", SEL_MODAL_CLOSE, "closeModal");
  Events.delegate("click", SEL_MODAL_SCREEN, "closeModal");
  Events.global("click", SEL_MODAL_LINK, "display/modal", true);
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  const newModalLinkManager = new ModalLinkManager();
}

export default { initModule: initModule };
