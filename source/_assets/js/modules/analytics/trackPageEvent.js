/**
 * Fire a custom Google Analytics page event
 *
 * @export
 * @param {*} category
 * @param {*} action
 * @param {*} label
 * @param {*} value
 */
export default function trackPageEvent (category, action, label, value) {
  const THIS_CATEGORY = category;
  const THIS_ACTION = action;
  const THIS_LABEL = (typeof label === 'undefined') ? undefined : label;
  const THIS_VALUE = (typeof value === 'undefined') ? undefined : value;

  // Tag Manager events
  if (typeof dataLayer !== 'undefined') {
    
    // Push event information to a generic GAEvent event set up in GTM
    // Details can be found here: https://www.simoahava.com/analytics/create-a-generic-event-tag/
    dataLayer.push({
      'event': 'GAEvent',
      'eventCategory': THIS_CATEGORY,
      'eventAction': THIS_ACTION,
      'eventLabel': THIS_LABEL,
      'eventValue': THIS_VALUE
    });

  } else if (typeof ga !== "undefined") {
    
    // Using Google Universal Analytics
    ga("send", "event", thisCategory, thisAction, thisLabel);
  
  } else if (typeof _gaq !== "undefined") {
  
    // Using Asynchronous Analytics
    _gaq.push(["_trackEvent", thisCategory, thisAction, thisLabel]);
  
  } else {
    // window.console.log("Page Event tracked");
    // window.console.log('Event Category:');
    // window.console.log(thisCategory);
    // window.console.log('Event Action:');
    // window.console.log(thisAction);
    // window.console.log('Event Label:');
    // window.console.log(thisLabel);
    // window.console.log('Event Value:');
    // window.console.log(thisValue);

    window.console.log("Google Analytics is not available");
  }
}