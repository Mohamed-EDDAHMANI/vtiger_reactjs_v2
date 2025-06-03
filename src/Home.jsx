"use client"

import { useState, useEffect } from "react"
import { Eye, Plus, Search,Filter,MoreVertical, Mail,Phone, MapPin, Building, User, Trash2,Edit,Copy, X, Save, UserPlus,} from "lucide-react"
import Popup from "./components/Popup"

// Enhanced UI Components
const Button = ({ children, variant = "default", size = "default", className = "", onClick, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95"

  const variants = {
    default:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    outline:
      "border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 bg-white hover:bg-blue-50",
    ghost: "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
    destructive:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
  }

  const sizes = {
    default: "px-6 py-3 text-sm",
    sm: "px-4 py-2 text-xs",
    lg: "px-8 py-4 text-base",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${className}`}
      {...props}
    />
  )
}

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300",
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {children.map((child, index) =>
        index === 0 ? (
          <div key={index} onClick={() => setIsOpen(!isOpen)}>
            {child}
          </div>
        ) : (
          isOpen && (
            <div
              key={index}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
            >
              {child}
            </div>
          )
        ),
      )}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, asChild }) => children
const DropdownMenuContent = ({ children }) => children
const DropdownMenuItem = ({ children, className = "", onClick }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

// Contact Details Slide-out Component
const ContactDetails = ({ contact, isOpen, onClose }) => {
  if (!contact) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Contact Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {contact.firstName?.charAt(0)}
                {contact.lastName?.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-blue-100">{contact.title || "No title"}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                Contact Information
              </h4>

              {contact.primaryEmail && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.primaryEmail}</p>
                    <p className="text-xs text-gray-500">Primary Email</p>
                  </div>
                </div>
              )}

              {(contact.officePhone || contact.mobilePhone) && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.officePhone || contact.mobilePhone}</p>
                    <p className="text-xs text-gray-500">{contact.officePhone ? "Office Phone" : "Mobile Phone"}</p>
                  </div>
                </div>
              )}

              {contact.organizationName && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Building className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.organizationName}</p>
                    <p className="text-xs text-gray-500">Organization</p>
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            {(contact.mailingStreet || contact.mailingCity) && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Address
                </h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">
                    {[
                      contact.mailingStreet,
                      contact.mailingCity,
                      contact.mailingState,
                      contact.mailingZip,
                      contact.mailingCountry,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {contact.description && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Description</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{contact.description}</p>
                </div>
              </div>
            )}

            {/* Assignment */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Assignment</h4>
              <Badge variant="default">{contact.assignedTo}</Badge>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <Button className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Edit Contact
              </Button>
              <Button variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Add Contact Slide-out Component
const AddContact = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    organizationName: "",
    primaryEmail: "",
    officePhone: "",
    mobilePhone: "",
    mailingStreet: "",
    mailingCity: "",
    mailingState: "",
    mailingZip: "",
    mailingCountry: "",
    description: "",
    assignedTo: "Unassigned",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      firstName: "",
      lastName: "",
      title: "",
      organizationName: "",
      primaryEmail: "",
      officePhone: "",
      mobilePhone: "",
      mailingStreet: "",
      mailingCity: "",
      mailingState: "",
      mailingZip: "",
      mailingCountry: "",
      description: "",
      assignedTo: "Unassigned",
    })
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Add New Contact
              </h2>
              <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <Input
                  value={formData.organizationName}
                  onChange={(e) => handleChange("organizationName", e.target.value)}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Contact Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.primaryEmail}
                  onChange={(e) => handleChange("primaryEmail", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Office Phone</label>
                  <Input value={formData.officePhone} onChange={(e) => handleChange("officePhone", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Phone</label>
                  <Input value={formData.mobilePhone} onChange={(e) => handleChange("mobilePhone", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Address</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <Input value={formData.mailingStreet} onChange={(e) => handleChange("mailingStreet", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <Input value={formData.mailingCity} onChange={(e) => handleChange("mailingCity", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <Input value={formData.mailingState} onChange={(e) => handleChange("mailingState", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <Input value={formData.mailingZip} onChange={(e) => handleChange("mailingZip", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <Input
                    value={formData.mailingCountry}
                    onChange={(e) => handleChange("mailingCountry", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Description</h4>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Contact
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

// Main Contacts Component
export default function Home() {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [contactId, setContactId] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)

  // Transform API data to match our frontend structure
  const transformContactData = (apiData) => {
    return Object.entries(apiData).map(([name, contactArray]) => {
      const contactFields = contactArray[0]
      const fieldMap = {}

      contactFields.forEach((field) => {
        fieldMap[field.fieldname] = field.value
      })

      return {
        id: fieldMap.contact_no || "",
        firstName: fieldMap.firstname || "",
        lastName: fieldMap.lastname || "",
        title: fieldMap.title || "",
        organizationName: fieldMap.account_id || "",
        primaryEmail: fieldMap.email || "",
        officePhone: fieldMap.phone || "",
        mobilePhone: fieldMap.mobile || "",
        assignedTo: fieldMap.assigned_user_id || "Unassigned",
        mailingStreet: fieldMap.mailingstreet || "",
        mailingCity: fieldMap.mailingcity || "",
        mailingState: fieldMap.mailingstate || "",
        mailingZip: fieldMap.mailingzip || "",
        mailingCountry: fieldMap.mailingcountry || "",
        description: fieldMap.description || "",
        rawData: contactFields,
      }
    })
  }

  const fetchData = () => {
    setLoading(true)
    fetch("http://localhost/vtiger_api/getAll.php",
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.success && data.data) {
          const transformedContacts = transformContactData(data.data)
          console.log("Transformed Contacts:", transformedContacts)
          setContacts(transformedContacts)
        } else {
          console.error("API returned unsuccessful response:", data)
          setContacts([])
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error)
        setContacts([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.organizationName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetails = (contact) => {
    setSelectedContact(contact)
    setShowDetails(true)
  }

  const handlePopup = (id) => {
    setPopupOpen(true)
    setContactId(id)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setTimeout(() => setSelectedContact(null), 300)
  }

  const handleAddContact = (newContact) => {
    const contact = {
      ...newContact,
      id: `CON${String(contacts.length + 1).padStart(3, "0")}`,
    }
    setContacts([...contacts, contact])
    setShowAddContact(false)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 w-full">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Main Container - Full Width */}
      <div className="relative w-full">
        {/* Header - Full Width */}
        <div className="relative bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Contacts
                </h1>
                <p className="text-gray-600 mt-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Manage your contact database with style
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowAddContact(true)} size="lg" className="shadow-lg hover:shadow-xl">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Full Width */}
        <div className="relative bg-white/60 backdrop-blur-lg border-b border-gray-200/50 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 shadow-sm"
                />
              </div>
              <Button variant="outline" className="shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Contacts Content - Full Width */}
        <div className="relative w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="flex justify-center items-center py-20 w-full">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-t-4 border-blue-300 opacity-20"></div>
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              /* Empty State - Centered but not width-constrained */
              <div className="w-full flex justify-center">
                <div className="max-w-md">
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                    <div className="text-center py-16 px-8">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="text-xl font-semibold text-gray-900 mb-2">No contacts found</div>
                      <div className="text-gray-500 mb-6">
                        {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first contact"}
                      </div>
                      <Button onClick={() => setShowAddContact(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Contacts Table - Full Width */
              <div className="w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Organization
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
                      {filteredContacts.map((contact, index) => (
                        <tr
                          key={contact.id}
                          className="hover:bg-blue-50/50 transition-all duration-200 hover:shadow-md group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="flex items-center cursor-pointer" onClick={() => handlePopup(contact.id)}>
                              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
                                {getInitials(contact.firstName, contact.lastName)}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200"></div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {contact.firstName} {contact.lastName}
                                </div>
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                  {contact.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">{contact.title || "-"}</div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              {contact.organizationName && <Building className="w-4 h-4 mr-2 text-gray-400" />}
                              {contact.organizationName || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                              {contact.primaryEmail && <Mail className="w-4 h-4 mr-2" />}
                              {contact.primaryEmail || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              {(contact.officePhone || contact.mobilePhone) && (
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              )}
                              {contact.officePhone || contact.mobilePhone || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <Badge variant="default" className="shadow-sm">
                              {contact.assignedTo}
                            </Badge>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(contact)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 shadow-sm hover:shadow-md"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="hover:bg-gray-50 shadow-sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center">
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 flex items-center">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Results count with enhanced styling */}
                <div className="border-t border-gray-200/50 px-6 py-4 w-full">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-blue-600">{filteredContacts.length}</span> of{" "}
                      <span className="font-semibold text-blue-600">{contacts.length}</span> contacts
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details Slide-out */}
      <ContactDetails contact={selectedContact} isOpen={showDetails} onClose={handleCloseDetails} />

      {/* Add Contact Slide-out */}
      <AddContact isOpen={showAddContact} onClose={() => setShowAddContact(false)} onSave={handleAddContact} />

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button onClick={() => setShowAddContact(true)} className="w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl">
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <Popup id={contactId} popupOpen={popupOpen} setPopupOpen={setPopupOpen} setLoading={setLoading} />
    </div>
  )
}
