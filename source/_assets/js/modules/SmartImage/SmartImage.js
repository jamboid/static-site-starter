
/////////////
// Imports //
/////////////

import "intersection-observer";
import PubSub from "pubsub-js";
import imagesLoaded from "imagesloaded";

import MESSAGES from "Modules/Events/messages";

///////////////
// Constants //
///////////////

// Selectors
const SEL_PLACEHOLDER_IMAGE = "img";

// HTML Classes
const IMAGE_LOADING_CLASS = "ob_Media--loading";
const IMAGE_LOADED_CLASS = "ob_Media--loaded";
const IMAGE_DISPLAYED_CLASS = "ob_Media--displayed";
const IMAGE_FLEX_CLASS = "ob_Media--flex";
const IMAGE_HIDDEN_CLASS = "ob_Media--isHidden";

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

    this.placeholderImage = this.smartImageElem.querySelector(SEL_PLACEHOLDER_IMAGE);
    this.loadingMethod = this.smartImageElem.dataset.imageLoad;
    this.config = JSON.parse(this.smartImageElem.dataset.imageConfig);
    this.imageType = this.config.type || false;
    this.imageReloader = this.config.reload || false;
    this.imageTargetSel = this.smartImageElem.dataset.imageTarget || null;
    this.imageLoaded = false;
    this.imageToAdd = document.createElement("img");
    this.srcSet = JSON.parse(this.smartImageElem.dataset.srcSet) || {};
    
    // Add Image Element to observer if it has the "view" loading method
    if(this.loadingMethod === 'view') {
      this.observer.observe(this.smartImageElem);
    }

    // Call initial methods
    this.bindCustomMessageEvents();
    this.subscribeToEvents();

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

    for (let key in this.srcSet) {
      if (this.srcSet.hasOwnProperty(key)) {
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

    return imageSrcKey;
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
   * displayImageInContainer - Description
   *
   */
  displayImageInContainer() {
    // Add 'loading' class to SmartImage container
    this.smartImageElem.classList.add(IMAGE_LOADING_CLASS);

    if (this.placeholderImage) {
      this.placeholderImage.src = this.imageToAdd.src;
      this.placeholderImage.classList.remove("placeholder");
      this.placeholderImage.removeAttribute("width");
      this.placeholderImage.removeAttribute("height");

      this.updateImageAttributes(this.placeholderImage);
    } else {
      this.updateImageAttributes(this.imageToAdd);

      if (this.imageTargetSel !== null) {
        //this.smartImageElem.parent().find(imageTargetSel).eq(0).append(this.imageToAdd);
      } else {
        this.smartImageElem.insertBefore(this.imageToAdd, null);
      }
      this.placeholderImage = this.imageToAdd;
    }

    this.smartImageElem.classList.add(IMAGE_LOADED_CLASS);
    // Need to allow browser a moment to process the addition of the image before displaying it
    window.setTimeout(() => {
      this.smartImageElem.classList.add(IMAGE_DISPLAYED_CLASS);
      PubSub.publish("content/update");
    }, 50);

    this.imageLoaded = true;

    if (typeof (window.IntersectionObserver) !== 'undefined') {
      this.observer.unobserve(this.smartImageElem);
    }
  }

  /**
   * displayImageAsBackground - Description
   *
   * @param {string} path Description
   *
   */
  displayImageAsBackground(path) {
    const SMART_IMAGE_CSS = "url(" + path + ")";
    const IMAGE_BACKGROUND_POS = this.smartImageElem.dataset.position;
    const IMAGE_BACKGROUND_COLOR = this.smartImageElem.dataset.backgroundColor;

    this.smartImageElem.classList.add(IMAGE_LOADED_CLASS);
    this.smartImageElem.style.backgroundImage = SMART_IMAGE_CSS;
    this.smartImageElem.classList.add(IMAGE_BACKGROUND_POS);
    this.smartImageElem.style.backgroundColor = IMAGE_BACKGROUND_COLOR;

    window.setTimeout(() => {
      this.smartImageElem.classList.add(IMAGE_DISPLAYED_CLASS);
      PubSub.publish(MESSAGES.contentChange);
    }, 50);

    this.imageLoaded = true;
    imageObserver.unobserve(this.smartImageElem);
  }

  /**
   * getImageFile - Description
   *
   */
  getImageFile() {
    const THIS_IMAGE_URL = this.srcSet[this.calculateImageBreakpointToUse()];

    //Site.utils.cl("image url: " + THIS_IMAGE_URL);

    if (THIS_IMAGE_URL !== "none") {
      this.smartImageElem.classList.remove("is_Hidden");
      this.imageToAdd.src = THIS_IMAGE_URL;

      const IMAGE_LOADER = imagesLoaded(this.imageToAdd);

      if (this.imageType === "inline") {
        IMAGE_LOADER.on("done", () => {
          this.smartImageElem.classList.remove(IMAGE_LOADING_CLASS);
          this.displayImageInContainer(this.imageToAdd);
        });
      } else if (this.imageType === "background") {
        // The imagesLoaded function is called for image we want to load.
        // There is no initial callback because everything we want to do can wait
        // until the image is fully downloaded.
        IMAGE_LOADER.on("done", () => {
          this.smartImageElem.classList.add(IMAGE_FLEX_CLASS);
          this.displayImageAsBackground(THIS_IMAGE_URL);
        });
      }
    } else {
      this.smartImageElem.classList.add(IMAGE_HIDDEN_CLASS);
    }

    PubSub.publish(MESSAGES.imageLoaded);
    PubSub.publish(MESSAGES.layoutChange);
  }

  /**
   * Load and display a smart image - use this when being in view doesn't matter
   */
  loadImage() {
    if (this.imageType === "inline") {
      if (this.imageLoaded === false || this.imageReloader === true) {
        this.getImageFile(this.smartImageElem);
      }
    } else if (this.imageType === "background") {
      this.smartImageElem.classList.add(IMAGE_FLEX_CLASS);
      if (this.imageLoaded === false || this.imageReloader === true) {
        this.getImageFile(this.smartImageElem);
      }
    }
  }

  /**
   * loadImageIfInView - Check if
   */
  loadImageIfInView() {
    let component = this.smartImageElem;

    if (this.imageType === "background") {
      component = component.parentNode;
    }

    // if ( isElementInView(component) && (this.imageLoaded === false || this.imageReloader === true)) {
    //   this.getImageFile(this.smartImageElem);
    // }
  }

  /**
   * loadSmartImage - Description
   *
   * @param {event} e Description
   */
  loadSmartImage(e) {
    e.preventDefault();

    if (this.imageLoaded === false) {
      this.loadImageIfInView(this.smartImageElem);
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
        this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
      });

      PubSub.subscribe(MESSAGES.layoutChange, () => {
        this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
      });
    }

    PubSub.subscribe(MESSAGES.resize, () => {
      this.smartImageElem.dispatchEvent(Events.createCustomEvent("siReload"));
    });

    PubSub.subscribe(MESSAGES.breakChange, () => {
      this.smartImageElem.dispatchEvent(Events.createCustomEvent("siReload"));
    });
  }
}
