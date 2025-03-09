// Returns a blob:// URL which points
// to a javascript file which will call
// importScripts with the given URL
export default function getWorkerURL(url: string) {
   const content = `importScripts( "${url}" );`;
   return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
}