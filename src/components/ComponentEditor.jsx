import React, { useState, useEffect } from "react";
import "../css/ComponentsManagementPage.css";
import { postRequest } from "../api/apiAccessHelper"; // Add this import at the top

const ComponentEditor = ({
  title,
  componentName,
  component,
  setComponent,
  updateFn,
}) => {
  const CHARACTER_COUNT_TO_TEXTAREA = 80; // Character count threshold to switch to textarea
  const BASE_IMG_PATH = "http://localhost:8080/api/v1/images/"; // Base path for images
  const [editedComponent, setEditedComponent] = useState(component);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const keyTranslations = {
    title: "Názov",
    description: "Popis",
    imageUrl: "URL obrázka",
    imageUrl1: "URL obrázka 2",
    imageUrl2: "URL obrázka 3",
    imageUrl3: "URL obrázka 4",
    text: "Text",
    label: "Označenie",
    applicationsText: "Text aplikácií",
    videoUrl: "URL videa",
    menuItems: "Položky menu",
    dropdownMenuItems: "Položky rozbaľovacieho menu",
    button: "Tlačidlo",
    items: "Položky",
    visible: "Viditeľné",
    url: "URL odkaz",
    alt: "Alternatíva",
    //logocomponent
    logoItems: "Logá",
    //whyfeit
    whyFeitLists: "Zoznam prečo FEIT",
    countPrograms: "Počet",
    countDescription: "Popis pre daný počet",
    annualStipend: "Ročné štipendium",
    salary: "Nástupný plat",
    application: "Uplatnenie [%]",
    // footer
    locationColumn: "Adresa",
    contactColumn: "Kontakty",
    socialColumn: "Sociálne siete",
    shopColumn: "Obchod",
    navigationColumn: "Navigácia na stránke",
    //feitstory
    videoItemList: "Zoznam videí",
    //slider - zivot na FEIT
    iconsStyle: "Štýl ikoniek",
    //dod
    buttonText: "Text tlačidla",
    buttonLink: "URL Odkaz tlačidla",
    //countdown
    endDate: `Dátum "do"`,
    applicationText: "Text pre dátum",
  };
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
    // If path is empty, we are at the root level
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

  // Helper function to get translated field name
  const getTranslatedLabel = (key) => {
    // Check if we have a direct translation
    if (keyTranslations[key]) {
      return keyTranslations[key];
    }

    // Handle keys that might contain numbers (like imageUrl3)
    const baseKey = key.replace(/\d+$/, "");
    if (keyTranslations[baseKey]) {
      const number = key.match(/\d+$/)?.[0];
      return `${keyTranslations[baseKey]}${number ? " " + number : ""}`;
    }

    // Default to the original key if no translation found
    return key;
  };

  // Recursive function to render form fields for nested objects and arrays
  //key is the name of object's element
  //value is its value
  // path the path to the current field in the object
  const renderFormField = (key, value, path = []) => {
    const currentPath = [...path, key];
    if (key === "id") return null; // Skip rendering the id field for all components
    // Handle null values
    if (value === null) {
      return (
        <div key={currentPath.join(".")} className="form-group">
          <label>{getTranslatedLabel(key)}</label>
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
      const isLogoComponentPath =
        componentName === "logocomponent" && key === "logoItems";
      return (
        <div key={currentPath.join(".")} className="form-group nested-group">
          <div
            className="nested-header"
            onClick={() => toggleExpand(currentPath)}
          >
            <label>
              {getTranslatedLabel(key)} (Počet - {value.length})
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
                      <span>Položka {index + 1}</span>
                    </div>
                    {typeof item === "object" && item !== null ? (
                      <div className="nested-object">
                        {Object.entries(item).map(([itemKey, itemValue]) =>
                          itemKey === "id"
                            ? null
                            : renderFormField(itemKey, itemValue, itemPath)
                        )}
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                );
              })}

              {(isMenuItemsPath || isDropdownSubItemsPath) && (
                <button
                  className="components-add-button"
                  onClick={() => {
                    const updatedComponent = JSON.parse(
                      JSON.stringify(editedComponent)
                    );
                    let current = updatedComponent;

                    for (let i = 0; i < currentPath.length - 1; i++) {
                      current = current[currentPath[i]];
                    }

                    const newItem = {
                      text: "",
                      url: "",
                      id: current[key].length + 1, // set new ID
                    };

                    current[key].push(newItem);
                    setEditedComponent(updatedComponent);
                  }}
                  style={{ marginTop: "10px" }}
                >
                  + Pridaj{" "}
                  {isMenuItemsPath ? "Menu Položku" : "Dropdown Položku"}
                </button>
              )}

              {isLogoComponentPath && (
                <div
                  className="logo-upload-container"
                  style={{ marginTop: "15px" }}
                >
                  <label className="file-input-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          uploadLogoImage(file, currentPath, key);
                          // Clear the input so the same file can be selected again if needed
                          e.target.value = "";
                        }
                      }}
                      style={{ display: "none" }}
                    />
                    <span className="components-add-button">+ Pridaj Logo</span>
                  </label>
                  {loading && (
                    <span style={{ marginLeft: "10px" }}>Nahrávam...</span>
                  )}
                </div>
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
            <label>{getTranslatedLabel(key)} (Objekt)</label>
            <span className="expand-icon">
              {isExpanded(currentPath) ? "▼" : "►"}
            </span>
          </div>

          {isExpanded(currentPath) && (
            <div className="nested-content">
              {Object.entries(value).map(([objKey, objValue]) =>
                // Skip rendering the id field for all components
                objKey === "id"
                  ? null
                  : renderFormField(objKey, objValue, currentPath)
              )}
            </div>
          )}
        </div>
      );
    }

    //Continues from here for individual fields
    // Handle dates
    if (value instanceof Date) {
      return (
        <div key={currentPath.join(".")} className="form-group">
          <label>{getTranslatedLabel(key)}</label>
          <input
            type="date"
            value={value.toISOString().split("T")[0]}
            onChange={(e) => handleChange(e, currentPath)}
          />
        </div>
      );
    }
    // Handle boolean values (visible, etc)
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
            {key === "visible"
              ? "zobraziť na stránke"
              : getTranslatedLabel(key)}
          </label>
        </div>
      );
    }
    // Handle numbers
    if (typeof value === "number") {
      return (
        <div key={currentPath.join(".")} className="form-group">
          <label>{getTranslatedLabel(key)}</label>
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
        {key.includes("imageUrl") && (
          <div className="image-preview">
            {value && (
              <img
                src={value}
                alt="Náhľad obrázka"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            )}
          </div>
        )}
        <label>{getTranslatedLabel(key)}</label>
        {typeof value === "string" &&
        value.length > CHARACTER_COUNT_TO_TEXTAREA ? (
          <textarea
            value={value || ""}
            onChange={(e) => handleChange(e, currentPath)}
            style={{ width: "100%", minHeight: "80px" }}
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleChange(e, currentPath)}
          />
        )}
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

  const uploadLogoImage = async (file, currentPath, key) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Use postRequest helper instead of direct fetch
      const data = await postRequest(
        "components/logocomponent/upload",
        formData
      );

      if (!data || data.error) {
        throw new Error(data?.error || "Failed to upload image");
      }

      const imageUrl = data.url; // Get the URL from the response

      // Update the component with the new logo item
      const updatedComponent = JSON.parse(JSON.stringify(editedComponent));
      let current = updatedComponent;

      for (let i = 0; i < currentPath.length - 1; i++) {
        current = current[currentPath[i]];
      }

      // Add the new logo item with the uploaded image URL
      const newItem = {
        imageUrl: BASE_IMG_PATH + imageUrl,
        alt: file.name.split(".")[0], // Use filename as default alt text
        id: current[key].length + 1,
      };

      current[key].push(newItem);
      setEditedComponent(updatedComponent);
    } catch (err) {
      setError(err.message || "Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-editor">
      <h2>{title}</h2>
      {loading && <div className="loading">Načítavam...</div>}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Komponent úspešne zmenený!</div>}

      <div className="component-form">
        {Object.entries(editedComponent)
          // .filter(([key]) => key !== "id")
          .map(([key, value]) => renderFormField(key, value))}

        <button className="save-button" onClick={handleSave} disabled={loading}>
          {loading ? "Ukladám..." : "Uložiť"}
        </button>
      </div>
    </div>
  );
};

export default ComponentEditor;
