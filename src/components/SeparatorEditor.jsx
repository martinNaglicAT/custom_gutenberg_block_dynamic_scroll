import { MediaUpload, MediaPlaceholder, RichText } from '@wordpress/block-editor';
import { SelectControl, Button } from '@wordpress/components';

const SeparatorEditor = ({ 
    separator, 
    background, 
    onChangeType, 
    onChangeText, 
    onChangeImage,
    onRemove,
    allowedFormats
}) => {
    return (
        <div className='sec-field separator-editor-container'>
            <SelectControl
                label="Separator Type"
                value={separator.type}
                options={[
                    { label: 'Image', value: 'image' },
                    { label: 'Text', value: 'text' },
                ]}
                onChange={onChangeType}
            />

            {separator.type === 'text' ? (
                <RichText
                    value={separator.content}
                    onChange={onChangeText}
                    placeholder="Enter separator text..."
                    allowedFormats={allowedFormats}
                	keepPlaceholderOnFocus={true} // This ensures the placeholder remains visible on focus
                	__experimentalToolbarPosition="bottom" // This positions the toolbar at the bottom
                />
            ) : (
                <div className="image-upload">
				    <MediaUpload 
				        onSelect={onChangeImage}
				        allowedTypes={['image']} 
				        value={separator} 
				        render={({ open }) => (
				        	<div>
				        		{separator && separator.image ? (
				        			<>
							            <Button onClick={open}>
							                Replace Separator
							            </Button>

		                                <Button
		                                    isSecondary
		                                    onClick={() => {
		                                    	console.log("Remove button in SeparatorEditor clicked");
		                                    	onRemove();
		                                    }}
		                                >
		                                    Remove Separator
		                                </Button>
	                                </>
	                            ) : (
	                            	<></>
	                            )}
                            </div>
				        )}
				    />
				    {separator && separator.image ? (
				        <div style={{ backgroundColor: background }}>
				            <img
				                src={separator.image} 
				                alt="separator"
				            />
				        </div>
				    ) : (
				        <MediaPlaceholder
				            icon="format-image"
				            onSelect={onChangeImage}
				            onSelectURL={(url) => onChangeImage({ url })}
				            allowedTypes={['image']}
				        />
				    )}
				</div>
            )}
        </div>
    );
}

export default SeparatorEditor;
