// Analytics Module
"use strict";

//////////////////////
// Module Functions //
//////////////////////

/**
 * Fire a custom Google Analytics page event
 *
 * @export
 * @param {*} category
 * @param {*} action
 * @param {*} label
 * @param {*} value
 */
export function trackPageEvent (category, action, label, value) {
  const THIS_CATEGORY = category;
  const THIS_ACTION = action;
  const THIS_LABEL = (typeof label === 'undefined') ? undefined : label;
  const THIS_VALUE = (typeof value === 'undefined') ? undefined : value;

  // Tag Manager events
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      'event': 'GAEvent',
      'eventCategory': THIS_CATEGORY,
      'eventAction': THIS_ACTION,
      'eventLabel': THIS_LABEL,
      'eventValue': THIS_VALUE
    });

  } else { // TODO: Added fallbacks for UA and GA legacy scripts

    // window.console.log("Page Event tracked");
    // window.console.log('Event Category:');
    // window.console.log(thisCategory);
    // window.console.log('Event Action:');
    // window.console.log(thisAction);
    // window.console.log('Event Label:');
    // window.console.log(thisLabel);
    // window.console.log('Event Value:');
    // window.console.log(thisValue);

    window.console.log("Google Tag Manager not available");
  }
}