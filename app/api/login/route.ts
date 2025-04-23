import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { email, password } = await req.json()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  })
}
