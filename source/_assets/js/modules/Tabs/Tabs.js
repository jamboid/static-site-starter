// Tab Components module
"use strict";

/////////////
// imports //
/////////////
import PubSub from "pubsub-js";

import "nodelist-foreach-polyfill";
import "smoothscroll-polyfill";
import { createDelegatedEventListener, createCustomEvent, getIndexOfNode, getOffset, getOuterHeight, messages as MESSAGES, createNodeFromHTML } from "@wearegood/good-utilities";

///////////////
// Constants //
///////////////

const SEL_HEADER = ".st_PageHeader";

const SEL_TAB_COMPONENT = "[data-tabs=component]";
const SEL_TAB_PANEL = "[data-tabs=panel]";
const SEL_TAB_CONTROLS = "[data-tabs=tabs]";
const SEL_TAB_TAB = "[data-tabs=tab]";
const SEL_TAB_CONTROL = "[data-tabs=link]";
const SEL_TAB_CONTROL_GLOBAL = "[data-tabs=component] [data-tabs=link]";

const CLASS_CURRENT = "is_Current";
const CLASS_STICKY = "is_Sticky";

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
    this.config = JSON.parse(this.component.dataset.tabsConfig) || {};
    this.autoplayDelay = this.config.autoplay || null;
    this.tabControlsContainer = this.component.querySelector(SEL_TAB_CONTROLS);
    this.tabControls = null;
    this.tabControlTemplate = this.component.dataset.tabsTemplate || null;
    this.tabControlTextColour = this.component.dataset.tabsTextColour || "#fff";
    this.tabControlBackgroundColour = this.component.dataset.tabsBackgroundColour || "#000";
    this.tabPanels = this.component.querySelectorAll(SEL_TAB_PANEL);
    this.currentIndex = 0;
    this.currentTab;
    this.pageHeader = document.querySelector(SEL_HEADER);

    this.autoplayer;

    this.bindCustomMessageEvents();
    this.subscribeToEvents();
    this.setupTabs();
  }

  /**
   * Set initial display of tabs.
   *
   * @memberof TabbedContent
   */
  setupTabs() {
    if (this.config.sticky) {
      this.tabControlsContainer.classList.add(CLASS_STICKY);
      // Set the sticky offset based on the header height
      this.setStickyOffset();

    }

    // Build tabs if a template is available
    if(this.tabControlTemplate && this.tabPanels.length > 1) {
      this.tabPanels.forEach((panel) => {
        let tabHTML = createNodeFromHTML(this.tabControlTemplate);
        let tabNode = tabHTML.item(0);
        let panelLabel = panel.dataset.tabsVariant || "empty";
        let tabLink = tabNode.querySelector('[data-tabs=link]');

        tabLink.style.color =  this.tabControlTextColour;
        tabLink.style.borderColor =  this.tabControlTextColour;
        tabLink.style.backgroundColor = this.tabControlBackgroundColour;
        tabLink.textContent = panelLabel;

        this.tabControlsContainer.insertBefore(tabNode, null);
      });
    }


    // Get the tab controls once they've been created
    this.tabPanels.item(this.currentIndex).classList.add(CLASS_CURRENT);

    this.tabControls = this.component.querySelectorAll(SEL_TAB_CONTROL);

    if(this.tabControls.length > 0){
      this.tabControls.item(this.currentIndex).classList.add(CLASS_CURRENT);
    }

    if(this.autoplayDelay) {
      this.startAutoplay(this.autoplayDelay);
    }
  }

  /**
   * Get the height of the page's sticky header component
   *
   * @returns
   * @memberof TabbedContent
   */
  getHeaderHeight() {
    return getOuterHeight(this.pageHeader);
  }

  /**
   * Set the offset for the sticky tabs, accounting for the page header
   *
   * @memberof TabbedContent
   */
  setStickyOffset() {
    const HEADER_HEIGHT = this.getHeaderHeight();
    console.log(HEADER_HEIGHT);
    this.tabControlsContainer.style.top = HEADER_HEIGHT + 'px';
  }

  /**
   * Update the current tab based on user interaction
   *
   * @param {*} e
   * @memberof TabbedContent
   */
  updateCurrentTab(index) {

    let targetIndex = index;

    // If the target index is not equal to the current index (i.e. the clicked tab isn't the current one )
    // update the tabbed content and scroll back to its start.
    if (targetIndex !== this.currentIndex) {

      if(this.tabPanels.item(this.currentIndex)) {
        this.tabPanels.item(this.currentIndex).classList.remove(CLASS_CURRENT);
        this.tabControls.item(this.currentIndex).classList.remove(CLASS_CURRENT);
      }

      if (this.tabPanels.item(targetIndex)) {
        this.tabPanels.item(targetIndex).classList.add(CLASS_CURRENT);
        this.tabControls.item(targetIndex).classList.add(CLASS_CURRENT);
      }

      this.currentIndex = targetIndex;

      if (this.config.sticky) {
        this.setStickyOffset();

        const TOP_OFFSET = getOffset(this.component).top;
        const SCROLL_OFFSET = TOP_OFFSET - this.getHeaderHeight();

        window.scroll({
          top: SCROLL_OFFSET,
          left: 0,
          behavior: "smooth"
        });
      }
    }
  }

  advanceTabs(direction) {
    // Set next slide based on direction
    if (direction === 'n'){
      if((this.currentIndex+1) < this.tabControls.length){
        // let nextTab = this.tabControls.item(this.currentIndex).closest(SEL_TAB_TAB).nextElementSibling.querySelector(SEL_TAB_CONTROL);
        // nextTab.click();
        this.updateCurrentTab(this.currentIndex+1);
      } else {
        this.updateCurrentTab(0);
      }

    } else if (direction === 'p') {
      if(this.currentIndex > 0){
        // let prevTab = this.tabControls.item(this.currentIndex).closest(SEL_TAB_TAB).prevElementSibling.querySelector(SEL_TAB_CONTROL);
        // prevTab.click();
        this.updateCurrentTab(this.currentIndex-1);
      } else {
        this.updateCurrentTab(this.tabControls.length-1);
      }
    } else {
      window.console.log('no direction');
    }
  }

  /**
   *
   *
   * @memberof TabbedContent
   */
  handleAutoplayCycle() {
    this.advanceTabs('n');
  }

  /**
   *
   *
   * @param {*} delay
   * @memberof TabbedContent
   */
  startAutoplay(delay) {
    this.autoplayer = window.setInterval(this.handleAutoplayCycle.bind(this), this.autoplayDelay);
  }

  /**
   *
   *
   * @memberof TabbedContent
   */
  stopAutoplay() {
    window.clearInterval(this.autoplayer);
    this.autoplayer = null;
  }

  /**
   *
   *
   * @memberof TabbedContent
   */
  updateLayout() {
    this.setStickyOffset();
  }

  /**
   *
   *
   * @param {*} e
   * @memberof TabbedContent
   */
  handleTabSelectionEvent(e) {
    e.preventDefault();

    if(this.autoplayer) {
      this.stopAutoplay();
    }

    let targetIndex;

    // Get "tab" node if the click target is not already this
    if(("tabs" in e.target.dataset) && e.target.dataset.tabs === "tab") {
      targetIndex = getIndexOfNode(e.target);
    } else {
      let tabNode = e.target.closest(SEL_TAB_TAB);
      targetIndex = getIndexOfNode(tabNode);
    }

    this.updateCurrentTab(targetIndex);
  }

  /**
   * Subscribes the component to global messages and sets the component's responses via internal custom events
   *
   * @memberof TabbedContent
   */
  subscribeToEvents() {
    PubSub.subscribe(MESSAGES.resize, () => {
      this.component.dispatchEvent(createCustomEvent("updateLayout"));
    });
  }

  /**
   * Bind custom messages for this class
   *
   * @memberof TabbedContent
   */
  bindCustomMessageEvents() {
    this.component.addEventListener("selectTab", this.handleTabSelectionEvent.bind(this));
    //this.component.addEventListener("updateLayout", this.updateLayout.bind(this));
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
