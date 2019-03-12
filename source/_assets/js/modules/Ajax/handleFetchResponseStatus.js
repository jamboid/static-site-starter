
export default function handleStatus(response) {
  console.log(response);
  
  if (response.status === 404) {
    return Promise.reject("404");
  } else {
    return response;
  }
}
