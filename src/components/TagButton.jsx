const TagButton = ({ tagName, onSelect }) => {
  return (
    //li tag
    <li className="tags-list-button" onClick={() => onSelect(0, tagName)}>
      {tagName}
    </li>
  );
};

export default TagButton;
