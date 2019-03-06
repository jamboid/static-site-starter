"use strict";

import wrapElement from "Modules/Utilities/wrapElement";
import ready from "Modules/Utilities/ready";

//import { initModule as initShowhide } from "Modules/showhide/Showhide";
import { initModule as initModal } from "Modules/Modal/Modal";
import SmartImageAPI from "Modules/SmartImage";
import InlineVideoAPI from "Modules/InlineVideo";
import { initModule as initNav } from "Modules/Navigation/NavigationManager";
import { initModule as initTabs } from "Modules/Tabs/Tabs";

/**
 * initialiseComponentModules - call module init functions
 *
 * @returns {type} Description
 */ 
function initialiseComponentModules() {
  initNav(); 
  SmartImageAPI.initSmartImages(); 
  InlineVideoAPI.initInlineVideos();
  initModal();
  initTabs();

  // Wrap tables in container to allow overflow scroll
  // This is a small enough bit of functionality to put on it's own here.
  // But should be moved if more layout functionality warrants the creation
  // of a Layout module

  const tables = document.querySelectorAll('.tx_Prose table');

  tables.forEach(element => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('ob_Table');
    wrapElement(element,wrapper);
  });
}

ready(initialiseComponentModules);
