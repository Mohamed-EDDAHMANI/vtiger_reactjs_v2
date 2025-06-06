"use client"

import { useState, useEffect } from "react"
import PopapHeader from "./PopapHeader"
import Contact from "./Contact"
import Potential from "./potential"

export default function Popup({ id, contacts, popupOpen, setPopupOpen, setLoading }) {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddField, setShowAddField] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState("")
  const [activeTab, setActiveTab] = useState("contact") // New navigation state

  // console.log(id)

  const fetchData = () => {
    setLoading(true)
    fetch("http://localhost/vtigercrm2/api.php?id=" + 2, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log("API response data:", data)
        if (data.success && data.data) {
          const transformedContacts = transformContactData(data.data)
          setData(transformedContacts)
        } else {
          console.error("API returned unsuccessful response:", data)
          setData([])
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error)
        setData([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id, contacts])

  if (!popupOpen || !data) return null

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchQuery("") // Reset search when switching tabs
  }


  const handleInputChange = (field, value) => {
    setData(prevData => ({
      ...prevData,
      [field]: value
    }))
  }

  const renderBodyComponent = () => {
    switch (activeTab) {
      case "contact":
        return (
          <Contact
            data={data}
            searchQuery={searchQuery}
            showAddField={showAddField}
            setShowAddField={setShowAddField}
            setHasChanges={setHasChanges}
            setIsUpdating={setIsUpdating}
            setUpdateError={setUpdateError}
            updateError={updateError}
            handleInputChange={handleInputChange}
          />
        )
      case "potential":
        return (
          <Potential
            data={data}
            searchQuery={searchQuery}
            showAddField={showAddField}
            setShowAddField={setShowAddField}
            setHasChanges={setHasChanges}
            setIsUpdating={setIsUpdating}
            setUpdateError={setUpdateError}
            updateError={updateError}
            handleInputChange={handleInputChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-[92%] h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">
        {/* Animated green top border that slides in */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-in-out transform ${
            hasChanges ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          } origin-left`}
        />

        {/* Update notification bar */}
        {hasChanges && (
          <div className="absolute top-1 left-0 right-0 bg-green-50 border-b border-green-200 px-6 py-2 flex items-center justify-between z-10 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">You have unsaved changes</span>
            </div>
            <button
              onClick={() => {
                document.dispatchEvent(new CustomEvent("popup-update-requested"))
              }}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white text-sm font-medium rounded-full transition-all duration-200 ease-in-out shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
            >
              {isUpdating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update
                </>
              )}
            </button>
          </div>
        )}

        <div className={`flex flex-col h-full transition-all duration-300 ${hasChanges ? "mt-12" : "mt-0"}`}>
          <div className="flex-shrink-0">
            <PopapHeader
              data={data}
              popupOpen={popupOpen}
              setPopupOpen={setPopupOpen}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          <div className="flex-1 overflow-hidden">{renderBodyComponent()}</div>
        </div>
      </div>
    </div>
  )
}
