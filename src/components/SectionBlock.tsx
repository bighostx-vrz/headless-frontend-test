import { urlFor } from "../sanity";

export default function SectionBlock({ data }: { data: any }) {
  const { 
    width, bgType, bgColor, bgGradient, bgImage, 
    overlayColor, overlayOpacity, textColor, textContent 
  } = data;

  let bgStyle: any = { position: 'relative' };
  
  if (bgType === 'solid' && bgColor?.hex) {
    bgStyle.backgroundColor = bgColor.hex;
  }
  if (bgType === 'gradient' && bgGradient) {
    bgStyle.backgroundImage = bgGradient;
  }
  if (bgType === 'image' && bgImage?.asset) {
    bgStyle.backgroundImage = `url(${urlFor(bgImage).url()})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  const hasOverlay = bgType === 'image' && overlayColor?.hex;
  const overlayHex = overlayColor?.hex || '#000000';
  const opacity = overlayOpacity !== undefined ? overlayOpacity : 0.5;

  let maxWidth = '1000px';
  if (width === 'full') maxWidth = '100%';
  if (width === 'narrow') maxWidth = '700px';

  const tColor = textColor?.hex || 'inherit';

  return (
    <section style={{ ...bgStyle, color: tColor, width: '100%' }}>
      {hasOverlay && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: overlayHex, opacity: opacity, zIndex: 1 }} />
      )}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: maxWidth, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {textContent}
        </div>
      </div>
    </section>
  );
}