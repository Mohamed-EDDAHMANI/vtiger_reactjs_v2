"use client"

import { useState } from "react"
import { X } from "lucide-react"

const AddFieldPopup = ({ isOpen, onClose, onAddField, fetchData }) => {
  const [formData, setFormData] = useState({
    fieldname: "",
    label: "",
    type: "string",
    value: "",
    mandatory: false,
    editable: true,
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError("") // Clear error when user makes changes
  }

  const validateForm = () => {
    if (!formData.fieldname.trim()) {
      setError("Field name is required")
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.fieldname)) {
      setError("Field name can only contain letters, numbers, and underscores")
      return false
    }
    if (!formData.label.trim()) {
      setError("Label is required")
      return false
    }
    // For boolean type, we don't require a value since it can be true/false
    if (!formData.value && formData.type !== "boolean") {
      setError("Value is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setError("")

    try {
      // Format the value based on type
      let processedValue = formData.value
      if (formData.type === "boolean") {
        // Ensure boolean values are properly formatted
        processedValue = formData.value === "true" || formData.value === true ? "true" : "false"
      }

      // Format the data for the API
      const apiData = {
        create_field: true,
        id: "12x3", // Default ID for new fields
        data: {
          [formData.fieldname]: processedValue,
        },
        field_info: {
          fieldname: formData.fieldname,
          label: formData.label,
          type: formData.type,
          value: processedValue,
          mandatory: formData.mandatory,
          editable: formData.editable,
        },
        assigned_user_id: "19x1",
      }


      const response = await fetch("http://localhost/vtiger_api/createFilde.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add field")
      }

      if (!data.success) {
        throw new Error(data.message || "Server returned an error")
      }

      // Pass the field data to the parent component
      onAddField({
        fieldname: formData.fieldname,
        label: formData.label,
        type: formData.type,
        value: processedValue,
        mandatory: formData.mandatory,
      })

      // Reset form and close popup
      setFormData({
        fieldname: "",
        label: "",
        type: "string",
        value: "",
        mandatory: false,
      })
      onClose()
      fetchData()
    } catch (err) {
      console.error("Error details:", err)
      setError(err.message || "Failed to add field. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderValueInput = () => {
    switch (formData.type) {
      case "boolean":
        return (
          <select
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select value</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        )
      case "date":
        return (
          <input
            type="date"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      case "datetime":
        return (
          <input
            type="datetime-local"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      case "number":
        return (
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      case "email":
        return (
          <input
            type="email"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      default:
        return (
          <input
            type="text"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Field</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1">Field Name *</label>
            <input
              type="text"
              name="fieldname"
              value={formData.fieldname}
              onChange={handleInputChange}
              placeholder="e.g., first_name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1">Label *</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="e.g., First Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="string">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="datetime">Date & Time</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1">
              Value {formData.type !== "boolean" && "*"}
            </label>
            {renderValueInput()}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="mandatory"
                checked={formData.mandatory}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Required Field</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="editable"
                checked={formData.editable} 
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Editable</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFieldPopup
