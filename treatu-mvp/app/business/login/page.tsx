import BusinessLoginForm from "@/components/BusinessLoginForm";

export default function BusinessLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <section>
        <h1 className="text-xl font-semibold mb-2">Business Login</h1>
        <BusinessLoginForm />
      </section>
    </main>
  );
}