
/////////////
// Imports //
/////////////

import "intersection-observer";
import PubSub from "pubsub-js";
import imagesLoaded from "imagesloaded";
import { createCustomEvent, messages as MESSAGES } from "@wearegood/good-utilities";

///////////////
// Constants //
///////////////

import * as CONSTANTS from "Modules/SmartImage/constants";

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 * SmartImage - Class representing a Smart Image component that loads optimised images based on screen size
 *
 * @export
 * @class SmartImage
 */
export default class SmartImage { 
  constructor(element, observer) {
    // Set properties
    this.smartImageElem = element;
    this.observer = observer;

    this.placeholderImage = this.smartImageElem.querySelector(CONSTANTS.SEL_PLACEHOLDER_IMAGE);
    this.loadingMethod = this.smartImageElem.dataset.imageLoad;
    this.config = JSON.parse(this.smartImageElem.dataset.imageConfig);
    this.imageType = this.config.type || false;
    this.imageReloader = this.config.reload || false;
    this.imageTargetSel = this.smartImageElem.dataset.imageTarget || null;
    this.imageLoaded = false;
    this.imageToAdd = document.createElement("img");
    this.srcset = JSON.parse(this.smartImageElem.dataset.srcSet) || {};
    
    // Add Image Element to observer if it has the "view" loading method
    if(this.loadingMethod === 'view') {
      this.observer.observe(this.smartImageElem);
    }

    // Call initial methods
    this.bindCustomMessageEvents();
    this.subscribeToEvents();

    // Load image immediately if loading method is pageload
    if (this.loadingMethod === "pageload") {
      this.getImageFile();
    }
  }

  /**
   * calculateImageBreakpointToUse - Description
   *
   * @returns {string} Description
   */
  calculateImageBreakpointToUse() {
    const PAGE_WIDTH = window.innerWidth;
    let imageSrcKey = "max";

    for (let key in this.srcset) {
      if (this.srcset.hasOwnProperty(key)) {
        // If the current key is not 'max' check that the page width is less than it,
        // and it is less than the current value for imageSrcKey
        if (key !== "max") {
          // If imageSrcKey is not set to 'max' check if the key
          // is greater or equal than the page width and also if it
          // is less than the current value of imageSrcKey
          if (imageSrcKey !== "max") {
            if (parseInt(key) >= PAGE_WIDTH && parseInt(key) < imageSrcKey) {
              imageSrcKey = key;
            }
          } else {
            // If imageSrcKey is still set to 'max' just check if the key
            // is greater or equal than the page width
            if (parseInt(key) > PAGE_WIDTH) {
              imageSrcKey = key;
            }
          }
        }
      }
    }

    // Return the correct key
    return imageSrcKey;
  }

  /**
   *
   *
   */
  displayImage() {
    // Stub that is implemented inheritors of this class:
    // * SmartImageBackground
    // * SmartImageInline
  }

  /**
  * Load and display a smart image - use this when being in view doesn't matter
  */
  loadImage() {
    if (this.imageLoaded === false || this.imageReloader === true) {
      this.getImageFile(this.smartImageElem);
    }
  }

  /**
   * getImageFile - Description
   *
   */
  getImageFile() {
    const THIS_IMAGE_URL = this.srcset[this.calculateImageBreakpointToUse()];

    if (THIS_IMAGE_URL !== "none") {
      this.smartImageElem.classList.remove("is_Hidden");
      this.imageToAdd.src = THIS_IMAGE_URL;

      const IMAGE_LOADER = imagesLoaded(this.imageToAdd);

      IMAGE_LOADER.on("done", () => {
        this.displayImage();
      });

    } else {
      this.smartImageElem.classList.add(CONSTANTS.IMAGE_HIDDEN_CLASS);
    }
  }

  /**
   * loadSmartImage - Description
   *
   * @param {event} e Description
   */
  loadSmartImage(e) {
    e.preventDefault();

    if (this.imageLoaded === false) {
      this.loadImage();
    }
  }

  /**
   * reloadImage - Description
   *
   * @param {event} e Description
   */
  reloadImage(e) {
    e.preventDefault();

    if (this.imageLoaded === true && this.imageReloader === true) {
      this.getImageFile();
    }
  }

  /**
   * loadSmartImageOnClick - Description
   *
   * @param {event} e Description
   */
  loadSmartImageOnClick(e) { 
    e.preventDefault();

    if (this.imageLoaded === false) {
      this.loadImage(this.smartImageElem);
    }
  }

  /**
   * bindCustomMessageEvents - Binds custom event listeners to the Smart Image DOM Element
   *
   */
  bindCustomMessageEvents() {
    this.smartImageElem.addEventListener(
      "siLoad",
      this.loadSmartImage.bind(this)
    );

    this.smartImageElem.addEventListener(
      "imageObservedInView",
      this.loadSmartImage.bind(this)
    );
    
    this.smartImageElem.addEventListener(
      "siReload",
      this.reloadImage.bind(this)
    );

    this.smartImageElem.addEventListener(
      "siClickLoad",
      this.loadSmartImageOnClick.bind(this)
    );
  }

  /**
   * subscribeToEvents - Subscribes the component to global messages and sets the component's responses via internal custom events
   *
   */
  subscribeToEvents() {
    if (this.loadingMethod === "view") {           
      PubSub.subscribe(MESSAGES.load, () => {
        this.smartImageElem.dispatchEvent(createCustomEvent("siLoad"));
      });

      PubSub.subscribe(MESSAGES.layoutChange, () => {
        this.smartImageElem.dispatchEvent(createCustomEvent("siLoad"));
      });
    }

    PubSub.subscribe(MESSAGES.resize, () => {
      this.smartImageElem.dispatchEvent(createCustomEvent("siReload"));
    });

    PubSub.subscribe(MESSAGES.breakChange, () => {
      this.smartImageElem.dispatchEvent(createCustomEvent("siReload"));
    });
  }
}
