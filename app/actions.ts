"use server"

import { redirect } from "next/navigation"

export async function startQuote() {
  redirect("/quote/address")
}
