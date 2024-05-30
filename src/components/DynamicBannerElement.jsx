import { SelectControl} from '@wordpress/components';
import ImageEditor from './ImageEditor';
import TextEditor from './TextEditor';

const DynamicBannerElement = ({ 
    elementKey, 
    element, 
    onChangeElementType, 
    onChangeElementImage, 
    onRemoveElementImage, 
    onChangeElementContent, 
    background, 
    allowedTextFormats 
}) => {
    return (
        <div className='element' key={elementKey}>
            <div className='element-type'>
                <SelectControl
                    label='Element Type'
                    value={element.type} 
                    options={[
                        { label: 'Image', value: 'image' },
                        { label: 'Text', value: 'text' },
                    ]}
                    onChange={(newType) => onChangeElementType(newType, elementKey)}
                />
            </div>
            <div className='element-content'>
                {element.type === 'image' ? (
                    <ImageEditor 
                        element={element}
                        onChangeElementImage={(newImage) => onChangeElementImage(newImage, elementKey)}
                        onRemoveElementImage={() => onRemoveElementImage(elementKey)}
                        background={background}
                    />
                ) : (
                    <TextEditor
                        element={element}
                        onChangeElementContent={(newContent) => onChangeElementContent(newContent, elementKey)}
                        allowedFormats={allowedTextFormats()}
                    />
                )}
            </div>
        </div>
    );
};

export default DynamicBannerElement;