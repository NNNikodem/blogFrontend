const ImageButton = ({ imageSrc, altText, imageClassName, navPath }) => {
  return (
    // <button className="image-button" onClick={onClick} aria-label={altText}>
    //   <img src={imageSrc} alt={altText} className={imageClassName} />
    // </button>

    <a className="image-button" aria-label={altText} href={navPath}>
      <img src={imageSrc} alt={altText} className={imageClassName} />
    </a>
  );
};
export default ImageButton;
