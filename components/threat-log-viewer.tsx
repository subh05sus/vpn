import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type ThreatLog = {
  timestamp: string
  source: string
  destination: string
  flags: string
  details: string
}

const parseThreatLog = (log: string): ThreatLog => {
  const parts = log.split(" ")
  return {
    timestamp: parts[0],
    source: parts[2],
    destination: parts[4].replace(":", ""),
    flags:
      parts
        .find((p) => p.startsWith("Flags"))
        ?.replace("Flags", "")
        .replace("[", "")
        .replace("]", "")
        .replace(",", "") || "",
    details: parts.slice(5).join(" "),
  }
}

type ThreatLogViewerProps = {
  logs: string[]
}

export default function ThreatLogViewer({ logs }: ThreatLogViewerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const parsedLogs = logs.map(parseThreatLog)

  return (
    <div className="space-y-2">
      {parsedLogs.map((log, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleExpand(index)}
          >
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">{log.timestamp}</span>
              <span className="text-sm">
                {log.source} &gt; {log.destination}
              </span>
            </div>
            {expandedIndex === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          {expandedIndex === index && (
            <div className="p-2 bg-gray-100 border-t">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">Flags</dt>
                  <dd className="mt-1 text-gray-900">{log.flags}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">Details</dt>
                  <dd className="mt-1 text-gray-900 break-words">{log.details}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

