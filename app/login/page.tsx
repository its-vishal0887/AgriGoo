"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AgriGooLogo } from "@/components/agrigoo-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Loader2, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  identifier: z
    .string()
    .min(5, "Enter a valid email or phone number")
    .max(100, "Too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
})

type LoginValues = z.infer<typeof loginSchema>

const testimonials = [
  {
    quote:
      "AgriGoo caught blight early. Saved my tomato crop and a lot of money.",
    name: "Ramesh Patel",
    role: "Tomato Farmer, Gujarat",
  },
  {
    quote:
      "The soil health tips improved yield by 18% in one season.",
    name: "Sita Devi",
    role: "Wheat Farmer, UP",
  },
  // Removed market-related testimonial to focus on crop health
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), mode: "onBlur" })

  // rotate testimonials every 5s
  useState(() => {
    const id = setInterval(() => {
      setCarouselIndex((idx) => (idx + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(id)
  })

  async function onSubmit(values: LoginValues) {
    setIsLoading(true)
    // Simulate secure sign-in call
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    // TODO: integrate real auth
  }

  return (
    <div className={cn("min-h-svh w-full agri-bg")}> 
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-5 gap-0 md:gap-8 px-4 md:px-6 py-8 md:py-12">
        {/* Left showcase 60% (spans 3) */}
        <section className="relative md:col-span-3 overflow-hidden rounded-2xl bg-card shadow-sm border border-border">
          <div className="absolute inset-0 agrigoo-gradient opacity-5" />
          <div className="relative p-6 md:p-10 flex flex-col h-full">
            <AgriGooLogo size="lg" className="mb-6" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-2">
              Smart Farming, Healthier Crops <span className="text-xl">🍃</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-prose">
              Boost yields with AI-powered diagnostics, soil insights, market intelligence, and on-field guidance.
            </p>

            {/* Feature highlights */}
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "AI Disease Detection",
                "Soil Health Analysis",
                "Market Price Intelligence",
                "Mobile Field Support",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2"
                >
                  <CheckCircle2 className="text-primary" />
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial carousel */}
            <div className="mt-8 grow flex">
              <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/70 p-5">
                {testimonials.map((t, i) => (
                  <blockquote
                    key={i}
                    className={cn(
                      "transition-opacity duration-700",
                      i === carouselIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                    )}
                  >
                    <p className="text-lg md:text-xl font-semibold leading-snug">
                      “{t.quote}”
                    </p>
                    <footer className="mt-3 text-sm text-muted-foreground">
                      — {t.name}, {t.role}
                    </footer>
                  </blockquote>
                ))}
                <div className="absolute bottom-3 right-3 flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <span
                      key={i}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={cn(
                        "size-2 rounded-full",
                        i === carouselIndex ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Lock className="size-4 text-primary" /> Secure & Encrypted
              </span>
              <span className="inline-flex items-center gap-1">ISO 27001 Ready</span>
              <span className="inline-flex items-center gap-1">GDPR Aligned</span>
            </div>
          </div>
        </section>

        {/* Right form 40% (spans 2) */}
        <section className="md:col-span-2">
          <div className="h-full rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold">Welcome Back to AgriGoo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to continue growing smarter.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <label htmlFor="identifier" className="mb-1 block text-sm font-medium">
                  Email or Phone
                </label>
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="farmer@agrigoo.com or +91 98765 43210"
                  aria-invalid={!!errors.identifier}
                  aria-describedby={errors.identifier ? "identifier-error" : undefined}
                  {...register("identifier")}
                />
                {errors.identifier && (
                  <p id="identifier-error" className="mt-1 text-xs text-destructive">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-[oklch(0.55_0.18_155)]" {...register("remember")} />
                  Remember me
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Social logins */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="w-full">
                  <svg aria-hidden className="size-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.7h5.2c-.2 1.2-1.3 3.6-5.2 3.6-3.1 0-5.7-2.6-5.7-5.8s2.6-5.8 5.7-5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.9 3.7 14.7 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1-.1-1.5H12z"/></svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  <svg aria-hidden className="size-4" viewBox="0 0 24 24"><path fill="#1877F2" d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.595 24 1.326 24H12.82v-9.294H9.692V11.18h3.128V8.414c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.526h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.675 0z"/></svg>
                  Facebook
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <Button asChild className="w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}


