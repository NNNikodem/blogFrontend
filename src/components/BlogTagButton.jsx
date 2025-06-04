const BlogTagButton = ({ tag, onSelectTag, blogCard }) => {
  return (
    <span
      className={blogCard ? "blog-tag" : "blog-detail-tag"}
      onClick={() => onSelectTag(tag.name)}
    >
      {tag.name}
    </span>
  );
};
export default BlogTagButton;
