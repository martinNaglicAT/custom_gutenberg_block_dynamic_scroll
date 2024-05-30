/*document.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){
        const iframe = document.querySelector('iframe[name="editor-canvas"]');

        function handleIframeLoad() {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const previewContainer = iframeDocument.querySelector('.wp-block-mn-custom-block-dynamic-banner-dynamic-banner .preview-container .slide-track');
            if (!previewContainer) {
                console.log('Preview container not found');
                return;
            }

            const images = previewContainer.querySelectorAll('.dynamic-banner-el');

            function duplicateImages() {
                images.forEach((img) => {
                    const duplicateImg = img.cloneNode(true);
                    previewContainer.appendChild(duplicateImg);
                });
            }

            function removeOffscreenImages() {
                const firstImage = images[0];
                if (firstImage) {
                    const rect = firstImage.getBoundingClientRect();
                    
                    if (rect.right < 0) {
                        previewContainer.removeChild(firstImage);
                    }
                }
            }

            setInterval(() => {
                duplicateImages();
                removeOffscreenImages();
            }, 1000);
        }

        if (iframe) {
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                handleIframeLoad();
            } else {
                iframe.addEventListener('load', handleIframeLoad);
            }
        } else {
            console.log('Iframe not found');
        }
    }, 1000);
});*/
