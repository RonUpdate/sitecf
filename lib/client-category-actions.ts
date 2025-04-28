"use client"

// This file provides client-safe wrappers for server actions
// to prevent "revalidatePath" from being imported in client components

export async function clientCreateCategory(formData: FormData) {
  // Import the server action dynamically to prevent it from being
  // included in the client bundle
  const { createCategory } = await import("@/app/admin/categories/actions")
  return createCategory(formData)
}

export async function clientUpdateCategory(formData: FormData) {
  const { updateCategory } = await import("@/app/admin/categories/actions")
  return updateCategory(formData)
}

export async function clientDeleteCategory(formData: FormData) {
  const { deleteCategory } = await import("@/app/admin/categories/actions")
  return deleteCategory(formData)
}
