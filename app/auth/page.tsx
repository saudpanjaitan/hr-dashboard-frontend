"use client"; // Menandai file ini sebagai komponen klien

import { useState } from "react";
import { useRouter } from "next/navigation"; // Ganti next/router dengan next/navigation
import { Button } from "@/components/ui/button";
import "../globals.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://hr-dashboard-app-project.et.r.appspot.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.token && data.user && data.user.role) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role.roleName); // Simpan nama peran pengguna

          // Redirect based on user role
          if (data.user.role.roleName === "Administrator") {
            router.push("/admin"); // Redirect to admin page
          } else if (data.user.role.roleName === "User") {
            router.push("/admin/employee-self-service"); // Redirect to employee self service page
          } else {
            console.error("Unknown user role", data.user.role.roleName);
          }
        } else {
          console.error("Invalid response structure", data);
        }
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <div className="flex justify-center items-center inset-0 absolute">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <CardFooter>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
