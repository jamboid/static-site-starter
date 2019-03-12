

export default function handleContentType(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return Promise.reject("There was an error in handling the response content type");
}