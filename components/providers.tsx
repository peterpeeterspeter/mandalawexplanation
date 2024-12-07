'use client'

import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Handle any client-side initialization
    console.log('Providers mounted')
  }, [])

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
