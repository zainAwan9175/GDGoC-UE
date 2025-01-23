'use client'

import Link from 'next/link'
import { Button } from "../components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button>
          Return Home
        </Button>
      </Link>
    </div>
  )
}