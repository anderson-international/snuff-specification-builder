import AuthForm from "@/components/auth/auth-form"

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
      <AuthForm initialMode="signup" />
    </div>
  )
}

