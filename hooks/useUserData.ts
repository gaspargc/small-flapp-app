"use client"

import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export default function useUserData() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUserData must be used inside UserProvider")
  return ctx
}