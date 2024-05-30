import React from 'react';
import { MediaUpload, MediaPlaceholder } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

const ImageEditor = ({ 
    element, 
    onChangeElementImage, 
    onRemoveElementImage,
    background 
}) => {
    return (
        <div className="image-upload">
            {element && element.image ? (
                <>
                    <MediaUpload
                        onSelect={(media) => onChangeElementImage({ image: media.url, id: media.id }, element.key)}
                        allowedTypes={['image']}
                        value={element.id} // Use the ID to identify the current selection
                        render={({ open }) => (
                            <>
                                <Button onClick={open} className="image-editor-button">
                                    Replace Image
                                </Button>
                                <Button
                                    isSecondary
                                    onClick={() => onRemoveElementImage(element.key)}
                                    className="image-editor-button">
                                    Remove Image
                                </Button>
                            </>
                        )}
                    />
                    <div style={{ backgroundColor: background }}>
                        <img src={element.image} alt=""/>
                    </div>
                </>
            ) : (
                <MediaPlaceholder
                    icon="format-image"
                    onSelect={(media) => onChangeElementImage({ image: media.url, id: media.id }, element.key)}
                    onSelectURL={(url) => onChangeElementImage({ image: url }, element.key)}
                    allowedTypes={['image']}
                />
            )}
        </div>
    );
};

export default ImageEditor;
