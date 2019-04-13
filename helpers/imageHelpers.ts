/**
 * Load image object from file.
 * @param {File} file - The input file.
 * @returns {Promise} - The loaded image.
 */
export function loadImage(file: File): Promise<any> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = (imageEvent) => {
        resolve(image);
      };
      if (readerEvent.target) {
        image.src = readerEvent.target['result'];
      }
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Get dimensions based on maxSize.
 * @param {number} width - Original image width.
 * @param {number} height - Original image height.
 * @param {number} maxSize - The maximum size for the larger one of width or height.
 * @returns {number[]} - Scaled width and height.
 */
export function getSize(width: number, height: number, maxSize: number): number[] {
  if (maxSize === 0) {
    return [width, height];
  }
  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
  }

  return [width, height];
}
