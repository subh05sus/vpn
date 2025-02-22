"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Shield, Wallet, Lock, Activity, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { generateToken } from "@/lib/utils"
import { ethers } from "ethers"

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const [token, setToken] = useState("")
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0].address)
          const newToken = generateToken()
          setToken(newToken)
        }
      }
    } catch (err) {
      console.error("Error checking connection:", err)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask!")
      return
    }

    setLoading(true)
    setError("")

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length > 0) {
        setIsConnected(true)
        setAccount(accounts[0])
        const newToken = generateToken()
        setToken(newToken)
      }
    } catch (err) {
      console.error("Connection error:", err)
      setError("Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token)
    } catch (err) {
      console.error("Failed to copy token:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Notification Banner */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-destructive/10 border-b border-destructive/20 dark:border-destructive/30"
          >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm">Potential threat detected: Suspicious activity from 192.168.1.1</span>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-destructive hover:text-destructive/80">
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            Decentralized Security,
            <br />
            <span className="text-primary">Powered by AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Next-generation VPN security using blockchain authentication and artificial intelligence threat detection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button onClick={connectWallet} disabled={loading || isConnected} className="px-8">
              <span className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {loading ? "Connecting..." : isConnected ? "Connected" : "Connect Wallet"}
              </span>
            </Button>
            <Button variant="outline" className="px-8">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Connect to VPN
              </span>
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </motion.div>
      </section>

      {/* Token Display */}
      <AnimatePresence>
        {isConnected && token && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 pb-20"
          >
            <Card className="max-w-2xl mx-auto">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Security Token</h3>
                <div className="flex items-center gap-4">
                  <code className="flex-1 p-3 bg-muted rounded-lg font-mono text-xs sm:text-sm break-all">{token}</code>
                  <Button onClick={copyToken} variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Connected Address: {account}</p>
              </div>
            </Card>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg border bg-card"
          >
            <Lock className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-4">Blockchain Authentication</h3>
            <p className="text-muted-foreground">
              Secure your connection with decentralized authentication powered by Polygon smart contracts and MetaMask
              integration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg border bg-card"
          >
            <Activity className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-4">AI Threat Detection</h3>
            <p className="text-muted-foreground">
              Advanced artificial intelligence constantly monitors your connection for potential security threats and
              suspicious activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Secure VPN. All rights reserved.</p>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  )
}

