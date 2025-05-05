import React, { useState, useEffect } from "react";
import { getRequest, putRequest, postRequest } from "../api/apiAccessHelper";
import "../css/ComponentsManagementPage.css";

const ComponentsManagementPage = () => {
  // State for each component
  const [footer, setFooter] = useState(null);
  const [faqComponent, setFaqComponent] = useState(null);
  const [otherActivities, setOtherActivities] = useState(null);
  const [logoComponent, setLogoComponent] = useState(null);
  const [afterSchool, setAfterSchool] = useState(null);
  const [feitStory, setFeitStory] = useState(null);
  const [slider, setSlider] = useState(null);
  const [featureBoxes, setFeatureBoxes] = useState(null);
  const [dodComponent, setDodComponent] = useState(null);
  const [whyFeit, setWhyFeit] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [video, setVideo] = useState(null);
  const [menu, setMenu] = useState(null);


  // Loading and error states
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});

  // Fetch all components on page load
  useEffect(() => {
    fetchAllComponents();
  }, []);

  const fetchAllComponents = async () => {
    // Use Promise.all to fetch all components in parallel and wait for all of them to complete
    await Promise.all([
      fetchComponent("footer", setFooter),
      fetchComponent("faqcomponent", setFaqComponent),
      fetchComponent("otheractivities", setOtherActivities),
      fetchComponent("logocomponent", setLogoComponent),
      fetchComponent("afterschool", setAfterSchool),
      fetchComponent("feitstory", setFeitStory),
      fetchComponent("slider", setSlider),
      fetchComponent("featureboxs", setFeatureBoxes),
      fetchComponent("dod", setDodComponent),
      fetchComponent("whyfeit", setWhyFeit),
      fetchComponent("countdown", setCountdown),
      fetchComponent("video", setVideo),
      fetchComponent("menu", setMenu)
    ]);
    console.log("All components fetched successfully");
  };

  const fetchComponent = async (componentName, setComponentState) => {
    setLoading(prev => ({ ...prev, [componentName]: true }));
    setError(prev => ({ ...prev, [componentName]: null }));

    try {
      console.log(`Fetching component: ${componentName}`);
      const data = await getRequest(`components/${componentName}`);
      if (data) {
        console.log(`Component ${componentName} fetched successfully:`, data);
        setComponentState(data);
      }
      return data; // Return data to be used with Promise.all
    } catch (err) {
      console.error(`Error fetching component ${componentName}:`, err);
      setError(prev => ({ ...prev, [componentName]: err.message || "Failed to fetch component" }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [componentName]: false }));
    }
  };

  const updateComponent = async (componentName, componentData, setComponentState) => {
    console.log(`Updating component: ${componentName}`, componentData);
    setLoading(prev => ({ ...prev, [componentName]: true }));
    setError(prev => ({ ...prev, [componentName]: null }));
    setSuccess(prev => ({ ...prev, [componentName]: false }));

    try {
      // Determine which HTTP method to use based on the component name
      const putComponents = ['footer', 'faqcomponent', 'otheractivities', 'logocomponent', 'afterschool', 'feitstory', 'slider'];
      const usesPut = putComponents.includes(componentName);
      console.log(`Using ${usesPut ? 'PUT' : 'POST'} method for component: ${componentName}`);

      let data;

      // Special handling for whyfeit component which requires multipart/form-data
      if (componentName === 'whyfeit') {
        console.log('Special handling for whyfeit component with multipart/form-data');
        // Create FormData object for multipart/form-data request
        const formData = new FormData();
        formData.append('whyFeitComponentDto', new Blob([JSON.stringify(componentData)], { type: 'application/json' }));

        // If there's an image in the component data, add it to the FormData
        // Note: This is a simplified approach. In a real implementation, you would need to handle image uploads properly.
        if (componentData.image && componentData.image instanceof File) {
          formData.append('image', componentData.image);
        }

        data = await postRequest(`components/${componentName}`, formData);
      } else {
        // Use the appropriate HTTP method based on the component name
        console.log(`Sending request to update ${componentName}`);
        data = usesPut
          ? await putRequest(`components/${componentName}`, componentData)
          : await postRequest(`components/${componentName}`, componentData);
      }

      await fetchAllComponents();
    } catch (err) {
      console.error(`Error updating component ${componentName}:`, err);
      setError(prev => ({ ...prev, [componentName]: err.message || "Failed to update component" }));
    } finally {
      setLoading(prev => ({ ...prev, [componentName]: false }));
    }
  };

  // Generic component editor
  const ComponentEditor = ({ title, componentName, component, setComponent, updateFn }) => {
    const [editedComponent, setEditedComponent] = useState(component);
    const [expandedSections, setExpandedSections] = useState({});

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
      const pathKey = path.join('.');
      setExpandedSections(prev => ({
        ...prev,
        [pathKey]: !prev[pathKey]
      }));
    };

    // Check if a section is expanded
    const isExpanded = (path) => {
      const pathKey = path.join('.');
      return expandedSections[pathKey];
    };

    // Recursive function to render form fields for nested objects and arrays
    const renderFormField = (key, value, path = []) => {
      const currentPath = [...path, key];

      // Handle null values
      if (value === null) {
        return (
          <div key={currentPath.join('.')} className="form-group">
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
            <div key={currentPath.join('.')} className="form-group nested-group">
              <div className="nested-header" onClick={() => toggleExpand(currentPath)}>
                <label>{key} (Array - {value.length} items)</label>
                <span className="expand-icon">{isExpanded(currentPath) ? '▼' : '►'}</span>
              </div>

              {isExpanded(currentPath) && (
                  <div className="nested-content">
                    {value.map((item, index) => {
                      const itemPath = [...currentPath, index];
                      return (
                          <div key={itemPath.join('.')} className="array-item">
                            <div className="array-item-header">
                              <span>Item {index + 1}</span>
                            </div>
                            {typeof item === 'object' && item !== null ? (
                                <div className="nested-object">
                                  {Object.entries(item).map(([itemKey, itemValue]) =>
                                      renderFormField(itemKey, itemValue, itemPath)
                                  )}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={item || ""}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedComponent = JSON.parse(JSON.stringify(editedComponent));
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
                              const updatedComponent = JSON.parse(JSON.stringify(editedComponent));
                              let current = updatedComponent;

                              for (let i = 0; i < currentPath.length - 1; i++) {
                                current = current[currentPath[i]];
                              }

                              current[key].push({
                                text: "",
                                url: "",
                                id: current[key].length + 1 // nastav nový ID
                              });

                              setEditedComponent(updatedComponent);
                            }}
                            style={{ marginTop: '10px' }}
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
      if (typeof value === 'object' && !(value instanceof Date)) {
        return (
          <div key={currentPath.join('.')} className="form-group nested-group">
            <div className="nested-header" onClick={() => toggleExpand(currentPath)}>
              <label>{key} (Object)</label>
              <span className="expand-icon">{isExpanded(currentPath) ? '▼' : '►'}</span>
            </div>

            {isExpanded(currentPath) && (
              <div className="nested-content">
                {Object.entries(value).map(([objKey, objValue]) =>
                  renderFormField(objKey, objValue, currentPath)
                )}
              </div>
            )}
          </div>
        );
      }

      // Handle dates
      if (value instanceof Date) {
        return (
          <div key={currentPath.join('.')} className="form-group">
            <label>{key}</label>
            <input
              type="date"
              value={value.toISOString().split('T')[0]}
              onChange={(e) => handleChange(e, currentPath)}
            />
          </div>
        );
      }

      // Handle boolean values
      if (typeof value === 'boolean') {
        return (
          <div key={currentPath.join('.')} className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  const updatedComponent = JSON.parse(JSON.stringify(editedComponent));
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
      if (typeof value === 'number') {
        return (
          <div key={currentPath.join('.')} className="form-group">
            <label>{key}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => {
                const newValue = e.target.value === '' ? '' : Number(e.target.value);
                const updatedComponent = JSON.parse(JSON.stringify(editedComponent));
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

      // Special handling for date strings (especially for countdown endDate)
      if (typeof value === 'string' && key === 'endDate' && componentName === 'countdown') {
        // Check if the string matches a date format with slashes (e.g., "2030/3/31 23:59:59")
        const dateRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?: (\d{1,2}):(\d{1,2}):(\d{1,2}))?$/;
        const match = value.match(dateRegex);

        if (match) {
          // Format the date string to ISO format (YYYY-MM-DDTHH:MM:SS)
          const year = match[1];
          const month = match[2].padStart(2, '0');
          const day = match[3].padStart(2, '0');

          let formattedDate = `${year}-${month}-${day}T`;

          // Add time if present
          if (match[4]) {
            const hours = match[4].padStart(2, '0');
            const minutes = match[5].padStart(2, '0');
            const seconds = match[6].padStart(2, '0');
            formattedDate += `${hours}:${minutes}:${seconds}`;
          }

          // Automatically convert the date format when the component is saved
          // This happens behind the scenes, so the user still sees the original format
          // But when saved, it will be in the correct format for the backend
          setTimeout(() => {
            const updatedComponent = JSON.parse(JSON.stringify(editedComponent));
            let current = updatedComponent;
            for (let i = 0; i < path.length; i++) {
              current = current[path[i]];
            }
            current[key] = formattedDate;
            setEditedComponent(updatedComponent);
          }, 0);

          return (
            <div key={currentPath.join('.')} className="form-group">
              <label>{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const updatedComponent = JSON.parse(JSON.stringify(editedComponent));
                  let current = updatedComponent;
                  for (let i = 0; i < path.length; i++) {
                    current = current[path[i]];
                  }

                  // Check if the new value matches the date format with slashes
                  const dateRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?: (\d{1,2}):(\d{1,2}):(\d{1,2}))?$/;
                  const match = newValue.match(dateRegex);

                  if (match) {
                    // Format the date string to ISO format
                    const year = match[1];
                    const month = match[2].padStart(2, '0');
                    const day = match[3].padStart(2, '0');

                    let formattedDate = `${year}-${month}-${day}`;

                    // Add time if present
                    if (match[4]) {
                      const hours = match[4].padStart(2, '0');
                      const minutes = match[5].padStart(2, '0');
                      const seconds = match[6].padStart(2, '0');
                      formattedDate += ` ${hours}:${minutes}:${seconds}`;
                    }

                    // Store the formatted date
                    current[key] = formattedDate;
                  } else {
                    // Store the original value if it doesn't match the date format
                    current[key] = newValue;
                  }

                  setEditedComponent(updatedComponent);
                }}
              />
              <div className="date-format-hint">
                Note: Date should be in format YYYY-MM-DD HH:MM:SS
              </div>
            </div>
          );
        }
      }

      // Default: handle as string
      return (
        <div key={currentPath.join('.')} className="form-group">
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
      updateFn(componentName, editedComponent, setComponent);
    };

    return (
      <div className="component-editor">
        <h2>{title}</h2>
        {loading[componentName] && <div className="loading">Loading...</div>}
        {error[componentName] && <div className="error">{error[componentName]}</div>}
        {success[componentName] && <div className="success">Component updated successfully!</div>}

        <div className="component-form">
          {Object.entries(editedComponent).map(([key, value]) =>
            renderFormField(key, value)
          )}

          <button
            className="save-button"
            onClick={handleSave}
            disabled={loading[componentName]}
          >
            {loading[componentName] ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="components-management-page">
      <h1>Components Management</h1>

      <div className="components-container">
        <ComponentEditor
          title="Footer"
          componentName="footer"
          component={footer}
          setComponent={setFooter}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="FAQ Component"
          componentName="faqcomponent"
          component={faqComponent}
          setComponent={setFaqComponent}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Other Activities"
          componentName="otheractivities"
          component={otherActivities}
          setComponent={setOtherActivities}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Logo Component"
          componentName="logocomponent"
          component={logoComponent}
          setComponent={setLogoComponent}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="After School"
          componentName="afterschool"
          component={afterSchool}
          setComponent={setAfterSchool}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="FEIT Story"
          componentName="feitstory"
          component={feitStory}
          setComponent={setFeitStory}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Slider"
          componentName="slider"
          component={slider}
          setComponent={setSlider}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Feature Boxes"
          componentName="featureboxs"
          component={featureBoxes}
          setComponent={setFeatureBoxes}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="DOD Component"
          componentName="dod"
          component={dodComponent}
          setComponent={setDodComponent}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Why FEIT"
          componentName="whyfeit"
          component={whyFeit}
          setComponent={setWhyFeit}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Countdown"
          componentName="countdown"
          component={countdown}
          setComponent={setCountdown}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Video"
          componentName="video"
          component={video}
          setComponent={setVideo}
          updateFn={updateComponent}
        />

        <ComponentEditor
          title="Menu"
          componentName="menu"
          component={menu}
          setComponent={setMenu}
          updateFn={updateComponent}
        />
      </div>
    </main>
  );
};

export default ComponentsManagementPage;
