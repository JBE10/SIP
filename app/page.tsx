"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/swipe")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return (
      <div className="flex flex-col min-h-screen">
        {isAuthenticated ? (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-indigo-700">
              <LoadingSpinner size="lg" />
            </div>
        ) : (
            <>
              <motion.header
                  className="p-4 absolute top-0 right-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
              >
                <ThemeToggle />
              </motion.header>

              <motion.main
                  className="flex-1 flex flex-col items-center justify-center p-4 text-center gap-8"
                  variants={container}
                  initial="hidden"
                  animate="show"
              >
                <motion.div className="space-y-4" variants={item}>
                  <motion.h1
                      className="text-5xl font-bold text-primary relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.1,
                      }}
                  >
                <span className="relative inline-block">
                  SportMatch
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/50 rounded-full"></span>
                </span>
                  </motion.h1>
                  <motion.p className="text-xl text-muted-foreground max-w-md" variants={item}>
                    Conecta con personas que comparten tus intereses deportivos en Buenos Aires
                  </motion.p>
                </motion.div>

                <motion.div className="flex flex-col gap-4 w-full max-w-xs" variants={item}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="h-12 w-full">
                      <Link href="/menu">Empecemos</Link>
                    </Button>
                  </motion.div>

                  <div className="flex items-center gap-2 my-2">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-muted-foreground text-sm">o</span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button asChild variant="outline" size="lg" className="h-12 w-full">
                      <Link href="/menu">Iniciar sesión</Link>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button asChild variant="link" className="mt-2 w-full">
                      <Link href="/menu">Registrarse</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.main>
              <motion.footer
                  className="border-t py-4 text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
              >
                © 2025 SportMatch - Todos los derechos reservados
              </motion.footer>
            </>
        )}
      </div>
  )
}
