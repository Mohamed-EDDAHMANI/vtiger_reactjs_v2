"use client"

import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import AddFieldPopup from "./AddFieldPopup"

export default function Contact({
  data,
  searchQuery,
  fetchData,
  showAddField,
  setShowAddField,
  setHasChanges,
  setIsUpdating,
  setUpdateError,
  updateError,
}) {
  const [formValues, setFormValues] = useState({})
  const [filteredFields, setFilteredFields] = useState([])
  const [initialValues, setInitialValues] = useState({})

  // Initialize form values when data is loaded
  useEffect(() => {
    console.log(data)
    if (data && data.sections["General Information"]) {
      // Set initial form values
      const initialValues = {}
      data.sections["General Information"].forEach((field) => {
        // Get the value from the field data
        const fieldValue = field.value !== undefined ? field.value : ""
        initialValues[field.fieldname] = fieldValue
      })

      setFormValues(initialValues)
      setInitialValues(initialValues) // Store initial values for comparison
      setFilteredFields(data.sections["General Information"])
      setHasChanges(false) // Reset changes when new data loads
    } else {
      console.log("No valid data structure found:", data)
    }
  }, [data, setHasChanges])

  // Filter fields based on search query
  useEffect(() => {
    if (!data || !data.sections["General Information"]) {
      console.log("No fields data available for filtering")
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = data.sections["General Information"].filter(
      (field) =>
        field.label.toLowerCase().includes(query) ||
        field.fieldname.toLowerCase().includes(query) ||
        (formValues[field.fieldname] || "").toString().toLowerCase().includes(query),
    )
    setFilteredFields(filtered)
  }, [searchQuery, data, formValues])

  const handleInputChange = (fieldname, value) => {
    setFormValues((prev) => {
      const newValues = {
        ...prev,
        [fieldname]: value,
      }
      console.log("Updated form values:", newValues)
      return newValues
    })
  }

  const handleAddField = (newField) => {
    // Update the data structure with the new field
    const updatedData = {
      ...data.data,
      fields: [...data.data.fields, newField],
    }

    // Update the form values with the new field's data
    setFormValues((prev) => {
      const newValues = {
        ...prev,
        [newField.fieldname]: newField.value || "",
      }
      return newValues
    })

    // Update the filtered fields based on the search query
    const filtered = updatedData.fields.filter(
      (field) =>
        field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.fieldname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (formValues[field.fieldname] || "").toString().toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredFields(filtered)
  }

  // Detect changes in form values
  useEffect(() => {
    const hasFormChanges = Object.keys(formValues).some((key) => formValues[key] !== initialValues[key])
    setHasChanges(hasFormChanges)
  }, [formValues, initialValues, setHasChanges])

  // Handle update request from parent component
  useEffect(() => {
    const handleUpdateRequest = async () => {
      await handleUpdate()
    }

    document.addEventListener("popup-update-requested", handleUpdateRequest)

    return () => {
      document.removeEventListener("popup-update-requested", handleUpdateRequest)
    }
  }, [formValues, initialValues])

  const handleUpdate = async () => {
    setIsUpdating(true)
    setUpdateError("")

    try {
      // Get only the changed fields
      const changedFields = {}
      const changedFieldsData = []

      Object.keys(formValues).forEach((key) => {
        if (formValues[key] !== initialValues[key]) {
          changedFields[key] = formValues[key]

          // Find the field definition for this changed field
          const fieldDef = data.data.fields.find((field) => field.fieldname === key)
          if (fieldDef) {
            changedFieldsData.push({
              fieldname: fieldDef.fieldname,
              label: fieldDef.label,
              type: fieldDef.type,
              value: formValues[key],
              mandatory: fieldDef.mandatory,
            })
          }
        }
      })

      // Only proceed if there are actually changes
      if (Object.keys(changedFields).length === 0) {
        console.log("No changes detected")
        setIsUpdating(false)
        return
      }

      const updateData = {
        id: data.data.id || "12x3", // Use the record ID from data
        data: changedFields, // Only send changed fields
        fields: changedFieldsData, // Only send changed field definitions
      }

      const response = await fetch("http://localhost/vtiger_api/updateRecord.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update record")
      }

      if (!result.success) {
        throw new Error(result.message || "Server returned an error")
      }

      // Update initial values to current values after successful save
      setInitialValues({ ...formValues })
      setHasChanges(false)

      // Optionally refresh data from server
      if (fetchData) {
        fetchData()
      }
    } catch (err) {
      console.error("Update error:", err)
      setUpdateError(err.message || "Failed to update record. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Helper function to determine if a boolean value should be checked
  const isBooleanChecked = (value) => {
    if (typeof value === "boolean") return value
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1"
    }
    if (typeof value === "number") return value === 1
    return false
  }

  const renderInput = (field) => {
    // Get the current value for this field from formValues, not field.value
    const currentValue = formValues[field.fieldname] !== undefined ? formValues[field.fieldname] : field.value

    const commonProps = {
      id: field.fieldname,
      name: field.fieldname,
      value: currentValue || "",
      onChange: (e) => handleInputChange(field.fieldname, e.target.value),
      className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        field.mandatory ? "border-red-500" : "border-gray-300"
      }`,
      required: field.mandatory,
      placeholder: `Enter ${field.label.toLowerCase()}`,
    }

    switch (field.type) {
      case "picklist":
        return (
          <select {...commonProps} readOnly={!field.editable}>
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "phone":
        return <input {...commonProps} readOnly={!field.editable} type="tel" pattern="[0-9]*" maxLength="15" />

      case "reference":
        return (
          <div className="relative">
            <input {...commonProps} readOnly={!field.editable} type="text" />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              🔍
            </button>
          </div>
        )

      case "date":
        return <input {...commonProps} readOnly={!field.editable} type="date" />

      case "datetime":
        return <input {...commonProps} readOnly={!field.editable} type="datetime-local" />

      case "email":
        return <input {...commonProps} readOnly={!field.editable} type="email" />

      case "boolean":
        const isChecked = isBooleanChecked(currentValue)
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.fieldname}
              checked={isChecked}
              onChange={(e) => handleInputChange(field.fieldname, e.target.checked ? "true" : "false")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.fieldname} className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        )

      case "text":
        return (
          <textarea
            {...commonProps}
            readOnly={!field.editable}
            rows="3"
            className={`${commonProps.className} resize-none`}
          />
        )

      default:
        return <input {...commonProps} readOnly={!field.editable} type="text" />
    }
  }

  return (
    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] relative">
      {updateError && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md animate-in slide-in-from-left duration-300">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{updateError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          <button
            onClick={() => setShowAddField(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors duration-200 ease-in-out"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFields && filteredFields.length > 0 ? (
            filteredFields.map((field, index) => (
              <div key={index} className="space-y-1">
                <label className=" flex text-sm font-medium text-gray-700">
                  {field.label}
                  {field.mandatory && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderInput(field)}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">No fields found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      <AddFieldPopup
        fetchData={fetchData}
        isOpen={showAddField}
        onClose={() => setShowAddField(false)}
        onAddField={handleAddField}
      />
    </div>
  )
}
