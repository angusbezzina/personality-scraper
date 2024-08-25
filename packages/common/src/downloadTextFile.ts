export function downloadTextAsFile(fileName: string, content: string) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });

  element.href = URL.createObjectURL(file);
  element.download = `${fileName}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
