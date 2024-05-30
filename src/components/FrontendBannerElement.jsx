import { RichText } from '@wordpress/block-editor';

const FrontendBannerElement = ({ 
  type, 
  content, 
  imageUrl, 
  textColor, 
  separator 
}) => {
  return (
    <React.Fragment>
      <div className={`dynamic-banner-element dynamic-banner-el`}>
        {type === 'image' && imageUrl ? (
          <img src={imageUrl} alt="Dynamic Banner Element" />
        ) : type === 'text' && content ? (
          <RichText.Content tagName="blockquote" value={content} style={{ color: textColor }} />
        ) : null}
      </div>
      {separator && (
        <div className='dynamic-banner-separator dynamic-banner-el'>
          {separator.type === 'image' && separator.image ? (
            <img src={separator.image} alt="Separator" />
          ) : separator.content ? (
            <RichText.Content tagName="blockquote" value={separator.content} style={{ color: textColor }} />
          ) : null}
        </div>
      )}
    </React.Fragment>
  );
}

export default FrontendBannerElement;