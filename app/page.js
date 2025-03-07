import SnuffSpecForm from "./components/SnuffSpecForm"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Snuff Specification Builder</h1>
      </div>
      <div className="w-full max-w-2xl">
        <p className="text-lg mb-6">Use the form below to create your snuff specification.</p>
        <SnuffSpecForm />
      </div>
    </main>
  )
}

