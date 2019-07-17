// Image Components module
"use strict";

/////////////
// Imports //
/////////////

import "nodelist-foreach-polyfill";
import SlideGallery from "Modules/SlideGallery/SlideGallery";

///////////////
// Constants //
///////////////

const SEL_SLIDE_GALLERY = "[data-gallery=component]";

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 *
 *  Instantiate objects to manage smart image components
 */
function initialiseSlideGalleries() {
  const SLIDE_GALLERIES = document.querySelectorAll(SEL_SLIDE_GALLERY);

  SLIDE_GALLERIES.forEach((element) => {
    const newSlideGallery = new SlideGallery(element);
  })
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export default function initSlideGalleries() {
  // Find and initialise Show/Hide components using the ShowHide class
  initialiseSlideGalleries();
}