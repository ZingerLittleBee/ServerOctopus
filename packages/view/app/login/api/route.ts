import { cookies } from 'next/headers'
import {NextResponse} from "next/server";
import * as process from "process";
import {ResultUtil} from "@/utils/ResultUtil";
import {toast} from "@/components/ui/use-toast";
import * as React from "react";

export async function GET(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  return NextResponse.json('Hello, Next.js!')
}

// sign-in
export async function POST(req: Request) {
  const { username, email, password } = await req.json()

  const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password }),
  })

  const result= await res.json() as ResultUtil<{ token: string }>

  if (result.success) {
    return NextResponse.redirect('/dashboard', {
      headers: {
        'Set-Cookie': `token=${result.data.token}; Path=/; HttpOnly`,
      },
    })
  } else {
    toast({
      title: "Login Failed",
    })
    // return NextResponse.redirect('/login')
  }
}
