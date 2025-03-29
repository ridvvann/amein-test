"use client"

// Simplified toast component for the demo
import { createContext, useContext } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const ToastContext = createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => {},
})

export const toast = (props: ToastProps) => {
  // In a real implementation, this would show a toast notification
  console.log("Toast:", props)
  alert(`${props.title}\n${props.description}`)
}

export const useToast = () => {
  return useContext(ToastContext)
}

