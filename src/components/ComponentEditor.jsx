import React, { useState, useEffect } from "react";
import "../css/ComponentsManagementPage.css";

const ComponentEditor = ({
  title,
  componentName,
  component,
  setComponent,
  updateFn,
}) => {
  const [editedComponent, setEditedComponent] = useState(component);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setEditedComponent(component);
  }, [component]);

  if (!component) return <div>Loading {title}...</div>;

  // Handle change for simple fields
  const handleChange = (e, path = []) => {
    const value = e.target.value;

    // Create a deep copy of the component
    const updatedComponent = JSON.parse(JSON.stringify(editedComponent));

    // Navigate to the correct nested property and update it
    let current = updatedComponent;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    // Set the value at the final path
    if (path.length > 0) {
      current[path[path.length - 1]] = value;
    }

    setEditedComponent(updatedComponent);
  };

  // Toggle expanded state for nested objects and arrays
  const toggleExpand = (path) => {
    const pathKey = path.join(".");
    setExpandedSections((prev) => ({
      ...prev,
      [pathKey]: !prev[pathKey],
    }));
  };

  // Check if a section is expanded
  const isExpanded = (path) => {
    const pathKey = path.join(".");
    return expandedSections[pathKey];
  };

  // Recursive function to render form fields for nested objects and arrays
  const renderFormField = (key, value, path = []) => {
    const currentPath = [...path, key];

    // Handle null values
    if (value === null) {
      return (
        <div key={currentPath.join(".")} className="form-group">
          <label>{key}</label>
          <input
            type="text"
            value=""
            placeholder="null"
            onChange={(e) => handleChange(e, currentPath)}
          />
        </div>
      );
    }

    // Handle arrays
    if (Array.isArray(value)) {
      const isMenuItemsPath = componentName === "menu" && key === "menuItems";
      const isDropdownSubItemsPath =
        componentName === "menu" &&
        path.length === 2 &&
        path[0] === "dropdownMenuItems" &&
        path[1] === 0 &&
        key === "dropdownMenuItems";

      return (
        <div key={currentPath.join(".")} className="form-group nested-group">
          <div
            className="nested-header"
            onClick={() => toggleExpand(currentPath)}
          >
            <label>
              {key} (Array - {value.length} items)
            </label>
            <span className="expand-icon">
              {isExpanded(currentPath) ? "▼" : "►"}
            </span>
          </div>

          {isExpanded(currentPath) && (
            <div className="nested-content">
              {value.map((item, index) => {
                const itemPath = [...currentPath, index];
                return (
                  <div key={itemPath.join(".")} className="array-item">
                    <div className="array-item-header">
                      <span>Item {index + 1}</span>
                    </div>
                    {typeof item === "object" && item !== null ? (
                      <div className="nested-object">
                        {Object.entries(item).map(([itemKey, itemValue]) =>
                          (itemKey === "id") ? null : renderFormField(itemKey, itemValue, itemPath)
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={item || ""}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedComponent = JSON.parse(
                            JSON.stringify(editedComponent)
                          );
                          let current = updatedComponent;
                          for (let i = 0; i < path.length; i++) {
                            current = current[path[i]];
                          }
                          current[key][index] = newValue;
                          setEditedComponent(updatedComponent);
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {(isMenuItemsPath || isDropdownSubItemsPath) && (
                <button
                  className="add-button"
                  onClick={() => {
                    const updatedComponent = JSON.parse(
                      JSON.stringify(editedComponent)
                    );
                    let current = updatedComponent;

                    for (let i = 0; i < currentPath.length - 1; i++) {
                      current = current[currentPath[i]];
                    }

                    current[key].push({
                      text: "",
                      url: "",
                      id: current[key].length + 1, // nastav nový ID
                    });

                    setEditedComponent(updatedComponent);
                  }}
                  style={{ marginTop: "10px" }}
                >
                  + Add {isMenuItemsPath ? "Menu Item" : "Dropdown Subitem"}
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    // Handle objects
    if (typeof value === "object" && !(value instanceof Date)) {
      return (
        <div key={currentPath.join(".")} className="form-group nested-group">
          <div
            className="nested-header"
            onClick={() => toggleExpand(currentPath)}
          >
            <label>{key} (Object)</label>
            <span className="expand-icon">
              {isExpanded(currentPath) ? "▼" : "►"}
            </span>
          </div>

          {isExpanded(currentPath) && (
            <div className="nested-content">
              {Object.entries(value).map(([objKey, objValue]) =>
                // Skip rendering the id field for all components
                (objKey === "id") ? null : renderFormField(objKey, objValue, currentPath)
              )}
            </div>
          )}
        </div>
      );
    }

    // Handle dates
    if (value instanceof Date) {
      return (
        <div key={currentPath.join(".")} className="form-group">
          <label>{key}</label>
          <input
            type="date"
            value={value.toISOString().split("T")[0]}
            onChange={(e) => handleChange(e, currentPath)}
          />
        </div>
      );
    }

    // Handle boolean values
    if (typeof value === "boolean") {
      return (
        <div key={currentPath.join(".")} className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => {
                const newValue = e.target.checked;
                const updatedComponent = JSON.parse(
                  JSON.stringify(editedComponent)
                );
                let current = updatedComponent;
                for (let i = 0; i < path.length; i++) {
                  current = current[path[i]];
                }
                current[key] = newValue;
                setEditedComponent(updatedComponent);
              }}
            />
            {key}
          </label>
        </div>
      );
    }

    // Handle numbers
    if (typeof value === "number") {
      return (
        <div key={currentPath.join(".")} className="form-group">
          <label>{key}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue =
                e.target.value === "" ? "" : Number(e.target.value);
              const updatedComponent = JSON.parse(
                JSON.stringify(editedComponent)
              );
              let current = updatedComponent;
              for (let i = 0; i < path.length; i++) {
                current = current[path[i]];
              }
              current[key] = newValue;
              setEditedComponent(updatedComponent);
            }}
          />
        </div>
      );
    }

    // Default: handle as string
    return (
      <div key={currentPath.join(".")} className="form-group">
        <label>{key}</label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => handleChange(e, currentPath)}
        />
      </div>
    );
  };

  const handleSave = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    updateFn(componentName, editedComponent, setComponent)
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        setError(err.message || "Failed to update component");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="component-editor">
      <h2>{title}</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {success && (
        <div className="success">Component updated successfully!</div>
      )}

      <div className="component-form">
        {Object.entries(editedComponent)
            // .filter(([key]) => key !== "id")
            .map(([key, value]) =>
          renderFormField(key, value)
        )}

        <button className="save-button" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ComponentEditor;
