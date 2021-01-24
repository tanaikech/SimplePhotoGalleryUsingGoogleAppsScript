const doGet = (_) => HtmlService.createHtmlOutputFromFile("index");

function getImages() {
  return SlidesApp.getActivePresentation()
    .getSlides()
    .map((e) =>
      e.getImages().length > 0 ? e.getImages()[0].getContentUrl() : ""
    )
    .filter(String);
}

function appendImages(images) {
  const s = SlidesApp.getActivePresentation();
  images.forEach((e) => {
    const image = s
      .appendSlide()
      .insertImage(
        Utilities.newBlob(
          Utilities.base64Decode(e.data),
          e.mimeType,
          e.fileName
        )
      );
    image.setTitle(e.fileName);
    image.setDescription(new Date().toISOString());
  });
  s.saveAndClose();
  return getImages();
}
