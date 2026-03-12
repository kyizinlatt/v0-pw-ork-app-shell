import { cn } from "@/lib/utils"

const cases = [
  {
    id: "CASE-1042",
    customer: "Acme Corp",
    service: "Data Migration",
    status: "Checking",
    slaDue: "Mar 14, 2026",
    assigned: "J. Rivera",
    created: "Mar 10, 2026",
  },
  {
    id: "CASE-1041",
    customer: "Globex Inc.",
    service: "Onboarding",
    status: "Working",
    slaDue: "Mar 13, 2026",
    assigned: "L. Chen",
    created: "Mar 9, 2026",
  },
  {
    id: "CASE-1039",
    customer: "Initech LLC",
    service: "Support Tier 2",
    status: "Closed",
    slaDue: "Mar 8, 2026",
    assigned: "M. Patel",
    created: "Mar 5, 2026",
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  Checking: {
    label: "Checking",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  Working: {
    label: "Working",
    className: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  },
  Closed: {
    label: "Closed",
    className: "bg-green-50 text-green-700 ring-1 ring-green-200",
  },
}

const columns = [
  "Case #",
  "Customer",
  "Service",
  "Status",
  "SLA Due",
  "Assigned",
  "Created",
]

export function CasesTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col}
                className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {cases.map((c) => {
            const status = statusConfig[c.status]
            return (
              <tr
                key={c.id}
                className="hover:bg-gray-50/70 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-indigo-700 whitespace-nowrap">
                  {c.id}
                </td>
                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                  {c.customer}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {c.service}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {c.slaDue}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {c.assigned}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {c.created}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
