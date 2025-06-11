import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - News Dashboard",
  description: "Login to access your News Dashboard account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">News Dashboard</h1>
      </div>
      <LoginForm />
    </div>
  );
}
