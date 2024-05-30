/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { registerFormatType, toggleFormat, applyFormat, removeFormat } from '@wordpress/rich-text';
import { useBlockProps, MediaUpload, MediaPlaceholder, ColorPalette, RichText, RichTextToolbarButton } from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl} from '@wordpress/components';
import ImageEditor from './components/ImageEditor';
import TextEditor from './components/TextEditor';
import DynamicBannerElement from './components/DynamicBannerElement';
import FrontendBannerElement from './components/FrontendBannerElement';
import SeparatorEditor from './components/SeparatorEditor';
import { __ } from '@wordpress/i18n';




// Helper function to generate all possible style tags for font registration.
const generateFontVariations = (font) => {
    const variations = [];
    const weights = font.font_weights;
    const styles = ["normal"];
    if (font.font_style_italic === "italic") {
        styles.push("italic");
    }

    weights.forEach(weight => {
        styles.forEach(style => {
            const tagWeightStyle = `${font.font_tag}-${weight}-${style}`;
            variations.push(tagWeightStyle);
        });
    });

    return variations;
};

//Register fonts
if (typeof dynamicBannerFonts !== 'undefined') {
    const fontsArray = Object.values(dynamicBannerFonts);

    fontsArray.forEach(font => {
        const variations = generateFontVariations(font);

        variations.forEach(tagWeightStyle => {

            const split = tagWeightStyle.split("-").length - 2;
            const [weight, style] = tagWeightStyle.split('-').slice(split); // Extracting weight and style from tagWeightStyle


            registerFormatType(`mn-custom-block-dynamic-banner/${tagWeightStyle}`, {
                title: `${font.font_name} ${weight} ${style}`,
                tagName: 'span',
                className: `${tagWeightStyle}`,
                attributes: {
                    style: 'style'
                },
                edit: ({ isActive, value, onChange }) => {
                    const onClick = () => {
                        let newValue;
                        if (isActive) {
                            newValue = removeFormat(value, `mn-custom-block-dynamic-banner/${tagWeightStyle}`);
                        } else {
                            // Loop through all fonts and remove any other format.
                            fontsArray.forEach(otherFont => {
                                const otherVariations = generateFontVariations(otherFont);

                                otherVariations.forEach(otherTagWeightStyle => {
                                    if (otherTagWeightStyle !== tagWeightStyle) {
                                        newValue = removeFormat(value, `mn-custom-block-dynamic-banner/${otherTagWeightStyle}`);
                                    }
                                });
                            });

                            newValue = applyFormat(newValue, {
                                type: `mn-custom-block-dynamic-banner/${tagWeightStyle}`,
                                attributes: {
                                    style: `font-family: ${font.font_style};font-weight:${weight};font-style:${style};`
                                }
                            });
                        }
                        onChange(newValue);
                    };

                    return (
                        <RichTextToolbarButton
                            icon="editor-textcolor"
                            title={`${font.font_name} ${weight} ${style}`}
                            onClick={onClick}
                            isActive={isActive}
                        />
                    );
                },
            });
        });
    });
} else {
    console.log("ne-dela");
}


// Register the block
registerBlockType( 'mn-custom-block-dynamic-banner/dynamic-banner', {
    apiVersion: 3,
    title: 'Custom Dynamic Banner',
    icon: 'slides',
    category: 'media',
    attributes: {
        element1: {
            type: 'object',
            default: { type: 'image', content: '', image: null, },
        },
        element2: {
            type: 'object',
            default: { type: 'image', content: '', image: null, },
        },
        element3: {
            type: 'object',
            default: { type: 'image', content: '', image: null, },
        },
        element4: {
            type: 'object',
            default: { type: 'image', content: '', image: null, },
        },
        background: {
            type: 'string',
            default: '#000',
        },
        textColor: {
            type:'string',
            default: '#fff',
        },
        separator: {
            type: 'object',
            default: [
                {
                    type: 'image',
                    content: '',
                    image: null,   
                },                
            ],
        },
    },
    edit: (props) => {
        const {
            attributes: { element1, element2, element3, element4, background, separator, textColor },
            setAttributes,
            className,
        } = props;

        const blockProps = useBlockProps();


        const onChangeElementType = (newType, elementKey) => {
            const updatedElement = {
                ...props.attributes[elementKey], 
                type: newType, 
            };
            setAttributes({ [elementKey]: updatedElement });
        };

        const onChangeElementImage = (newImage, elementKey) => {
            setAttributes({ [elementKey]: { ...props.attributes[elementKey], image: newImage.image, type: 'image' } });
        };

        const onRemoveElementImage = (elementKey) => {
            const updatedElement = {
                ...props.attributes[elementKey], 
                image: null, 
                content: '', 
            };
            setAttributes({ [elementKey]: updatedElement });
        };

        const onChangeElementContent = (newContent, elementKey) => {
            setAttributes({ [elementKey]: { ...props.attributes[elementKey], content: newContent, type: 'text' } });
        };


        // Function to change separator type:
        const handleSeparatorTypeChange = (newType) => {
            const updatedSeparator = {...separator};
            updatedSeparator.type = newType;
            setAttributes({ separator: updatedSeparator });
        };

        const onChangeSeparator = (newSeparator) => {
            const updatedSeparator = {...separator};
            updatedSeparator.image = newSeparator.url;

            setAttributes({ separator: updatedSeparator });
        };

        // Function to remove the separator
        const onRemoveSeparator = () => {
            const updatedSeparator = {
                ...separator,
                type: 'image',
                content: '',
                image: null,
            };
            setAttributes({ separator: updatedSeparator });
        };

        // Function to change separator text
        const onChangeSeparatorContent = (newSeparatorContent) => {
            const updatedContentSeparator = {...separator};
            updatedContentSeparator.content = newSeparatorContent;

            setAttributes({ separator: updatedContentSeparator });
            console.log(separator);
        };

        // Function to update the text color
        const onChangeTextColor = (newTextColor) => {
            setAttributes({ textColor: newTextColor });
        };

        // Function to update the background color
        const onChangeBackground = (newColor) => {
            setAttributes({ background: newColor });
        };

        const allowedTextFormats = () => {
            const fontsArray = Object.values(dynamicBannerFonts);
            let fontFormats = [];
            
            fontsArray.forEach(font => {
                const variations = generateFontVariations(font);
                fontFormats = [...fontFormats, ...variations.map(variation => `mn-custom-block-dynamic-banner/${variation}`)];
            });

            const coreFormats = ['core/link'];
            const allowedFormats = [...fontFormats, ...coreFormats];

            return allowedFormats;
        };


        try {
            return (
                <div {...blockProps}>
                    <div className='set-elements'>                    

                        <DynamicBannerElement 
                            elementKey="element1" 
                            element={element1} 
                            onChangeElementType={onChangeElementType} 
                            onChangeElementImage={onChangeElementImage} 
                            onRemoveElementImage={onRemoveElementImage} 
                            onChangeElementContent={onChangeElementContent} 
                            background={background} 
                            allowedTextFormats={allowedTextFormats}
                        />

                        <DynamicBannerElement 
                            elementKey="element2" 
                            element={element2} 
                            onChangeElementType={onChangeElementType} 
                            onChangeElementImage={onChangeElementImage} 
                            onRemoveElementImage={onRemoveElementImage} 
                            onChangeElementContent={onChangeElementContent} 
                            background={background} 
                            allowedTextFormats={allowedTextFormats}
                        />

                        <DynamicBannerElement 
                            elementKey="element3" 
                            element={element3} 
                            onChangeElementType={onChangeElementType} 
                            onChangeElementImage={onChangeElementImage} 
                            onRemoveElementImage={onRemoveElementImage} 
                            onChangeElementContent={onChangeElementContent} 
                            background={background} 
                            allowedTextFormats={allowedTextFormats}
                        />

                        <DynamicBannerElement 
                            elementKey="element4" 
                            element={element4} 
                            onChangeElementType={onChangeElementType} 
                            onChangeElementImage={onChangeElementImage} 
                            onRemoveElementImage={onRemoveElementImage} 
                            onChangeElementContent={onChangeElementContent} 
                            background={background} 
                            allowedTextFormats={allowedTextFormats}
                        />


                    </div>

                    <div className='secondary-container'>

                        <SeparatorEditor
                            separator={separator}
                            background={background}
                            onChangeType={handleSeparatorTypeChange}
                            onChangeText={onChangeSeparatorContent}
                            onChangeImage={onChangeSeparator}
                            onRemove={onRemoveSeparator}
                            allowedFormats={allowedTextFormats()}
                        />

                        {/* Interface for text color selection */}
                        <div className="sec-field background-color">
                            <span>Text</span>
                            <ColorPalette
                                value={textColor}
                                onChange={(newTextColor) => onChangeTextColor(newTextColor)}
                            />
                        </div>

                        {/* Interface for background color selection */}
                        <div className="sec-field background-color">
                            <span>Background</span>
                            <ColorPalette
                                value={background}
                                onChange={(newColor) => onChangeBackground(newColor)}
                            />
                        </div>
                    </div>

                    <div className='preview-container'>
                        <span>Predogled</span>
                        <div className="preview" style={{ backgroundColor: background }}>
                            <div className='slide-track'>

                                { element1.content != '' || element1.image ? (

                                    <FrontendBannerElement 
                                        type={element1.type} 
                                        content={element1.content} 
                                        imageUrl={element1.image} 
                                        textColor={textColor} 
                                        separator={separator} 
                                    />
                                ) : (
                                    <></>
                                )}

                                { element2.content != '' || element2.image ? (

                                    <FrontendBannerElement 
                                        type={element2.type} 
                                        content={element2.content} 
                                        imageUrl={element2.image} 
                                        textColor={textColor} 
                                        separator={separator} 
                                    />
                                ) : (
                                    <></>
                                )}

                                { element3.content != '' || element3.image ? (

                                    <FrontendBannerElement 
                                        type={element3.type} 
                                        content={element3.content} 
                                        imageUrl={element3.image} 
                                        textColor={textColor} 
                                        separator={separator} 
                                    />
                                ) : (
                                    <></>
                                )}

                                { element4.content != '' || element4.image ? (

                                    <FrontendBannerElement 
                                        type={element4.type} 
                                        content={element4.content} 
                                        imageUrl={element4.image} 
                                        textColor={textColor} 
                                        separator={separator} 
                                    />
                                ) : (
                                    <></>
                                )}

                            </div>
                        </div>

                    </div>



                </div>
            );
        } catch (error) {
            // Error handling
            console.error('An error occurred:', error);
            return <div>An error occurred. Please check the console for details.</div>;
        }
    },
    save: (props) => {
        const { element1, element2, element3, element4, background, separator, textColor } = props.attributes;

        const renderElement = (element) => {
            return (
                <>
                    <div className={`dynamic-banner-element dynamic-banner-el`}>
                        {element.type === 'image' && element.url ? (
                            <img src={element.url} alt="" />
                        ) : element.type === 'text' && element.content ? (
                            <blockquote style={{ color: textColor }}>{element.content}</blockquote>
                        ) : null}
                    </div>
                    {separator && (
                        <div className='dynamic-banner-separator dynamic-banner-el'>
                            {separator.type === 'image' && separator.image ? (
                                <img src={separator.image} alt="Separator" />
                            ) : separator.content ? (
                                <blockquote style={{ color: textColor }}>{separator.content}</blockquote>
                            ) : null}
                        </div>
                    )}
                </>
            );
        };

        return (
            <div className="preview" style={{ backgroundColor: background }}>
                <div className='slide-track'>
                    {renderElement(element1)}
                    {renderElement(element2)}
                    {renderElement(element3)}
                    {renderElement(element4)}
                </div>
            </div>
        );
    },
});
