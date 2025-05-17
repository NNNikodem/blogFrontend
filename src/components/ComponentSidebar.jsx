import React from "react";

const ComponentSidebar = ({
  components,
  activeComponent,
  onSelectComponent,
}) => {
  return (
    <>
      <h3>Komponenty</h3>
      <ul className="component-list">
        {components.map((component) => (
          <li
            key={component.id}
            className={activeComponent === component.id ? "active" : ""}
            onClick={() => onSelectComponent(component.id)}
          >
            {component.title}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ComponentSidebar;
