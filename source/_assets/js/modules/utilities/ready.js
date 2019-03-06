/**
 * ready - Call a function when the page DOM is loaded and complete
 *
 * @param {function} fn Description
 */
export default function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}