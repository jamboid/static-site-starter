import handleError from "Modules/Ajax/handleFetchResponseError";
import handleStatus from "Modules/Ajax/handleFetchResponseStatus";
import handleContentType from "Modules/Ajax/handleFetchResponseContentType";
import processData from "Modules/Ajax/processData";


// Abstract Ajax Get function
export function getJSON(query) {
  return window.fetch(query, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json'
    }),
    simple: true
  })
  .then(handleError)
  .then(handleStatus)
  .then(handleContentType)
  .then(processData)
  .catch(error => {
    console.log(error);
  });
}

export default getJSON;