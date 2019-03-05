// Image Components module
"use strict";

////////////////////
// Module Imports //
//////////////////// 

import "intersection-observer";
import PubSub from "pubsub-js";
import imagesLoaded from "imagesloaded";

import Events from "Modules/Events";
import { isElementInView } from "Modules/utilities/isElementInView";

//////////////////////
// Module Constants //
//////////////////////

// Selectors
const SEL_SMART_IMAGE = "[data-image-load]";
const SEL_CLICK_TO_LOAD_SMART_IMAGE = "[data-image-load=click] img.placeholder";
const SEL_PLACEHOLDER_IMAGE = "img";

// Classes
const IMAGE_LOADING_CLASS = "ob_Media--loading";
const IMAGE_LOADED_CLASS = "ob_Media--loaded";
const IMAGE_DISPLAYED_CLASS = "ob_Media--displayed";
const IMAGE_FLEX_CLASS = "ob_Media--flex";
const IMAGE_HIDDEN_CLASS = "ob_Media--isHidden";

// Image Observer
const OBSERVER_OPTIONS  = {
  root: null,
  rootMargin: "0px",
  threshold: 0
};

let imageObserver;

////////////////////////////////
// Module Classes & Functions //
////////////////////////////////

/**
 * SmartImage - Class representing a Smart Image component that loads optimised images based on screen size
 */
class SmartImage {
  constructor(element) {
    // Set properties
    this.smartImageElem = element;
    this.placeholderImage = this.smartImageElem.querySelector(SEL_PLACEHOLDER_IMAGE);
    this.loadingMethod = this.smartImageElem.dataset.imageLoad;
    this.config = JSON.parse(this.smartImageElem.dataset.imageConfig);
    this.imageType = this.config.type || false;
    this.imageReloader = this.config.reload || false;
    this.imageTargetSel = this.smartImageElem.dataset.imageTarget || null;
    this.imageLoaded = false;
    this.imageToAdd = document.createElement("img");
    this.srcSet = JSON.parse(this.smartImageElem.dataset.srcSet) || {};

    // Add Image Element to observer
    if(this.loadingMethod === 'view') {
      if (typeof (window.IntersectionObserver) !== 'undefined') {
        imageObserver.observe(this.smartImageElem);
      }
    }

    // Call initial methods
    this.bindCustomMessageEvents();
    this.subscribeToEvents();

    if (this.loadingMethod === "pageload") {
      this.getImageFile();
    } else if (this.loadingMethod === "view") {
      this.loadImageIfInView();
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
    imageObserver.unobserve(this.smartImageElem);
  }

  /**
   * displayImageAsBackground - Description
   *
   * @param {string} path Description
   *
   */
  displayImageAsBackground(path) {
    const SMART_IMAGE = "url(" + path + ")";
    const IMAGE_BACKGROUND_POS = this.smartImageElem.dataset.position;
    const IMAGE_BACKGROUND_COLOR = this.smartImageElem.dataset.backgroundColor;

    this.smartImageElem.classList.add(IMAGE_LOADED_CLASS);
    this.smartImageElem.style.backgroundImage = SMART_IMAGE;
    this.smartImageElem.classList.add(IMAGE_BACKGROUND_POS);
    this.smartImageElem.style.backgroundColor = IMAGE_BACKGROUND_COLOR;

    window.setTimeout(() => {
      this.smartImageElem.classList.add(IMAGE_DISPLAYED_CLASS);
      PubSub.publish(Events.messages.contentChange);
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

    PubSub.publish(Events.messages.imageLoaded);
    PubSub.publish(Events.messages.layoutChange);
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

    if ( isElementInView(component) && (this.imageLoaded === false || this.imageReloader === true)) {
      this.getImageFile(this.smartImageElem);
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
      "imageInView",
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
      // Fallback to scroll event detection if browser doesn't support IntersectionObserver
      if (typeof(window.IntersectionObserver) === 'undefined') {
        // PubSub.subscribe(Events.messages.scroll, () => {
        //   this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
        // }); 
      }
      
      PubSub.subscribe(Events.messages.load, () => {
        this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
      });

      PubSub.subscribe(Events.messages.layoutChange, () => {
        this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
      });
    }

    PubSub.subscribe(Events.messages.resize, () => {
      this.smartImageElem.dispatchEvent(Events.createCustomEvent("siReload"));
    });

    PubSub.subscribe(Events.messages.breakChange, () => {
      this.smartImageElem.dispatchEvent(Events.createCustomEvent("siReload"));
    });
  }
}


class SmartImageFactory {
  constructor () {
    this.subscribeToEvents();
  }

  createNewSmartImageObjects (data) {
    const SMART_IMAGES = data.querySelectorAll(SEL_SMART_IMAGE);
    Array.prototype.forEach.call(SMART_IMAGES, element => {
      const newSmartImage = new SmartImage(element);
    });
  }

  displaySmartImages () {
    
  }

  subscribeToEvents () {
    // On a content change, the newly-added elements are passed as parameters to a function
    // that finds any smartImages and instantiates controlling objects for each
    PubSub.subscribe(Events.messages.contentChange, (topic, data) => {
      this.createNewSmartImageObjects(data);
    });

    PubSub.subscribe(Events.messages.contentDisplayed, (topic, data) => {
      this.displaySmartImages(data);
    });
  } 
}

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  Events.delegate("click", SEL_CLICK_TO_LOAD_SMART_IMAGE, "siClickLoad");
}

/**
 *
 *  Instantiate objects to manage smart image components
 */
function initialiseSmartImages() {
  const SMART_IMAGES = document.querySelectorAll(SEL_SMART_IMAGE);

  SMART_IMAGES.forEach(element => {
    const NEW_SMART_IMAGE = new SmartImage(element);
  });
}


/**
 * Handle observed intersections for smart image components
 *
 * @param {*} entries
 * @param {*} observer
 */
function handleSmartImageIntersection (entries, observer) {
  entries.forEach(function(entry) {
    if (entry.intersectionRatio > 0) {
      entry.target.dispatchEvent(Events.createCustomEvent("imageInView"));
    }
  });
}

/**
 * Instantiate an IntersectionObserver object for the smart image components
 *
 */
function initialiseSmartImageObserver() { 
  if (typeof (window.IntersectionObserver) !== 'undefined') {
    imageObserver = new IntersectionObserver(handleSmartImageIntersection, OBSERVER_OPTIONS);
  }  
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  // Initialise an observer object to detect when smart image elements are in view
  initialiseSmartImageObserver();

  // Find and initialise Show/Hide components using the ShowHide class
  initialiseSmartImages(); 

}

export default { initModule: initModule };
