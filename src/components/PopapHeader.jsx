"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Star,
  Tag,
  Link,
  Share,
  Mail,
  Phone,
  MoreHorizontal,
  Search,
  ChevronDown,
  Home,
  FileText,
  Target,
  Calendar,
  CheckSquare,
  RefreshCw,
  ShoppingBag,
  File,
  Settings,
} from "lucide-react"

const NavItem = ({ icon: Icon, label, active, onClick, index }) => {
  return (
    <div
      className="flex items-center space-x-2 py-2 md:py-3 cursor-pointer relative whitespace-nowrap"
      onClick={onClick}
    >
      <Icon className={`w-4 h-4 transition-colors duration-300 ${active ? "text-blue-600" : "text-gray-500"}`} />
      <span
        className={`text-xs md:text-sm font-medium tracking-wide transition-colors duration-300 ${
          active ? "text-blue-600 font-bold" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function PopapHeader({ data, isOpen, setIsOpen, onSearch, searchQuery, activeTab, onTabChange }) {
  const [indicatorWidth, setIndicatorWidth] = useState(0)
  const [indicatorOffset, setIndicatorOffset] = useState(0)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [visibleItems, setVisibleItems] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
  const [showConvertMenu, setShowConvertMenu] = useState(false)
  const navContainerRef = useRef(null)

  // Secondary navigation items
  const navItems = [
    { icon: Home, label: "Summary", id: "summary" },
    { icon: FileText, label: "Details", id: "contact" }, // Maps to contact component
    { icon: Target, label: "Touchpoints", id: "potential" }, // Maps to potential component
    { icon: Calendar, label: "Events", id: "events" },
    { icon: CheckSquare, label: "Tasks", id: "tasks" },
    { icon: RefreshCw, label: "Updates", id: "updates" },
    { icon: ShoppingBag, label: "Products", id: "products" },
    { icon: File, label: "Documents", id: "documents" },
  ]

  // Calculate visible items based on container width
  const updateVisibleItems = () => {
    if (!navContainerRef.current) return

    const containerWidth = navContainerRef.current.offsetWidth
    const moreButtonWidth = 80
    let currentWidth = 0
    const visible = []

    navItems.forEach((item, index) => {
      const itemElement = navContainerRef.current.children[index]
      if (itemElement) {
        const itemWidth = itemElement.offsetWidth
        if (currentWidth + itemWidth + moreButtonWidth < containerWidth) {
          visible.push(item)
          currentWidth += itemWidth
        }
      }
    })

    setVisibleItems(visible)
  }

  // Handle responsive layout and initial visible items
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      updateVisibleItems()
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleNavClick = (id, index, event) => {
    // Only trigger tab change for contact and potential
    if ((id === "contact" || id === "potential") && onTabChange) {
      onTabChange(id)
    }

    const button = event.currentTarget
    const buttonWidth = button.offsetWidth
    const buttonLeft = button.offsetLeft

    setIndicatorWidth(buttonWidth)
    setIndicatorOffset(buttonLeft)
  }

  const handleActionClick = (action) => {
    switch (action) {
      case "star":
        setIsStarred(!isStarred)
        break
      case "tag":
        console.log("Tag clicked")
        break
      case "link":
        console.log("Link clicked")
        break
      case "share":
        console.log("Share clicked")
        break
      case "mail":
        window.open(`mailto:${data?.email || ""}`)
        break
      case "phone":
        window.open(`tel:${data?.phone || ""}`)
        break
      case "edit":
        console.log("Edit clicked")
        break
      case "more":
        console.log("More options clicked")
        break
      default:
        break
    }
  }

  return (
    <div className="bg-white rounded-md border-b border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 md:px-6 py-2 md:py-4">
        <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
          <ArrowLeft
            className="w-4 h-4 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
            onClick={() => setIsOpen(false)}
          />
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-6 h-6 md:w-10 md:h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-xs md:text-sm">👤</span>
            </div>
            <span className="text-base md:text-xl font-bold tracking-tight text-gray-900 truncate">
              {data?.data?.name || "Mohamed EDDAHMANI"}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Star
              className={`w-5 h-5 cursor-pointer transition-colors ${
                isStarred ? "text-yellow-400 fill-current" : "text-gray-400 hover:text-yellow-400"
              }`}
              onClick={() => handleActionClick("star")}
            />
            <Tag
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => handleActionClick("tag")}
            />
            <Link
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => handleActionClick("link")}
            />
            <Share
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => handleActionClick("share")}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 mt-2 md:mt-0 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs md:text-sm font-medium text-gray-600 hidden md:block">Convert Contact</span>
          <div className="relative">
            <div
              className="flex items-center space-x-1 md:space-x-2 bg-gray-100 rounded-lg px-2 md:px-3 py-1 md:py-2 hover:bg-gray-200 transition-colors cursor-pointer"
              onClick={() => setShowConvertMenu(!showConvertMenu)}
            >
              <span className="text-xs md:text-sm font-semibold text-gray-700">Lead</span>
              <div className="bg-gray-400 text-white text-xs px-1 md:px-2 py-0.5 md:py-1 rounded font-medium">Cold</div>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
            </div>

            {showConvertMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1">
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">Convert to Contact</div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">Convert to Account</div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">Convert to Opportunity</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <Mail
              className="w-4 h-4 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => handleActionClick("mail")}
            />
            <Phone
              className="w-4 h-4 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => handleActionClick("phone")}
            />
            <span
              className="w-4 h-4 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => handleActionClick("edit")}
            >
              ✏️
            </span>
            <MoreHorizontal
              className="w-4 h-4 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => handleActionClick("more")}
            />
          </div>
        </div>
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="flex items-center px-2 md:px-6 border-b border-gray-200">
        <div
          className="flex space-x-2 md:space-x-8 relative overflow-x-auto scrollbar-hide w-full"
          ref={navContainerRef}
        >
          {/* Sliding indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out"
            style={{
              width: `${indicatorWidth}px`,
              transform: `translateX(${indicatorOffset}px)`,
            }}
          />

          {navItems.map((item, index) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={(e) => handleNavClick(item.id, index, e)}
              index={index}
            />
          ))}

          {/* More Menu Button */}
          <div className="relative">
            <div
              className="flex items-center space-x-1 md:space-x-2 py-2 md:py-3 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <span className="text-xs md:text-sm text-gray-600 font-medium">|| More</span>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </div>

            {/* Dropdown Menu */}
            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {navItems
                  .filter((item) => !visibleItems.includes(item))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-2 px-3 md:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if ((item.id === "contact" || item.id === "potential") && onTabChange) {
                          onTabChange(item.id)
                        }
                        setShowMoreMenu(false)
                      }}
                    >
                      <item.icon className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                      <span className="text-xs md:text-sm text-gray-600">{item.label}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="ml-auto hidden md:block">
          <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-2 md:px-6 py-2 md:py-4 bg-gray-50">
        <div className="flex relative">
          <Search className="w-3 h-3 md:w-4 md:h-4 text-gray-400 absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab || "contact"} fields...`}
            value={searchQuery}
            onChange={onSearch}
            className="w-full md:w-96 pl-7 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>
    </div>
  )
}

export default PopapHeader
