import Phaser from 'phaser';

const TEMP_TEXTURE_PREFIX = '__share_texture_';

export interface ShareCardRenderData {
  score: number;
  title?: string;
}

export interface ShareCardImageElement {
  type: 'image';
  textureKey: string;
  frameName?: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  alpha: number;
}

export interface ShareCardTextElement {
  type: 'text';
  text: string;
  style: Phaser.Types.GameObjects.Text.TextStyle;
  x: number;
  y: number;
  originX: number;
  originY: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  alpha: number;
}

export type ShareCardElement = ShareCardImageElement | ShareCardTextElement;

// fontLoader.ts
export const ensureShareFontsLoaded = async (): Promise<void> => {
  if (document.fonts.check('16px CarterOne-Regular')) {
    return;
  }

  const fontUrl = `${import.meta.env.BASE_URL}assets/fonts/CarterOne-Regular.ttf`;

  const font = new FontFace(
    'CarterOne-Regular',
    `url(${fontUrl})`
  );

  await font.load();
  document.fonts.add(font);
  await document.fonts.ready;
};



export const serializeShareCard = (
  container: Phaser.GameObjects.Container
): ShareCardElement[] => {
  const elements: ShareCardElement[] = [];

  const children = container.list as Phaser.GameObjects.GameObject[];
  children.forEach((child) => {
    if ((child as Phaser.GameObjects.GameObject).active === false) {
      return;
    }
    if (child instanceof Phaser.GameObjects.Image) {
      elements.push({
        type: 'image',
        textureKey: child.texture.key,
        frameName: child.frame.name !== '__BASE' ? child.frame.name : undefined,
        x: child.x,
        y: child.y,
        originX: child.originX,
        originY: child.originY,
        scaleX: child.scaleX,
        scaleY: child.scaleY,
        angle: child.angle,
        alpha: child.alpha,
      });
    } else if (child instanceof Phaser.GameObjects.Text) {
      elements.push({
        type: 'text',
        text: child.text,
        style: {
          fontFamily: child.style.fontFamily,
          fontSize: child.style.fontSize,
          color: child.style.color,
          align: child.style.align,
          fontStyle: child.style.fontStyle,
        },
        x: child.x,
        y: child.y,
        originX: child.originX,
        originY: child.originY,
        scaleX: child.scaleX,
        scaleY: child.scaleY,
        angle: child.angle,
        alpha: child.alpha,
      });
    }
  });

  return elements;
};


const imageCache = new Map<string, HTMLImageElement>();

const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(src);
  if (cached) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
};


const degToRad = (deg: number) => (deg * Math.PI) / 180;



// shareImageResolver.ts
export const resolveImagePath = (textureKey: string): string => {
  const tempPath = window.location.href.replace('index.html', '');

  switch (textureKey) {

    case 'sh-character':
      return tempPath + 'assets/images/share/sh-character.png';

    case 'share-text1':
      return tempPath + 'assets/images/share/share-text1.png';

    case 'sh-panel':
      return tempPath + 'assets/images/share/sh-panel.png';

    case 'logo-01':
      return tempPath + 'assets/images/common/logo-01.png';

    case 'title':
      return tempPath + 'assets/images/gameplay/game-title.png';

    case 'sh-large-panel':
      return tempPath + 'assets/images/share/sh-large-panel.png';

    case 'share-bg':
      return tempPath + 'assets/images/share/share-bg.png';

    default:
      console.log(`No image path mapped for textureKey: ${textureKey}`);
      return '';
  }
};


export const renderShareCardToBase64 = async (
  _renderData: ShareCardRenderData,
  _textures: Phaser.Textures.TextureManager, // unused, kept for signature compatibility
  elements: ShareCardElement[],
  canvasWidth: number,
  canvasHeight: number
): Promise<string> => {

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create canvas context');
  }
  for (const element of elements) {
    ctx.save();

    ctx.globalAlpha = element.alpha;
    ctx.translate(element.x, element.y);
    ctx.rotate(degToRad(element.angle));
    ctx.scale(element.scaleX, element.scaleY);

    if (element.type === 'image') {
      const src = resolveImagePath(element.textureKey);
      const img = await loadImage(src);

      const drawX = -img.width * element.originX;
      const drawY = -img.height * element.originY;

      ctx.drawImage(img, drawX, drawY);
    } else {
      // TEXT (final_score, final_time)
      const style = element.style;

      const fontSize =
        typeof style.fontSize === 'number'
          ? `${style.fontSize}px`
          : style.fontSize ?? '48px';

      const fontStyle = style.fontStyle ?? 'normal';

      const family = style.fontFamily ?? 'CarterOne-Regular';
      ctx.font = `${fontStyle} ${fontSize} ${family}`;
      ctx.fillStyle = style.color ?? '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(element.text, 0, 0);
    }

    ctx.restore();
  }

  try {
    const returnData = canvas.toDataURL('image/png');
    return returnData;
  } catch (error) {
    return JSON.stringify(error);
  }
};


