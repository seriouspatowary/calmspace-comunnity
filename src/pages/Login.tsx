import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, authStatus } = useSelector(
    (state: RootState) => state.auth
  );
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
    };

    useEffect(() => {
    if (authStatus === "success") {
      navigate("/"); // Redirect to home
    }
  }, [authStatus, navigate]);
  return (
    <form onSubmit={handleLogin}>
      <div className="flex items-center justify-center mt-20">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium -mt-2">
                  {error}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button variant="outline" className="w-full" type="button">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default Login;
