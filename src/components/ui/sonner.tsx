"use client"

import React from "react"

interface ToasterProps {
  className?: string
}

const Toaster = ({ className, ...props }: ToasterProps) => {
  return (
    <div 
      className={`fixed top-4 right-4 z-50 pointer-events-none ${className || ''}`}
      {...props}
    >
      {/* Toast notifications will be rendered here */}
    </div>
  )
}

export { Toaster }
