import { redirect } from "next/navigation"

export default function NewColoringPageRedirect() {
  redirect("/admin/coloring-pages/create")
}
