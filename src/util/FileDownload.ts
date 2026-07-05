

/**
 * Downloads a file (same as save project...)
 */
export function DownloadFile(name: string, blob: any) {
  const url = URL.createObjectURL(blob);
  const d = document.createElement("a");
  d.href = url;
  d.download = name;
  d.click();
  d.remove();
  window.URL.revokeObjectURL(url);
}


/**
 * Saves the project and downloads it
 */
export function SaveProject(name: string, blobdata: any) {
  
		const blob = new Blob([blobdata], 
				      { type: 'application/json' });
		let uobj = URL.createObjectURL(blob);
		let adown = document.createElement("a");
		adown.href = uobj;
		adown.download = `${name}.json`;
		adown.click();
		adown.remove();
		window.URL.revokeObjectURL(uobj);
}


export const Web = {
	DownloadFile,
	SaveProject,
}
