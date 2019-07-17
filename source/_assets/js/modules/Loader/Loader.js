
// Loader module
"use strict";

////////////////////
// Module Imports //
////////////////////

import PubSub from "pubsub-js";
import { messages as MESSAGES } from "@wearegood/good-utilities";

////////////////////////////////////
// Module Constants and Variables //
////////////////////////////////////

const LOAD_DELAY = 250;
const LOADED_BODY_CLASS = "pageLoaded";

////////////////////////////////
// Module Classes & Functions //
////////////////////////////////

function pageIsLoaded() {
  // Add class for CSS styling
  document.body.classList.add(LOADED_BODY_CLASS);

  // Publish message for JS modules
  PubSub.publish(MESSAGES.load);
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  const PAGE_LOAD_TIMEOUT = setTimeout(pageIsLoaded,LOAD_DELAY);
}

export default { initModule: initModule };
