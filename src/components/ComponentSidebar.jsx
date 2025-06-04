import React from "react";
import { useNavigate } from "react-router-dom";
const ComponentSidebar = ({
  components,
  activeComponent,
  onSelectComponent,
}) => {
  const navigate = useNavigate();
  const handleClick = (componentId) => {
    onSelectComponent(componentId);
    navigate(`/components?component=${componentId}`);
  };
  return (
    <>
      <h3>Komponenty</h3>
      <ul className="component-list">
        {components.map((component) => (
          <li
            key={component.id}
            className={activeComponent === component.id ? "active" : ""}
            onClick={() => {
              handleClick(component.id);
            }}
          >
            {component.title}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ComponentSidebar;
