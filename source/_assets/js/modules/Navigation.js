// Navigation Menu 

////////////////////
// Module Imports //
////////////////////

import PubSub from "pubsub-js";

import Events from "Modules/Events";

//////////////////////
// Module Constants //
//////////////////////

const SEL_MAIN_NAV = "[data-main-nav=component]";
const SEL_MAIN_NAV_TOGGLE = "[data-main-nav=toggle]";
const SEL_MAIN_NAV_TOGGLE_GLOBAL = "[data-main-nav=component] [data-main-nav=toggle]";
const SEL_MAIN_NAV_MENU = "[data-main-nav=menu]";
const SEL_MAIN_NAV_CLOSE_GLOBAL = "[data-main-nav=component] [data-main-nav=close]";
const SEL_MAIN_NAV_SECONDARY_MENU_CONTAINER = ".cp_MainNav__secondaryMenu";
const SEL_MAIN_NAV_SECONDARY_ITEM = "li.secondary";
const MENU_SHOW_HIDE_TRANSITION_TIME = 350;


////////////////////////////////
// Module Classes & Functions //
////////////////////////////////


class MainNavToggle {
  constructor(element) {
    this.menuToggle = element;

    this.bindCustomMessageEvents();
    this.subscribeToEvents();
  }

  toggleMenu() {
    document.body.classList.toggle("nav_Visible");
  }

  openMenu() {}

  closeMenu() {}

  subscribeToEvents() {} 

  /**
   * Add event handler for main navigation toggle
   * @function
   */
  bindCustomMessageEvents() {
    this.menuToggle.addEventListener("toggleMainNav", this.toggleMenu.bind(this));
    this.menuToggle.addEventListener("openMainNav", this.openMenu.bind(this));
    this.menuToggle.addEventListener("closeMainNav", this.closeMenu.bind(this));
  }
}


function initialiseMainMenu() {
  const NAV_TOGGLE = document.querySelectorAll(SEL_MAIN_NAV_TOGGLE);

  Array.prototype.forEach.call(NAV_TOGGLE, element => {
    const newMainNavToggle = new MainNavToggle(element);
  });
}

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  Events.delegate("click", SEL_MAIN_NAV_TOGGLE, "toggleMainNav");
}


/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();
  initialiseMainMenu();
}

export default { initModule: initModule };