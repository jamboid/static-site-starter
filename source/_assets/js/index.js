"use strict";

import wrapElement from "Modules/Utilities/wrapElement";
import ready from "Modules/Utilities/ready";

import ShowhideAPI from "Modules/Showhide";
import ModalAPI from "Modules/Modal";
import SmartImageAPI from "Modules/SmartImage";
import InlineVideoAPI from "Modules/InlineVideo";
import NavigationAPI from "Modules/Navigation";
import TabsAPI from "Modules/Tabs";
import CarouselAPI from "Modules/Carousel";

/**
 * initialiseComponentModules - call module init functions
 *
 * @returns {type} Description
 */ 
function initialiseComponentModules() {
  NavigationAPI.initialiseNavigation();
  SmartImageAPI.initSmartImages(); 
  InlineVideoAPI.initInlineVideos();
  ModalAPI.initialiseModals();
  TabsAPI.initialiseTabs();
  ShowhideAPI.initialiseShowhide();
  CarouselAPI.initiliseCarousels();

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
