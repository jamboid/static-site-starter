// Show/Hide Components module
"use strict";

/////////////
// Imports //
/////////////

import "nodelist-foreach-polyfill";
import PubSub from "pubsub-js";
import { collapseElement, expandElement, createDelegatedEventListener, messages as MESSAGES } from "@wearegood/good-utilities";

///////////////
// Constants //
///////////////

const SEL_COMPONENT = "[data-showhide=component]";
const SEL_ACTION = "[data-showhide=component] [data-showhide=toggle]";
const SEL_CONTENT = "[data-showhide=content]";
const CLASS_DISPLAY = "is_Open";

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 * ShowHide - Class representing a Show/Hide DOM component
 */
class ShowHide {
  /**
   * constructor - Description
   *
   * @param {object} element DOM element
   *
   * @returns {type} Description
   */
  constructor(element) {
    // Set properties
    this.component = element;
    this.action = this.component.querySelectorAll(SEL_ACTION)[0];
    this.content = this.component.querySelectorAll(SEL_CONTENT)[0];
    this.config = this.component.getAttribute("data-showhide-config");
    this.animate = this.config.animate || false;
    this.speed = this.config.speed || 200;
    this.startState = this.config.open || false;

    this.expanded = false;

    // Call initial methods
    this.bindCustomMessageEvents();
    this.setStartState();
  }

  /**
   * toggleControl - Description
   *
   * @param {type} event Description
   */
  toggleControl(event) {
    event.preventDefault();

    if (this.expanded) {
      collapseElement(this.content);
      this.component.classList.remove(CLASS_DISPLAY);
      this.content.setAttribute('aria-hidden','true');
      this.expanded = false;
    } else {
      expandElement(this.content);
      this.component.classList.add(CLASS_DISPLAY);
      this.content.setAttribute('aria-hidden','false');
      this.expanded = true;
    }

    PubSub.publish(MESSAGES.contentChange);
  }

  /**
   * setStartState - Description
   *
   * @returns {type} Description
   */
  setStartState() {
    if (this.startState === true) {
      expandElement(this.content);
      this.component.classList.add(CLASS_DISPLAY);
      this.content.setAttribute('aria-hidden','false');
      this.expanded = true;
    } else {
      this.content.setAttribute('aria-hidden','true');
    }
  }

  /**
   * bindCustomMessageEvents - Description
   *
   * @returns {type} Description
   */
  bindCustomMessageEvents() {
    this.component.addEventListener(
      "toggleShowHide",
      this.toggleControl.bind(this)
    );
  }
}

/**
 * delegateEvents - Create delegated event listeners for the components within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  createDelegatedEventListener("click", SEL_ACTION, "toggleShowHide");
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export default function initialiseShowhide() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  // Find and initialise Show/Hide components using the ShowHide class
  const showHideComponents = document.querySelectorAll(SEL_COMPONENT);
  
  Array.prototype.forEach.call(showHideComponents, element => {
    const newShowHide = new ShowHide(element);
  });
}