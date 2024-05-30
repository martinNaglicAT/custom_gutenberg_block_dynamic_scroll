/*const previewContainer = document.querySelector('.wp-block-mn-custom-block-dynamic-banner-dynamic-banner .preview-container .preview .slide-track');
const images = previewContainer.querySelectorAll('.dynamic-banner-element');

function duplicateImages() {
    images.forEach((img) => {
        const duplicateImg = img.cloneNode(true);
        previewContainer.appendChild(duplicateImg);
    });
}

function removeOffscreenImages() {
    const firstImage = images[0];
    const rect = firstImage.getBoundingClientRect();
    
    if (rect.right < 0) {
        previewContainer.removeChild(firstImage);
    }
}

setInterval(() => {
    duplicateImages();
    removeOffscreenImages();
}, 1000); */