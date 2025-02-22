"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import ThreatLogViewer from "./threat-log-viewer"

type Threat = {
  threat_type: string
  source_ip: string
  destination_ip: string
  timestamp: string
  description: string
  threat_level: string
  threat_score: number
  logs: string[]
}

const threats: Threat[] = [
  {
    threat_type: "Repeated Access",
    source_ip: "192.168.1.100",
    destination_ip: "192.168.1.1",
    timestamp: "12:10:37.016705",
    description: "Multiple requests to the /login endpoint from the same source IP.",
    threat_level: "Medium",
    threat_score: 5,
    logs: [
      "12:33:26.298832 IP openvpnas2.internal.cloudapp.net.40922 > 168.63.129.16.http: Flags [P.], seq 1:201, ack 1, win 502, options [nop,nop,TS val 4152209433 ecr 872297005], length 200: HTTP: GET /machine/?comp=goalstate HTTP/1.1",
      "12:33:26.300971 IP 168.63.129.16.http > openvpnas2.internal.cloudapp.net.40922: Flags [FP.], seq 1:2222, ack 201, win 16387, options [nop,nop,TS val 872297006 ecr 4152209433], length 2221: HTTP: HTTP/1.1 200 OK",
    ],
  },
  {
    threat_type: "Heavy Traffic",
    source_ip: "10.0.0.1",
    destination_ip: "192.168.1.1",
    timestamp: "12:10:37.028456",
    description: "High volume of SYN requests from multiple IPs targeting the same destination.",
    threat_level: "Medium",
    threat_score: 6,
    logs: [
      "12:33:26.298141 IP openvpnas2.internal.cloudapp.net.40922 > 168.63.129.16.http: Flags [S], seq 1842559004, win 64240, options [mss 1460,sackOK,TS val 4152209433 ecr 0,nop,wscale 7], length 0",
      "12:33:26.298774 IP 168.63.129.16.http > openvpnas2.internal.cloudapp.net.40922: Flags [S.], seq 2747469288, ack 1842559005, win 65535, options [mss 1460,nop,wscale 8,sackOK,TS val 872297005 ecr 4152209433], length 0",
      "12:33:26.298802 IP openvpnas2.internal.cloudapp.net.40922 > 168.63.129.16.http: Flags [.], ack 1, win 502, options [nop,nop,TS val 4152209433 ecr 872297005], length 0",
    ],
  },
  {
    threat_type: "Suspicious HTTP Request",
    source_ip: "172.16.0.1",
    destination_ip: "192.168.1.1",
    timestamp: "12:10:37.017477",
    description: "HTTP GET request to an uncommon API endpoint.",
    threat_level: "Medium",
    threat_score: 4,
    logs: [
      "12:33:26.298832 IP openvpnas2.internal.cloudapp.net.40922 > 168.63.129.16.http: Flags [P.], seq 1:201, ack 1, win 502, options [nop,nop,TS val 4152209433 ecr 872297005], length 200: HTTP: GET /machine/?comp=goalstate HTTP/1.1",
    ],
  },
]

export default function IncidentLogs() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const getThreatLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-yellow-100 text-yellow-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {threats.map((threat, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleExpand(index)}
          >
            <div className="flex items-center space-x-4">
              <AlertTriangle className="text-yellow-500" />
              <div>
                <h2 className="font-semibold">{threat.threat_type}</h2>
                <p className="text-sm text-gray-500">{threat.timestamp}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(threat.threat_level)}`}
              >
                {threat.threat_level}
              </span>
              {expandedIndex === index ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
          {expandedIndex === index && (
            <div className="p-4 bg-gray-50 border-t">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Source IP</dt>
                  <dd className="mt-1 text-sm text-gray-900">{threat.source_ip}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Destination IP</dt>
                  <dd className="mt-1 text-sm text-gray-900">{threat.destination_ip}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Threat Score</dt>
                  <dd className="mt-1 text-sm text-gray-900">{threat.threat_score}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{threat.description}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Related Logs</dt>
                  <dd className="mt-2">
                    <ThreatLogViewer logs={threat.logs} />
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

