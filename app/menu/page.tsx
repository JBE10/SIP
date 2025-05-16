"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function MenuPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <motion.main
        className="flex-1 flex flex-col items-center justify-center p-4 text-center gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="space-y-4" variants={item}>
          <motion.h1
            className="text-4xl font-bold text-primary relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <span className="relative">
              SportMatch
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/50 rounded-full"></span>
            </span>
          </motion.h1>
          <motion.p className="text-muted-foreground" variants={item}>
            ¿Qué te gustaría hacer?
          </motion.p>
        </motion.div>

        <motion.div className="flex flex-col gap-4 w-full max-w-xs" variants={container}>
          <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="lg" className="h-12 w-full">
              <Link href="/swipe">Comenzar a buscar</Link>
            </Button>
          </motion.div>

          <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button asChild variant="outline" size="lg" className="h-12 w-full">
              <Link href="/profile">Mi perfil</Link>
            </Button>
          </motion.div>

          <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button asChild variant="outline" size="lg" className="h-12 w-full">
              <Link href="/chats">Mis mensajes</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.main>
      <motion.footer
        className="border-t py-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © 2025 SportMatch - Todos los derechos reservados
      </motion.footer>
    </div>
  )
}
