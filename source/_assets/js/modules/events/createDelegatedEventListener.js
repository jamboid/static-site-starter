import delegate from "delegate";

/**
 * createDelegatedEventListener - Simple factory function to bind a common delegated event listener to the <body> element
 *
 * @param {string} eventType      the event type we're listening for
 * @param {string} selector       the selector for the element event is triggered on
 * @param {string} eventToTrigger custom event we want to send back to target element
 * @param {object} eventData      data passed as part of triggered custom event 
 */
export function createDelegatedEventListener(eventType, selector, eventToTrigger, eventData = null) {
  delegate(document.body, selector, eventType, (e) => {
    e.preventDefault();
    e.stopPropagation();
    const customEvent = createCustomEvent(eventToTrigger, eventData);
    e.target.dispatchEvent(customEvent);
  }, false);
}