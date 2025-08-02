"use client";

import { useActionState } from "react";
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import { Login } from "@/lib/auth/actions";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction] = useActionState(Login, null);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={formAction}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Logo />
            </div>
            <span className="sr-only">Loom</span>
            <h1 className="text-xl font-bold">Welcome to Loom</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {state?.message ? (
              <div className="py-2 flex justify-center items-center rounded-sm bg-red-100 border border-red-300">
                <span className="text-sm font-light text-center block">{state?.message}</span>
              </div>
            ) : null}
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                placeholder="example_john"
                name="username"
              />
              {state?.error?.username ? (
                <div aria-live="polite" aria-atomic="true" className="flex justify-center w-full py-1 border border-red-500 rounded-sm" role="alert">
                  <span className="text-sm w-full text-center text-red-500">{state?.error?.username}</span>
                </div>
              ) : null}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                name="password"
              />
              {state?.error?.password ? (
                <div aria-live="polite" aria-atomic="true" className="flex justify-center w-full py-1 border border-red-500 rounded-sm" role="alert">
                  <span className="text-sm w-full text-center text-red-500">{state?.error?.password}</span>
                </div>
              ) : null}
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
