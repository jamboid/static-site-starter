import delegate from "delegate";

/**
 * createGlobalMessenger
 *
 * @export
 * @param {string} eventType
 * @param {string} selector
 * @param {string} message
 * @param {boolean} preventBubble
 */
export default function createGlobalMessenger(eventType, selector, message, preventBubble) {
  delegate(document.body, selector, eventType, (e) => {
    if (preventBubble) {
      e.preventDefault();
      e.stopPropagation();
    }

    PubSub.publish(message, e);
  }, false);
} 