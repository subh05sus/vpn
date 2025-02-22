import IncidentLogs from "@/components/incident-logs"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Security Incident Logs</h1>
      <IncidentLogs />
    </main>
  )
}

