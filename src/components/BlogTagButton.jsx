const BlogTagButton = ({ tag, onSelectTag }) => {
  return (
    <span className="blog-tag" onClick={() => onSelectTag(tag.name)}>
      {tag.name}
    </span>
  );
};
export default BlogTagButton;
