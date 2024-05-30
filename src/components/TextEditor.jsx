import React from 'react';
import { RichText } from '@wordpress/block-editor';
import { Button, RadioControl } from '@wordpress/components';

const TextEditor = ({ 
    element, 
    onChangeElementContent, 
    onChangeElementFont, 
    allowedFormats 
}) => {



    return(
        /* Input field for text type */
            <RichText
                //tagName="blockquote" // Use the appropriate HTML tag
                value={element.content} 
                onChange={(newContent) => onChangeElementContent(newContent)}
                allowedFormats={allowedFormats}
                className="custom-rich-text"
                keepPlaceholderOnFocus={true} 
                __experimentalToolbarPosition="bottom" 
            />

    );
};

export default TextEditor;