/////////////
// Imports //
/////////////

import PubSub from "pubsub-js";
import { messages as MESSAGES} from "@wearegood/good-utilities";
import SmartImage from "Modules/SmartImage/SmartImage";

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
 * @class SmartImageBackground
 * @extends {SmartImage}
 */
export default class SmartImageBackground extends SmartImage {
  constructor(element, observer) {
    super(element, observer);
  }

  /**
   * displayImage - Display the image as a background image
   *
   * @param {string} path Description
   *
   */
  displayImage() {
    const SMART_IMAGE_CSS = "url(" + this.imageToAdd.src + ")";
    const IMAGE_BACKGROUND_POS = this.smartImageElem.dataset.position;
    const IMAGE_BACKGROUND_COLOR = this.smartImageElem.dataset.backgroundColor;
    
    this.smartImageElem.classList.add(CONSTANTS.IMAGE_FLEX_CLASS);
    this.smartImageElem.classList.add(CONSTANTS.IMAGE_LOADED_CLASS);
    this.smartImageElem.style.backgroundImage = SMART_IMAGE_CSS;
    this.smartImageElem.classList.add(IMAGE_BACKGROUND_POS);
    this.smartImageElem.style.backgroundColor = IMAGE_BACKGROUND_COLOR;

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