# Simple Photo Gallery Created by Google Slides and Web Apps using Google Apps Script

<a name="overview"></a>

# Overview

**This is a sample script for achieving a simple photo gallery created by Google Slides and Web Apps using Google Apps Script.**
<a name="description"></a>

# Description

At Google, there is a great Google Photos. [Ref](https://www.google.com/photos/about/) Recently, I was required to have a simple photo gallery. At that time, I thought that when an independence photo gallery instead of Google Photos can be used, it will be useful. Also, this might be useful
for other users. So I published this.

In this photo gallery, Google Slides and Web Apps are used as the storage of images and the photo gallery, respectively. And, Google Apps Script is used for the interface for connecting Google Slides and Web Apps. In this script, [`lightgallery.js`](https://github.com/sachinchoolur/lightgallery.js) is used for the photo gallery at HTML side.

# Demo

![](images/fig1.gif)

These images in this demonstration are from [http://k3-studio.deviantart.com/](http://k3-studio.deviantart.com/).

# Usage

## 1. Create Google Slides.

At first, please create new Google Slides at your Google Drive after you logged in to Google Drive.

## 2. Prepare script.

Please copy and paste the following scripts to the script editor of the created Google Slides.

### Google Apps Script (`Code.gs`)

This is a Google Apps Script.

```javascript
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
```

### HTML&Javascript (`index.html`)

This is a HTML. Please create HTML file at the script editor, and copy and paste the following script to HTML file. And, save the Google Apps Script project.

```html
<link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery.js@1.2.0/src/css/lightgallery.css" />
<script src="https://cdn.jsdelivr.net/npm/lightgallery.js@1.2.0/dist/js/lightgallery.min.js"></script>
<div>
<label id="label" for="file" style="color: white; background-color: deepskyblue; border-radius: 3px;">
Upload images
<input type="file" id="file" multiple="true" style="display:none;" accept="image/png,image/jpeg">
</div>
<div id="status"></div>
<div id="lightgallery"></div>

<script>
function showImages(urls) {
  if (urls.length == 0) return;
  const lightgallery = document.getElementById("lightgallery");
  lightgallery.innerHTML = "";
  urls.forEach(url => {
    const a = document.createElement("a");
    a.setAttribute("href", url);
    const img = document.createElement("img");
    img.setAttribute("src", url);
    img.setAttribute("width", 200);
    a.appendChild(img);
    lightgallery.appendChild(a);
  });
  lightGallery(document.getElementById('lightgallery'), {download: false});
}

const f = document.getElementById('file');
f.addEventListener("change", () => {
  if (f.files.length > 0) {
    const status = document.getElementById("status");
    status.innerHTML = "Now uploading...";
    Promise.all([...f.files].map((file, i) => {
      const fr = new FileReader();
      return new Promise(r => {
        fr.onload = e => {
          const data = e.target.result.split(",");
          r({fileName: file.name, mimeType: data[0].match(/:(\w.+);/)[1], data: data[1]});
        }
        fr.readAsDataURL(file);
      });
    }))
    .then(images => {
      google.script.run
      .withFailureHandler(err => {
        console.log(err);
        status.innerHTML = "";
      })
      .withSuccessHandler(() => {
        main();
        status.innerHTML = "";
      }).appendImages(images);
    });
  }
});

function main() {
  google.script.run.withFailureHandler(err => console.log(err)).withSuccessHandler(showImages).getImages();
}

main();
</script>
```

## 3. Deploy Web Apps.

The detail information can be seen at [the official document](https://developers.google.com/apps-script/guides/web#deploy_a_script_as_a_web_app). The following flow is for new script editor.

1. On the script editor, at the top right of the script editor, please click "click Deploy" -> "New deployment".
2. Please click "Select type" -> "Web App".
3. Please input the information about the Web App in the fields under "Deployment configuration".
4. Please select **"Me"** for **"Execute as"**.
5. Please select **"Anyone"** for **"Who has access"**.
   - By this setting, anyone can access to your Web Apps.
   - Of course, you can use the access token for this situation. But in this case, as a simple setting, I use the access key instead of the access token. You can see the detail of this at [this document](https://github.com/tanaikech/taking-advantage-of-Web-Apps-with-google-apps-script).
6. Please click "Deploy" button.
7. When "The Web App requires you to authorize access to your data" is shown, please click "Authorize access".
8. Automatically open a dialog box of "Authorization required".
   1. Select own account.
   2. Click "Advanced" at "This app isn't verified".
   3. Click "Go to ### project name ###(unsafe)"
   4. Click "Allow" button.
9. Copy the URL of Web App. It's like `https://script.google.com/macros/s/###/exec`.
   - **When you modified the Google Apps Script, please redeploy as new version. By this, the modified script is reflected to Web Apps. Please be careful this.**

## 4. Testing

Please access to the URL of your Web Apps. After you did above flow, you have already had the URL like `https://script.google.com/macros/s/###/exec`.

When you access to the Web Apps, there are no images. So please upload a sample image. By this, you can see it on the Web Apps. For example, when you want to delete the image, please delete the slides on Google Slides. By this, when the Web Apps is opened, the images are updated.

# Note

- This is a simple photo gallery. So when you want to add more functions, please modify the script.

# References

- [Web Apps](https://developers.google.com/apps-script/guides/web)
- [Taking advantage of Web Apps with Google Apps Script](https://github.com/tanaikech/taking-advantage-of-Web-Apps-with-google-apps-script)

---

<a name="licence"></a>

# Licence

[MIT](LICENCE)

<a name="author"></a>

# Author

[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to tell me.

<a name="updatehistory"></a>

# Update History

- v1.0.0 (January 24, 2021)

  1. Initial release.

[TOP](#top)
