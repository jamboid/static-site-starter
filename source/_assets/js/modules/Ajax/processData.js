
export default function processData(rawData) {
  console.log(rawData);
  const processedData = [];

  for (var i = 0; i < rawData.length; i++) {
    const rawRepo = rawData[i];
    const processedRepo = {};

    processedRepo.id = rawRepo.id;
    processedRepo.name = rawRepo.name;
    processedRepo.description = rawRepo.description;
    processedRepo.url = rawRepo.html_url;
    processedRepo.watchers = rawRepo.watchers_count;
    processedRepo.stars = rawRepo.stargazers_count;

    processedData.push(processedRepo);
  }

  return processedData;
}
