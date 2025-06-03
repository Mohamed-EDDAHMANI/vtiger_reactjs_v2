"use client"

import { Plus } from "lucide-react"
import { useState, useEffect, useRef } from "react"
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
  handleInputChange, // notify parent on input change
}) {
  const [formValues, setFormValues] = useState({})
  const [filteredFields, setFilteredFields] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const isInitialized = useRef(false) // Track if we've initialized the form

  // Initialize form values when data is loaded - but only once!
  useEffect(() => {
    if (data && data.rawData && !isInitialized.current) {
      const initial = {}
      const fields = data.rawData.map((field) => {
        initial[field.fieldname] = field.value !== undefined ? field.value : ""
        return {
          fieldname: field.fieldname,
          label: field.label,
          type: field.type,
          value: field.value,
          mandatory: field.mandatory,
          editable: true,
        }
      })

      setFormValues(initial)
      setInitialValues(initial)
      setFilteredFields(fields)
      setHasChanges(false)
      isInitialized.current = true // Mark as initialized
    }
  }, [data, setHasChanges])

  // Reset initialization flag when data.id changes (new contact)
  useEffect(() => {
    if (data?.id) {
      isInitialized.current = false
    }
  }, [data?.id])

  // Filter fields based on search query
  useEffect(() => {
    if (!data || !data.rawData) return

    const query = searchQuery.toLowerCase()

    const filtered = data.rawData
      .filter(
        (field) =>
          field.label.toLowerCase().includes(query) ||
          field.fieldname.toLowerCase().includes(query) ||
          (formValues[field.fieldname] || "").toString().toLowerCase().includes(query),
      )
      .map((field) => ({
        fieldname: field.fieldname,
        label: field.label,
        type: field.type,
        value: formValues[field.fieldname] !== undefined ? formValues[field.fieldname] : field.value,
        mandatory: field.mandatory,
        editable: true,
      }))

    setFilteredFields(filtered)
  }, [searchQuery, data, formValues])

  const handleAddField = (newField) => {
    const updatedRawData = [
      ...data.rawData,
      {
        fieldname: newField.fieldname,
        label: newField.label,
        type: newField.type,
        value: newField.value || "",
        mandatory: newField.mandatory,
      },
    ]

    const updatedData = {
      ...data,
      rawData: updatedRawData,
    }

    setFormValues((prev) => ({
      ...prev,
      [newField.fieldname]: newField.value || "",
    }))

    const query = searchQuery.toLowerCase()

    const filtered = updatedRawData
      .filter(
        (field) =>
          field.label.toLowerCase().includes(query) ||
          field.fieldname.toLowerCase().includes(query) ||
          (formValues[field.fieldname] || field.value || "").toString().toLowerCase().includes(query),
      )
      .map((field) => ({
        fieldname: field.fieldname,
        label: field.label,
        type: field.type,
        value: formValues[field.fieldname] !== undefined ? formValues[field.fieldname] : field.value,
        mandatory: field.mandatory,
        editable: true,
      }))

    setFilteredFields(filtered)
  }

  // Detect changes in form values
  useEffect(() => {
    if (Object.keys(initialValues).length === 0) return // Don't check changes before initialization

    const hasFormChanges = Object.keys(formValues).some((key) => formValues[key] !== initialValues[key])
    setHasChanges(hasFormChanges)
  }, [formValues, initialValues, setHasChanges])

  // Listen for update requests (from outside)
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
      const changedFields = {}
      const changedFieldsData = []

      Object.keys(formValues).forEach((key) => {
        if (formValues[key] !== initialValues[key]) {
          changedFields[key] = formValues[key]

          const fieldDef = data.rawData.find((field) => field.fieldname === key)
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

      if (Object.keys(changedFields).length === 0) {
        console.log("No changes detected")
        setIsUpdating(false)
        return
      }

      const updateData = {
        id: data.id || "CON1",
        data: changedFields,
        fields: changedFieldsData,
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

      setInitialValues({ ...formValues })
      setHasChanges(false)

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

  const isBooleanChecked = (value) => {
    if (typeof value === "boolean") return value
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1"
    }
    if (typeof value === "number") return value === 1
    return false
  }

  // **FIXED** local handler to update local state & notify parent
  const localHandleInputChange = (fieldname, value) => {
    setFormValues((prev) => ({ ...prev, [fieldname]: value }))
    if (handleInputChange) handleInputChange(fieldname, value)
  }

  const renderInput = (field) => {
    const currentValue = formValues[field.fieldname] !== undefined ? formValues[field.fieldname] : field.value

    const commonProps = {
      id: field.fieldname,
      name: field.fieldname,
      value: currentValue || "",
      onChange: (e) => localHandleInputChange(field.fieldname, e.target.value),
      className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        field.mandatory ? "border-red-500" : "border-gray-300"
      }`,
      required: field.mandatory,
      placeholder: `Enter ${field.label.toLowerCase()}`,
      disabled: !field.editable,
    }

    switch (field.type) {
      case "picklist":
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "phone":
        return <input {...commonProps} type="tel" pattern="[0-9]*" maxLength="15" />

      case "reference":
        return (
          <div className="relative">
            <input {...commonProps} type="text" />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              🔍
            </button>
          </div>
        )

      case "date":
        return <input {...commonProps} type="date" />

      case "datetime":
        return <input {...commonProps} type="datetime-local" />

      case "email":
        return <input {...commonProps} type="email" />

      case "boolean":
        const isChecked = isBooleanChecked(currentValue)
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.fieldname}
              checked={isChecked}
              onChange={(e) => localHandleInputChange(field.fieldname, e.target.checked ? "1" : "0")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.fieldname} className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        )

      case "text":
        return <textarea {...commonProps} rows="3" className={`${commonProps.className} resize-none`} />

      default:
        return <input {...commonProps} type="text" />
    }
  }

  return (
    <div className="h-full overflow-y-auto relative">
      {updateError && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md animate-in slide-in-from-left duration-300">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293a1 1 0 00-1.414 0L7 9.586 5.707 8.293a1 1 0 10-1.414 1.414L6.586 11l-2.293 2.293a1 1 0 001.414 1.414L7 12.414l2.293 2.293a1 1 0 001.414-1.414L8.414 11l2.293-2.293a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{updateError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map((field) => (
          <div key={field.fieldname} className="flex flex-col">
            <label htmlFor={field.fieldname} className="text-gray-700 font-semibold mb-1">
              {field.label} {field.mandatory && <span className="text-red-600">*</span>}
            </label>
            {renderInput(field)}
          </div>
        ))}
        <div className="flex items-center justify-center cursor-pointer" onClick={() => setShowAddField(true)}>
          <Plus className="h-8 w-8 text-gray-500 hover:text-blue-500" />
        </div>
      </div>

      {showAddField && (
        <AddFieldPopup
          onClose={() => setShowAddField(false)}
          onAddField={(newField) => {
            handleAddField(newField)
            setShowAddField(false)
          }}
        />
      )}
    </div>
  )
}
