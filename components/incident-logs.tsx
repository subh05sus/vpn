"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import ThreatLogViewer from "./threat-log-viewer";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Threat = {
  threat_type: string;
  source_ip: string;
  destination_ip: string;
  timestamp: string;
  description: string;
  threat_level: string;
  threat_score: number;
  logs: string[];
};

const initialThreats: Threat[] = [
  {
    threat_type: "Repeated Access",
    source_ip: "192.168.1.100",
    destination_ip: "192.168.1.1",
    timestamp: "12:10:37.016705",
    description:
      "Multiple requests to the /login endpoint from the same source IP.",
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
    description:
      "High volume of SYN requests from multiple IPs targeting the same destination.",
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
];

export default function IncidentLogs() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [threats, setThreats] = useState<Threat[]>(initialThreats);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        // const response = await axios.post("http://localhost:5000/analysis", { logs });
        // setThreats(response.data.threats);
      } catch (error) {
        console.error("Error fetching threats:", error);
      }
    };

    const interval = setInterval(() => {
      fetchThreats();
      // Simulate incoming logs
      const newLog = `12:33:26.298832 IP openvpnas2.internal.cloudapp.net.40922 > 168.63.129.16.http: Flags [P.], seq 1:201, ack 1, win 502, options [nop,nop,TS val 4152209433 ecr 872297005], length 200: HTTP: GET /machine/?comp=goalstate HTTP/1.1`;
      setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 10)); // Keep only the last 10 logs
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getThreatLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const threatLevelData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Threat Levels",
        data: [
          threats.filter((t) => t.threat_level.toLowerCase() === "low").length,
          threats.filter((t) => t.threat_level.toLowerCase() === "medium")
            .length,
          threats.filter((t) => t.threat_level.toLowerCase() === "high").length,
        ],
        backgroundColor: ["#fde047", "#fb923c", "#f87171"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-rows-3 gap-4">
          <div className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Threats
                </h3>
                <p className="text-3xl font-bold mt-2">{threats.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  High Threats
                </h3>
                <p className="text-3xl font-bold mt-2 text-red-600">
                  {
                    threats.filter(
                      (t) => t.threat_level.toLowerCase() === "high"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Medium Threats
                </h3>
                <p className="text-3xl font-bold mt-2 text-orange-600">
                  {
                    threats.filter(
                      (t) => t.threat_level.toLowerCase() === "medium"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            Threat Level Distribution
          </h3>
          <Bar data={threatLevelData} />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Live Logs</h3>
        <div className="h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-gray-700 p-2 border-b">
              {log}
            </div>
          ))}
        </div>
      </div>

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
                className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(
                  threat.threat_level
                )}`}
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
                  <dt className="text-sm font-medium text-gray-500">
                    Source IP
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {threat.source_ip}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Destination IP
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {threat.destination_ip}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Threat Score
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {threat.threat_score}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {threat.description}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Related Logs
                  </dt>
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
  );
}
