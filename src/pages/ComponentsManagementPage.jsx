import React, {useState, useEffect} from "react";
import {getRequest, putRequest, postRequest} from "../api/apiAccessHelper";
import "../css/ComponentsManagementPage.css";
import ComponentEditor from "../components/ComponentEditor";

const ComponentsManagementPage = ({activeComponent}) => {
    // State for all components
    const [components, setComponents] = useState({
        footer: null,
        faqcomponent: null,
        otheractivities: null,
        logocomponent: null,
        afterschool: null,
        feitstory: null,
        slider: null,
        featureboxs: null,
        dod: null,
        whyfeit: null,
        countdown: null,
        video: null,
        menu: null,
    });

    // Component titles for display
    const componentsList = [
        {id: "footer", title: "Footer"},
        {id: "faqcomponent", title: "FAQ Component"},
        {id: "otheractivities", title: "Other Activities"},
        {id: "logocomponent", title: "Logo Component"},
        {id: "afterschool", title: "After School"},
        {id: "feitstory", title: "FEIT Story"},
        {id: "slider", title: "Slider"},
        {id: "featureboxs", title: "Feature Boxes"},
        {id: "dod", title: "DOD Component"},
        {id: "whyfeit", title: "Why FEIT"},
        {id: "countdown", title: "Countdown"},
        {id: "video", title: "Video"},
        {id: "menu", title: "Menu"},
    ];

    // Loading and error states
    const [loading, setLoading] = useState({});
    const [error, setError] = useState({});

    // Fetch all components on page load
    useEffect(() => {
        fetchAllComponents();
    }, []);

    const fetchAllComponents = async () => {
        // Use Promise.all to fetch all components in parallel
        await Promise.all(componentsList.map((comp) => fetchComponent(comp.id)));
        console.log("All components fetched successfully");
    };

    const fetchComponent = async (componentName) => {
        setLoading((prev) => ({...prev, [componentName]: true}));
        setError((prev) => ({...prev, [componentName]: null}));

        try {
            console.log(`Fetching component: ${componentName}`);
            const data = await getRequest(`components/${componentName}`);
            if (data) {
                console.log(`Component ${componentName} fetched successfully:`, data);
                setComponents((prev) => ({...prev, [componentName]: data}));
            }
            return data;
        } catch (err) {
            console.error(`Error fetching component ${componentName}:`, err);
            setError((prev) => ({
                ...prev,
                [componentName]: err.message || "Failed to fetch component",
            }));
            return null;
        } finally {
            setLoading((prev) => ({...prev, [componentName]: false}));
        }
    };

    const updateComponent = async (componentName, componentData) => {
        console.log(`Updating component: ${componentName}`, componentData);
        setLoading((prev) => ({...prev, [componentName]: true}));
        setError((prev) => ({...prev, [componentName]: null}));

        try {

            let data;
            // Use the appropriate HTTP method based on the component name
            console.log(`Sending request to update ${componentName}`);
            data = await postRequest(`components/${componentName}`, componentData);

            // Update the component in state
            setComponents((prev) => ({
                ...prev,
                [componentName]: data || componentData,
            }));

            return data;
        } catch (err) {
            console.error(`Error updating component ${componentName}:`, err);
            setError((prev) => ({
                ...prev,
                [componentName]: err.message || "Failed to update component",
            }));
            throw err;
        } finally {
            setLoading((prev) => ({...prev, [componentName]: false}));
        }
    };

    // Find the title for the active component
    const activeComponentTitle =
        componentsList.find((c) => c.id === activeComponent)?.title || "Component";

    return (
        <div className="components-management-page">
            <h1>Components Management</h1>

            <div className="main-component-content">
                {components[activeComponent] !== null ? (
                    <ComponentEditor
                        title={activeComponentTitle}
                        componentName={activeComponent}
                        component={components[activeComponent]}
                        setComponent={(data) =>
                            setComponents((prev) => ({...prev, [activeComponent]: data}))
                        }
                        updateFn={updateComponent}
                    />
                ) : (
                    <div className="loading-component">
                        {loading[activeComponent]
                            ? `Loading ${activeComponentTitle}...`
                            : error[activeComponent]
                                ? `Error loading ${activeComponentTitle}: ${error[activeComponent]}`
                                : `No data available for ${activeComponentTitle}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentsManagementPage;
