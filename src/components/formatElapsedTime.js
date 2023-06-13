export function formatElapsedTime(elapsedTime) {
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = elapsedTime % 1000;

  return `${minutes.toString().padStart(2, "0")}分${seconds
    .toString()
    .padStart(2, "0")}秒${milliseconds.toString().padStart(3, "0")}`;
}
