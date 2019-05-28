// Tab Components module
"use strict";

/////////////
// imports //
/////////////

import "nodelist-foreach-polyfill";
import "smoothscroll-polyfill";
import { createDelegatedEventListener, getIndexOfNode, getOffset, getOuterHeight } from "@wearegood/good-utilities";

///////////////
// Constants //
///////////////

const SEL_HEADER = ".st_PageHeader";

const SEL_TAB_COMPONENT = "[data-tabs=component]";
const SEL_TAB_PANEL = "[data-tabs=panel]";
const SEL_TAB_CONTROLS = "[data-tabs=tabs]";
const SEL_TAB_CONTROL = "[data-tabs=link]";
// const selTabControlCurrent = ".current[data-tabs=control]";
const SEL_TAB_CONTROL_GLOBAL = "[data-tabs=component] [data-tabs=link]";
// const selTabAdvance = "[data-tabs=advance]";

// TODO: Add functionality to dynamically create tab controls
// const tabControlsContainerTemplate = `
//   <div class="cp_TabControls" data-tabs="controls">
//     <a class="tabAdvance--prev tabAdvance" href="#" data-tab-advance="p">Prev</a>
//     <a class="tabAdvance--next tabAdvance" href="#" data-tab-advance="n">Next</a>
//     <div class="tabs"></div>
//   </div>`; 
// const tabControlTemplate = `<a href="#" class="tabLink" data-tabs="control"></a>`;

/////////////////////////
// Classes & Functions // 
/////////////////////////

class TabbedContent {

  /**
   *Creates an instance of TabbedContent.
   * @param {*} element
   * @memberof TabbedContent
   */
  constructor(element) {
    this.component = element;
    this.config = JSON.parse(this.component.dataset.tabsConfig);
    this.tabControlsContainer = this.component.querySelector(SEL_TAB_CONTROLS);
    this.tabControls = this.component.querySelectorAll(SEL_TAB_CONTROL);
    this.tabPanels = this.component.querySelectorAll(SEL_TAB_PANEL);
    this.currentIndex = 0;
    this.currentTab;

    this.bindCustomMessageEvents();
    this.setupTabs();
  }

  /**
   * Set initial display of tabs.
   *
   * @memberof TabbedContent
   */
  setupTabs() {
    if (this.config.sticky) {
      this.tabControlsContainer.classList.add('is_Sticky');
      // TODO: Add functionality to build tab controls dynamically
    }

    this.tabPanels.item(this.currentIndex).classList.add('is_Current');
    this.tabControls.item(this.currentIndex).classList.add("is_Current");
  }

  /**
   * Update the current tab based on user interaction
   *
   * @param {*} e
   * @memberof TabbedContent
   */
  updateCurrentTab(e) {
    e.preventDefault();

    const TARGET_INDEX = getIndexOfNode(event.target);

    this.tabPanels.item(this.currentIndex).classList.remove("is_Current");
    this.tabControls.item(this.currentIndex).classList.remove("is_Current");

    this.tabPanels.item(TARGET_INDEX).classList.add("is_Current");
    this.tabControls.item(TARGET_INDEX).classList.add("is_Current");

    // If the target index is not equal to the current index (i.e. the clicked tab isn't the current one )
    // update the tabbed content and scroll back to its start.
    if (TARGET_INDEX !== this.currentIndex) {
      this.currentIndex = TARGET_INDEX;

      if (this.config.sticky) {
        const HEADER = document.querySelector(SEL_HEADER);
        const HEADER_HEIGHT = getOuterHeight(HEADER);
        this.tabControlsContainer.style.top = HEADER_HEIGHT;

        const TOP_OFFSET = getOffset(this.component).top;
        const SCROLL_OFFSET = TOP_OFFSET - HEADER_HEIGHT;

        window.scroll({
          top: SCROLL_OFFSET,
          left: 0,
          behavior: "smooth"
        });
      }
    }
  }

  /**
   * Bind custom messages for this class
   *
   * @memberof TabbedContent
   */
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
  createDelegatedEventListener("click", SEL_TAB_CONTROL_GLOBAL, "selectTab");
}

/**
 * Initialise the Tabbed Content components on the page.
 *
 * @returns {type} Description
 */
export default function initialiseTabs() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  // Find and initialise Show/Hide components using the ShowHide class
  const TAB_COMPONENTS = document.querySelectorAll(SEL_TAB_COMPONENT);

  TAB_COMPONENTS.forEach((element) => {
    const newTabbedContent = new TabbedContent(element);
  });
}