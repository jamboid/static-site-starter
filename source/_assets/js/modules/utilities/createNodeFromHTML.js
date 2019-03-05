/**
 * Create HTML elements from a string containing HTML tags and content
 *
 * @export
 * @param {*} htmlString
 * @returns
 */
export function createNodeFromHTML(htmlString) {
  const CONTAINER_ELEMENT = document.createElement('div');
  CONTAINER_ELEMENT.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return CONTAINER_ELEMENT.firstChild;
}