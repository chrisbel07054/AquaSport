import React from "react"

const Input = React.forwardRef(({ label, error, className = "", type = "text", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <input
        type={type}
        className={`w-full px-4 py-2 bg-slate-800 border ${error ? "border-red-500" : "border-slate-700"} 
        rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${className}`}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"

export default Input

