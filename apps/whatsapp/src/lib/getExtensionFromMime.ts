export function getExtensionFromMime(mime: string) {
  let extension: string = "txt";

  if (mime?.includes("webp")) extension = "webp";
  if (mime?.includes("pdf")) extension = "pdf";
  if (mime?.includes("image/png")) extension = "png";
  if (mime?.includes("apng")) extension = "apng";
  if (mime?.includes("x-freearc")) extension = "arc";

  if (mime?.includes("avif")) extension = "avif";
  if (mime?.includes("video/x-msvideo")) extension = "avi";
  if (mime?.includes("image/bmp")) extension = "bmp";
  if (mime?.includes("application/x-bzip")) extension = "bz";
  if (mime?.includes("application/x-bzip2")) extension = "bz2";
  if (mime?.includes("text/csv")) extension = "csv";
  if (mime?.includes("text/html")) extension = "html";
  if (mime?.includes("wordprocessingml")) extension = "docx";
  if (mime?.includes("presentationml")) extension = "pptx";
  if (mime?.includes("application/gzip")) extension = "gz";
  if (mime?.includes("image/gif")) extension = "gif";
  if (mime?.includes("text/calendar")) extension = "ics";

  if (mime?.includes("image/jpeg")) extension = "jpeg";
  if (mime?.includes("application/json")) extension = "json";
  if (mime?.includes("audio/midi")) extension = "mid";
  if (mime?.includes("audio/x-midi")) extension = "midi";
  if (mime?.includes("application/vnd.rar")) extension = "rar";
  if (mime?.includes("application/rtf")) extension = "rtf";
  if (mime?.includes("image/svg+xml")) extension = "svg";
  if (mime?.includes("image/tiff")) extension = "tiff";
  if (mime?.includes("text/plain")) extension = "txt";

  if (mime?.includes("audio/wav")) extension = "wav";
  if (mime?.includes("audio/webm")) extension = "weba";
  if (mime?.includes("video/webm")) extension = "webv";
  if (mime?.includes("application/zip")) extension = "zip";
  if (mime?.includes("application/xml")) extension = "xml";
  if (mime?.includes("text/xml")) extension = "xml";
  if (mime?.includes("application/zip")) extension = "zip";
  if (mime?.includes("3gpp")) extension = "3gp";
  if (mime?.includes("3gpp2")) extension = "3g2";
  if (mime?.includes("application/x-7z-compressed")) extension = "7z";

  if (mime?.includes("acc")) extension = "acc";
  if (mime?.includes("audio/ogg")) extension = "oga";
  if (mime?.includes("video/ogg")) extension = "ogv";
  if (mime?.includes("audio/mpeg")) extension = "mp3";
  if (mime?.includes("video/mpeg")) extension = "mpeg";
  if (mime?.includes("video/mp4")) extension = "mp4";

  if (mime?.includes("spreadsheetml")) extension = "xlsx";
  if (mime?.includes("excel")) extension = "xlsx";

  return extension;
}
