/**
 * Converts any encoded characters in a string to their unencoded versions - e.g. &amp to &
 *
 * @param {string} text
 *
 * @returns {string}
 */
export default function decodeCharacters(text) {
  let elem = document.createElement('textarea');
  elem.innerHTML = text;

  return elem.value;
}