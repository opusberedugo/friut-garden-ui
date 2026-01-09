// Create a map of all images in the assets folder
const glob = import.meta.glob('../../assets/images/*.{png,jpg,jpeg,svg,webp}', { eager: true });

// Create a lookup object where keys are just the filenames for easier matching
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => {
    // key is like "../../assets/images/filename.jpg"
    // we want just "filename.jpg"
    const filename = key.split('/').pop();
    return [filename, value.default];
  })
);

function Image({ src, alt, imgClass, figureClass }) {
  let imageSrc = src;

  // If src isn't a URL and exists in our map (checking by filename)
  if (src && !src.startsWith('http')) {
    const filename = src.split('/').pop(); // Handle paths like "../assets/images/foo.jpg" by taking just "foo.jpg"
    if (images[filename]) {
      imageSrc = images[filename];
    } else {
      console.warn(`Image component: Could not find image "${filename}" in assets/images/`);
    }
  }

  return (
    <figure className={figureClass}>
      <img src={imageSrc} alt={alt} className={imgClass} />
    </figure>
  )
}

export default Image