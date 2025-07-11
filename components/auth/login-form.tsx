"use client"

import { useSearchParams } from "next/navigation"
import { signIn, signUp } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <Card className="w-full max-w-md bg-black/50 backdrop-blur-lg border-primary/20 text-foreground">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold sacred-text bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Howlin Mold
        </CardTitle>
        <CardDescription className="text-primary/70">Enter the Vault of Echoes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30">
            <TabsTrigger value="login">Enter</TabsTrigger>
            <TabsTrigger value="signup">Join</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form action={signIn} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  name="email"
                  type="email"
                  defaultValue="admin@howlinmold.com"
                  placeholder="admin@howlinmold.com"
                  required
                  className="bg-black/30 border-primary/30 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input
                  id="password-login"
                  name="password"
                  type="password"
                  defaultValue="admin123"
                  placeholder="••••••••"
                  required
                  className="bg-black/30 border-primary/30 focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Enter the Vault
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form action={signUp} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="username-signup">Username</Label>
                <Input
                  id="username-signup"
                  name="username"
                  type="text"
                  placeholder="howlin.fan"
                  required
                  className="bg-black/30 border-primary/30 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-black/30 border-primary/30 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-black/30 border-primary/30 focus:ring-primary"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
              >
                Join the Ritual
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message && (
          <Alert variant="default" className="mt-4 bg-blue-900/50 border-blue-500/50 text-white">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-semibold mb-2 text-foreground/80">Demo Account:</p>
          <div className="space-y-1 font-mono text-xs">
            <p>admin@howlinmold.com / admin123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
