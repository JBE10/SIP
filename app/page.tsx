import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-emerald-600">SportMatch</h1>
          <p className="text-slate-600">Find your perfect sports partner today</p>
        </div>

        <div className="relative w-full h-64 mx-auto overflow-hidden rounded-2xl shadow-lg">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="People playing sports together"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <p className="text-white text-lg font-medium">Connect with athletes who match your skill level</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Link href="/swipe" className="w-full">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-xl shadow-md">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
