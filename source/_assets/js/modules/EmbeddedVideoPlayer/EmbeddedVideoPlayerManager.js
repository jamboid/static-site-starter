
/////////////
// Imports //
/////////////

import "nodelist-foreach-polyfill";
import { createDelegatedEventListener } from "@wearegood/good-utilities";
import EmbeddedVideoPlayer from "Modules/EmbeddedVideoPlayer/EmbeddedVideoPlayer";

///////////////
// Constants //
///////////////

const SEL_EMBED_VIDEO = "[data-embed-player=component]";

const SEL_EMBED_VIDEO_TOGGLE = "[data-embed-player=link]";


/////////////////////////
// Classes & Functions // 
/////////////////////////
  

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  createDelegatedEventListener("click", SEL_EMBED_VIDEO_TOGGLE, "loadEmbeddedVideo");
}

/**
 *
 *
 */
function initialiseEmbeddedVideos() {
  const embeddedVideos = document.querySelectorAll(SEL_EMBED_VIDEO);
  embeddedVideos.forEach(element => {
    const newEmbeddedVideo = new EmbeddedVideoPlayer(element);
  });
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export default function initialiseModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();
  initialiseEmbeddedVideos(); 
}