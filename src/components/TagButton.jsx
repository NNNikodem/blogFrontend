const TagButton = ({ tagName, onSelect }) => 
{

    return (
       //li tag
        <li className="tags-list-button" onClick={() => onSelect(tagName)}>
            {tagName}
        </li>
    );
}

export default TagButton;