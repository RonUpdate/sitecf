"use client"

// This file provides client-safe wrappers for server actions
// to prevent "revalidatePath" from being imported in client components

export async function clientCreateCategory(formData: FormData) {
  // Import the server action dynamically to prevent it from being
  // included in the client bundle
  const { createCategory } = await import("@/app/actions")
  return createCategory(formData)
}

export async function clientDownloadColoringPage(formData: FormData) {
  const { downloadColoringPage } = await import("@/app/actions")
  return downloadColoringPage(formData)
}
