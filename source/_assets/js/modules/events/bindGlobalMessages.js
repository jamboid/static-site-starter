/**
 * bindGlobalMessages - Binds event listeners to global browser events and fires global messages in response
 *
 * @returns {type} Description
 */
export function bindGlobalMessages() {
  // Handle page scroll if browser doesn't support IntersectionObserver API.
  // This may have to be updated if we're looking to bind events and activity
  // to the actual page scroll, rather than using it as a IO fallback, but for 
  // now let's assume that's what's going on here.
  if (typeof (window.IntersectionObserver) === 'undefined') {
    window.addEventListener('scroll', function () {
      // Publish global message
      PubSub.publish(MESSAGES.scroll);
    });
  }

  // Handle debounced resize
  window.onresize = debounce(function () {
    // Publish global  message
    PubSub.publish(MESSAGES.resize);
  }, 200);
}