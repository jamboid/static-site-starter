// Show/Hide Components module
"use strict";

/////////////
// Imports //
/////////////

import PubSub from "pubsub-js";
import createDelegate from "Modules/Events/createDelegatedEventListener";
import collapseElement from "Modules/Utilities/collapseElement";
import expandElement from "Modules/Utilities/expandElement";

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
    this.element = element;
    this.action = this.element.querySelectorAll(SEL_ACTION)[0];
    this.content = this.element.querySelectorAll(SEL_CONTENT)[0];
    this.config = this.element.getAttribute("data-showhide-config");
    this.animate = this.config.animate || false;
    this.speed = this.config.speed || 200;
    this.startState = this.config.open || false;

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

    if (this.element.classList.contains(CLASS_DISPLAY)) {
      collapseElement(this.content);
      this.element.classList.remove(CLASS_DISPLAY);
    } else {
      expandElement(this.content);
      this.element.classList.add(CLASS_DISPLAY);
    }

    PubSub.publish(Events.messages.contentChange);
  }

  /**
   * setStartState - Description
   *
   * @returns {type} Description
   */
  setStartState() {
    if (this.startState === true) {
      expandElement(this.content);
      this.element.classList.add(CLASS_DISPLAY);
    }
  }

  /**
   * bindCustomMessageEvents - Description
   *
   * @returns {type} Description
   */
  bindCustomMessageEvents() {
    this.element.addEventListener(
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
  createDelegate("click", SEL_ACTION, "toggleShowHide");
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