import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/http/api";
import useTokenStore from "@/store";
// import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Apple, AtSign, Github, LoaderPinwheel } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- use react-router-dom
import type { AxiosResponse } from "@tanstack/react-query";

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  interface LoginResponse {
    accessToken: string;
  }

  const mutation = useMutation<
    AxiosResponse<LoginResponse>,
    Error,
    { email: string; password: string }
  >({
    mutationFn: login,
    onSuccess: (response) => {
      console.log("Login success", response);
      setToken(response.data.accessToken);
      navigate("/dashboard/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your details.");
    },
  });

  const handleLoginSubmit = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    console.log("Login attempt:", { email, password });
    mutation.mutate({ email, password });
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="w-[380px] shadow-xl">
        <CardContent className="p-6 md:p-8">
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginSubmit();
            }}
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">
                Enter your email to Login to your account <br />
                {mutation.isError && (
                  <span className="text-red-500 text-sm">
                    {"Error while login. Please try again."}
                  </span>
                )}
                {/* {mutation.isPending && <div>Loading...</div>} */}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                ref={passwordRef}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              onClick={handleLoginSubmit}
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <LoaderPinwheel className="animate-spin" />
              )}
              <span className="ml-3"> Login </span>
            </Button>

            <div className="relative text-center text-sm">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <span className="relative bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex justify-center items-center"
              >
                <span className="sr-only">Login with Apple</span>
                <Apple />
              </Button>

              <Button
                variant="outline"
                className="flex justify-center items-center"
              >
                <span className="sr-only">Login with Google</span>
                <AtSign />
              </Button>
              <Button
                variant="outline"
                className="flex justify-center items-center"
              >
                <span className="sr-only">Login with Meta</span>
                <Github />
              </Button>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to={"/auth/register"}
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;
