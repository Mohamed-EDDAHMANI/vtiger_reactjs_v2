"use client"

import { Plus, Calendar, Target, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import AddFieldPopup from "./AddFieldPopup"

export default function Potential({
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
  const [potentials, setPotentials] = useState([])
  const [originalPotentials, setOriginalPotentials] = useState([])
  const [filteredPotentials, setFilteredPotentials] = useState([])

  // Initialize potentials data
  useEffect(() => {
    if (data?.related?.Potentials && Array.isArray(data.related.Potentials)) {
      const potentialsData = data.related.Potentials.map((potential) => ({
        id: potential.id,
        potentialname: potential.potentialname || "",
        closingdate: potential.closingdate || "",
      }))

      setPotentials(potentialsData)
      setOriginalPotentials(JSON.parse(JSON.stringify(potentialsData))) // Deep copy
      setFilteredPotentials(potentialsData)
      setHasChanges(false)
    } else {
      setPotentials([])
      setOriginalPotentials([])
      setFilteredPotentials([])
      setHasChanges(false)
    }
  }, [data, setHasChanges])

  // Filter potentials based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPotentials(potentials)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = potentials.filter(
      (potential) =>
        potential.potentialname.toLowerCase().includes(query) ||
        potential.closingdate.toLowerCase().includes(query) ||
        potential.id.toLowerCase().includes(query),
    )
    setFilteredPotentials(filtered)
  }, [searchQuery, potentials])

  // Detect changes in potentials
  useEffect(() => {
    const hasFormChanges = potentials.some((potential, index) => {
      const original = originalPotentials[index]
      if (!original) return true
      return potential.potentialname !== original.potentialname || potential.closingdate !== original.closingdate
    })
    setHasChanges(hasFormChanges)
  }, [potentials, originalPotentials, setHasChanges])

  // Handle update request from parent component
  useEffect(() => {
    const handleUpdateRequest = async () => {
      await handleUpdate()
    }

    document.addEventListener("popup-update-requested", handleUpdateRequest)

    return () => {
      document.removeEventListener("popup-update-requested", handleUpdateRequest)
    }
  }, [potentials, originalPotentials])

  const handleInputChange = (index, field, value) => {
    setPotentials((prev) => {
      const newPotentials = [...prev]
      newPotentials[index] = {
        ...newPotentials[index],
        [field]: value,
      }
      return newPotentials
    })
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    setUpdateError("")

    try {
      // Get only the changed potentials
      const changedPotentials = []

      potentials.forEach((potential, index) => {
        const original = originalPotentials[index]
        if (
          original &&
          (potential.potentialname !== original.potentialname || potential.closingdate !== original.closingdate)
        ) {
          changedPotentials.push({
            id: potential.id,
            potentialname: potential.potentialname,
            closingdate: potential.closingdate,
          })
        }
      })

      // Only proceed if there are actually changes
      if (changedPotentials.length === 0) {
        console.log("No changes detected in potentials")
        setIsUpdating(false)
        return
      }

      const updateData = {
        type: "potentials",
        data: changedPotentials,
      }

      const response = await fetch("http://localhost/vtiger_api/updatePotentials.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update potentials")
      }

      if (!result.success) {
        throw new Error(result.message || "Server returned an error")
      }

      // Update original values after successful save
      setOriginalPotentials(JSON.parse(JSON.stringify(potentials)))
      setHasChanges(false)

      // Optionally refresh data from server
      if (fetchData) {
        fetchData()
      }
    } catch (err) {
      console.error("Potentials update error:", err)
      setUpdateError(err.message || "Failed to update potentials. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const addNewPotential = () => {
    const newPotential = {
      id: `new_${Date.now()}`, // Temporary ID for new potential
      potentialname: "",
      closingdate: new Date().toISOString().split("T")[0], // Today's date
    }

    setPotentials((prev) => [...prev, newPotential])
  }

  const removePotential = (index) => {
    setPotentials((prev) => prev.filter((_, i) => i !== index))
  }

  // Check if potentials data exists
  const hasPotentials =
    data?.related?.Potentials && Array.isArray(data.related.Potentials) && data.related.Potentials.length > 0

  if (!hasPotentials) {
    return (
      <div className="h-full flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Potentials Found</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            There are no potentials associated with this contact yet. You can create a new potential to get started.
          </p>
          <button
            onClick={addNewPotential}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Potential
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto relative">
      {updateError && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md animate-in slide-in-from-left duration-300">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{updateError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Potentials</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredPotentials.length} {filteredPotentials.length === 1 ? "potential" : "potentials"}
            </span>
          </div>
          <button
            onClick={addNewPotential}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors duration-200 ease-in-out"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Potential
          </button>
        </div>

        {/* Potentials Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potential Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Closing Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPotentials.map((potential, index) => (
                  <tr key={potential.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{potential.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={potential.potentialname}
                        onChange={(e) => handleInputChange(index, "potentialname", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Enter potential name"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input
                          type="date"
                          value={potential.closingdate}
                          onChange={(e) => handleInputChange(index, "closingdate", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => removePotential(index)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPotentials.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-gray-500">No potentials found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      <AddFieldPopup
        fetchData={fetchData}
        isOpen={showAddField}
        onClose={() => setShowAddField(false)}
        onAddField={() => {}} // Not applicable for potentials table
      />
    </div>
  )
}
