"use client";

import React from "react";

export type FileInput = {
  file: Blob;
  filename: string;
};

export function useDownloadFiles() {
  const downloadFiles = React.useCallback((inputs: FileInput[], delayMs: number = 100) => {
    // Create a hidden anchor element for triggering downloads
    const anchorElement = document.createElement("a");
    anchorElement.style.display = "none";
    document.body.appendChild(anchorElement);

    // Function to trigger the download for a single file
    const triggerFileDownload = (input: FileInput) => {
      return new Promise<void>((resolve) => {
        anchorElement.href = URL.createObjectURL(input.file);
        anchorElement.download = input.filename;
        anchorElement.click();
        resolve();
      });
    };

    // Sequentially download files with a delay between each download
    const downloadFilesSequentially = async () => {
      if (inputs.length > 0) {
        for (let i = 0; i < inputs.length; i++) {
          await triggerFileDownload(inputs[i]!);
          if (i < inputs.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      }
      // Remove the anchor element after all downloads are complete
      document.body.removeChild(anchorElement);
    };

    downloadFilesSequentially();
  }, []);

  return downloadFiles;
}
