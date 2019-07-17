// Navigation Manager 

////////////////////
// Module Imports //
////////////////////

import "nodelist-foreach-polyfill";
import { createDelegatedEventListener } from "@wearegood/good-utilities";
import MainNavToggle from "Modules/Navigation/MainNavToggle";

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

function initialiseMainNavigation() {
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
  createDelegatedEventListener("click", SEL_MAIN_NAV_TOGGLE, "toggleMainNav");
}


/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export default function initialiseNavigation() {
  // Create delegated event listeners for the components within this module
  delegateEvents();
  initialiseMainNavigation();
}