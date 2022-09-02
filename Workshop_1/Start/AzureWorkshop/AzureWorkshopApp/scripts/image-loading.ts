﻿interface ImageInfo {
    cleanLink: string;
    actualLink: string;
}

var gallery: ImageInfo[] = [];

const fetchImageLinksTS = () => {
    fetch("api/Images").then(async (response) => {
        if (!response.ok) {
            var errorContainer = document.getElementById("errors");
            var error = await response.json();
            var paragraph = document.createElement("p");
            paragraph.appendChild(document.createTextNode(error ? error : response.status));
            errorContainer.appendChild(paragraph);
            return;
        } else {
            var fetchedImageLinks: string[] = await response.json();

            var cleanedImageLinks = fetchedImageLinks.map<ImageInfo>(f => ({
                cleanLink: f.split("?")[0],
                actualLink: f
            }));

            const newImages = findNewImages(cleanedImageLinks);

            if (newImages.length === 0) {
                return;
            }

            var divContainer = document.getElementById("stored-images");
            for (const image of newImages) {
                var imageWrapper = createImageElement(image.actualLink);
                divContainer.appendChild(imageWrapper);
            }

            gallery = cleanedImageLinks;
        }
    });
}

const findNewImages = (recentList: ImageInfo[]) => {
    return recentList.filter(i => !gallery.map(g => g.cleanLink).includes(i.cleanLink));
}

const createImageElement = (url: string) => {
    var imageWrapper = document.createElement("span");
    imageWrapper.className = "image-wrapper";

    var imageElement = document.createElement("img");
    imageElement.src = url;
    imageElement.className = "image";

    imageWrapper.appendChild(imageElement);

    return imageWrapper;
}

/* Dropzone */
// "imageUpload" is the camelized version of the HTML element's ID
Dropzone.options.imageUpload = {
    paramName: "files", // The name that will be used to transfer the file
    dictDefaultMessage: "Drop files here or Click to Upload",
    addRemoveLinks: true, // Allows for cancellation of file upload and remove thumbnail
    init: function () {
        var myDropzone = this;
        myDropzone.on("success", function (file, response) {
            myDropzone.removeFile(file);
            fetchImageLinksTS();
        });
    }
};

fetchImageLinksTS();

setInterval(function () {
    fetchImageLinksTS();
}, 5000);