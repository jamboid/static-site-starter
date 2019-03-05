/**
 * createGlobalMessenger
 *
 * @export
 * @param {string} eventType
 * @param {string} selector
 * @param {string} message
 * @param {boolean} preventBubble
 */
export function createGlobalMessenger(eventType, selector, message, preventBubble) {
  delegate(document.body, selector, eventType, (e) => {
    if (preventBubble) {
      e.preventDefault();
      e.stopPropagation();
    }

    PubSub.publish(message, e);
  }, false);
} 