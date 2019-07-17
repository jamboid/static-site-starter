

/////////////
// Imports //
/////////////

import "nodelist-foreach-polyfill";

import { createNodeFromHTML } from "@wearegood/good-utilities";

///////////////
// Constants //
///////////////

const SEL_EMBED_PLAYER_HOLDER = "[data-embed-player=holder]"
const SEL_EMBED_PLAYER_LINK = "[data-embed-player=link]";
const CLASS_PLAYER_LOADED = "is_Loaded"; 

/////////////////////////
// Classes & Functions //
/////////////////////////

export default class EmbeddedVideoPlayer {
  /**
   *Creates an instance of EmbeddedVideoPlayer.
   * @param {*} element
   * @memberof EmbeddedVideoPlayer
   */
  constructor(element) {
    this.embeddedVideo = element;
    this.embeddedVideoHolder = this.embeddedVideo.querySelector(SEL_EMBED_PLAYER_HOLDER);
    this.embeddedVideoLink = this.embeddedVideo.querySelector(SEL_EMBED_PLAYER_LINK);
    this.videoURL = this.embeddedVideoLink.getAttribute('href');

    this.bindCustomMessageEvents();
  }

  /**
   *
   *
   * @param {*} e
   * @memberof EmbeddedVideoPlayer
   */
  loadPlayer(e) {
    e.preventDefault();
    
    const IFRAME_TEMPLATE = `<iframe class="cp_VideoPlayer__iframe" src="${ this.videoURL }" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
    const IFRAME_NODE = createNodeFromHTML(IFRAME_TEMPLATE).item(0);

    this.embeddedVideoHolder.appendChild(IFRAME_NODE);
    this.embeddedVideo.classList.add(CLASS_PLAYER_LOADED); 
  }

  /**
   *
   *
   * @memberof EmbeddedVideoPlayer
   */
  bindCustomMessageEvents() {
    this.embeddedVideo.addEventListener("loadEmbeddedVideo", this.loadPlayer.bind(this));
  }

  /**
   *
   *
   * @memberof EmbeddedVideoPlayer
   */
  subscribeToEvents() {

  }
}