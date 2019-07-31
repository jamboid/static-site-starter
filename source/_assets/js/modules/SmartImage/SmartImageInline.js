/////////////
// Imports //
/////////////

import PubSub from "pubsub-js";
import SmartImage from 'Modules/SmartImage/SmartImage';
import {messages as MESSAGES} from "@wearegood/good-utilities";

///////////////
// Constants //
///////////////

import * as CONSTANTS from "Modules/SmartImage/constants";

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 *
 *
 * @export
 * @class SmartImageInline
 * @extends {SmartImage}
 */
export default class SmartImageInline extends SmartImage {
  constructor(element, observer) {
    super(element, observer);
  }

  /**
   * updateImageAttributes - Description
   *
   * @param {Element} image <img> html element
   *
   */
  updateImageAttributes(image) {
    const IMAGE_ALT = this.smartImageElem.dataset.alt || "image";
    const IMAGE_WIDTH = this.smartImageElem.dataset.width;
    const IMAGE_CLASS = this.smartImageElem.dataset.class;

    if (IMAGE_ALT.length > 0) {
      image.alt = IMAGE_ALT;
    }

    if (IMAGE_WIDTH) {
      image.width = IMAGE_WIDTH;
    }

    if (IMAGE_CLASS) {
      image.classList.add(IMAGE_CLASS);
    }
  }

  /**
   * displayImage - Display the image as an inline image
   *
   */
  displayImage() {
    // Add 'loading' class to SmartImage container
    this.smartImageElem.classList.add(CONSTANTS.IMAGE_LOADING_CLASS);

    if (this.placeholderImage) {
      this.placeholderImage.src = this.imageToAdd.src;
      this.placeholderImage.classList.remove("placeholder");
      this.placeholderImage.removeAttribute("width");
      this.placeholderImage.removeAttribute("height");

      this.updateImageAttributes(this.placeholderImage);
    } else {
      this.updateImageAttributes(this.imageToAdd);

      if (this.imageTargetSel === null) {
        this.smartImageElem.insertBefore(this.imageToAdd, null);
      }

      this.placeholderImage = this.imageToAdd;
    }

    this.smartImageElem.classList.add(CONSTANTS.IMAGE_LOADED_CLASS);
    // Need to allow browser a moment to process the addition of the image before displaying it
    window.setTimeout(() => {
      this.smartImageElem.classList.add(CONSTANTS.IMAGE_DISPLAYED_CLASS);
      PubSub.publish(MESSAGES.contentChange);
      PubSub.publish(MESSAGES.imageLoaded);
      PubSub.publish(MESSAGES.layoutChange);
    }, 50);

    this.imageLoaded = true;
    this.observer.unobserve(this.smartImageElem);
  }
}