"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Lock, Building2 } from "lucide-react"

const VtigerLogin = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const hasToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))

        if (hasToken) {
            navigate("/home")
        }
    }, [])

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        // Simulate API call
        try {
            const response = await fetch("http://localhost/vtigercrm/API/auth/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    accessKey: formData.password,
                }),
            })

            const data = await response.json();

            if (data["Auth User"] && data["Auth User"].sessionName) {
                // Store sessionName in localStorage
                localStorage.setItem("sessionName", data["Auth User"].sessionName);
                console.log("Login successful");
                navigate("/home");
            } else if (data.error) {
                setErrors((prev) => ({ ...prev, password: data.error }));
                throw new Error(data.error);
            } else {
                setErrors((prev) => ({ ...prev, password: "Login failed" }));
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4 lg:p-6">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                {/* Logo and Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Building2 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Vtiger CRM</h1>
                    <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 hover:shadow-2xl transition-all duration-300">
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User
                                        className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${errors.username ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
                                            }`}
                                    />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.username
                                        ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 hover:border-gray-400 focus:bg-white"
                                        }`}
                                    placeholder="Enter your username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock
                                        className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${errors.password ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
                                            }`}
                                    />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-9 sm:pl-10 pr-11 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.password
                                        ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 hover:border-gray-400 focus:bg-white"
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg sm:rounded-r-xl transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors self-start sm:self-auto"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-[1.02] disabled:scale-100 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    <span className="text-sm sm:text-base">Signing in...</span>
                                </>
                            ) : (
                                <span className="text-sm sm:text-base">Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs sm:text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Contact Administrator
                            </button>
                        </p>
                    </div>
                </div>

                {/* Version Info */}
                <div className="text-center mt-4 sm:mt-6">
                    <p className="text-xs text-gray-500">Vtiger CRM v8.0 • Powered by Vtiger</p>
                </div>
            </div>
        </div>
    )
}

export default VtigerLogin
