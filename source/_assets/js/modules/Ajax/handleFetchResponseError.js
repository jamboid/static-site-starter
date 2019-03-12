
export default function handleError(response) {
  return response.ok ? response : Promise.reject(response.statusText);
}