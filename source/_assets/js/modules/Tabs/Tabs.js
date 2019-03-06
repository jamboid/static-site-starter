// Tab Components module
"use strict";

////////////////////
// Module Imports //
////////////////////

import createDelegate from "Modules/Events/createDelegatedEventListener";
import getIndexOfNode from "Modules/Utilities/getIndexOfNode";
 
//////////////////////
// Module Constants //
////////////////////// 

const SEL_TAB_COMPONENT = "[data-tabs=component]";
const SEL_TAB_PANEL = "[data-tabs=panel]";
const SEL_TAB_CONTROL = "[data-tabs=control]";
// const selTabControlCurrent = ".current[data-tabs=control]";
const SEL_TAB_CONTROL_GLOBAL = "[data-tabs=component] [data-tabs=control]";
// const selTabAdvance = "[data-tabs=advance]";

// TODO: Add functionality to dynamically create tab controls
// const tabControlsContainerTemplate = `
//   <div class="cp_TabControls" data-tabs="controls">
//     <a class="tabAdvance--prev tabAdvance" href="#" data-tab-advance="p">Prev</a>
//     <a class="tabAdvance--next tabAdvance" href="#" data-tab-advance="n">Next</a>
//     <div class="tabs"></div>
//   </div>`; 
// const tabControlTemplate = `<a href="#" class="tabLink" data-tabs="control"></a>`;

////////////////////////////////
// Module Classes & Functions // 
////////////////////////////////

class TabbedContent {
  constructor(element) {
    this.component = element;
    this.config = JSON.parse(this.component.dataset.tabsConfig);
    this.tabControls = this.component.querySelectorAll(SEL_TAB_CONTROL);
    this.tabPanels = this.component.querySelectorAll(SEL_TAB_PANEL);
    this.currentIndex = 0;
    this.currentTab;

    this.bindCustomMessageEvents(); 
    this.setupTabs();
  }

  setupTabs() {
    if (this.config.build) {
      // TODO: Add functionality to build tab controls dynamically
    }

    this.tabPanels.item(this.currentIndex).classList.add('is_Current');
    this.tabControls.item(this.currentIndex).classList.add("is_Current");
  }

  updateCurrentTab(event) {
    const TARGET_INDEX = indexOfNode(event.target);

    this.tabPanels.item(this.currentIndex).classList.remove("is_Current");
    this.tabControls.item(this.currentIndex).classList.remove("is_Current");

    this.tabPanels.item(TARGET_INDEX).classList.add("is_Current");
    this.tabControls.item(TARGET_INDEX).classList.add("is_Current");

    this.currentIndex = TARGET_INDEX;
  }

  bindCustomMessageEvents() {
    this.component.addEventListener("selectTab", this.updateCurrentTab.bind(this));
  }
}

/**
 * delegateEvents - Create delegated event listeners for the components within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  createDelegate("click", SEL_TAB_CONTROL_GLOBAL, "selectTab");
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents(); 

  // Find and initialise Show/Hide components using the ShowHide class
  const TAB_COMPONENTS = document.querySelectorAll(SEL_TAB_COMPONENT);

  TAB_COMPONENTS.forEach((element) => {
    const newTabbedContent = new TabbedContent(element);
  });
}

export default {
  initModule: initModule
}