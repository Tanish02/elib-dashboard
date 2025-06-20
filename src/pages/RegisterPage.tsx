import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Register } from "@/http/api";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router";

/////
const RegisterPage = () => {
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: Register,
    onSuccess: () => {
      console.log("Login success");
      navigate("/dashboard/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    },
  });

  const handleRegisterSubmit = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    if (!name || !email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    console.log("Login attempt:", { name, email, password });
    mutation.mutate({ name, email, password });
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
          {mutation.isError && (
            <span className="text-red-500 text-sm">
              {"Error while login. Please try again."}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="Name">Name</Label>
              <Input ref={nameRef} id="Name" placeholder="First-Name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="admin@memspace.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordRef}
                id="password"
                type="password"
                placeholder="Password"
              />
            </div>

            <Button
              onClick={handleRegisterSubmit}
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <LoaderPinwheel className="animate-spin" />
              )}
              <span className="ml-3"> Create an account </span>
            </Button>

            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to={"/auth/login"} className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

// end code

export default RegisterPage;
