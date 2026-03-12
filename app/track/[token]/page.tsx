"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, Check, Clock, FileText, AlertCircle } from "lucide-react"

// Public status stages for customer view (simplified from internal statuses)
type PublicStage = "received" | "processing" | "completed" | "ready" | "closed"

const PUBLIC_STAGES = [
  {
    id: "received",
    label_mm: "ဖိုင်လက်ခံ / စစ်ဆေးနေဆဲ",
    label_en: "Received & Reviewing",
    internalStatuses: ["RECEIVE", "CHECKING"],
  },
  {
    id: "processing",
    label_mm: "လုပ်ငန်းဆောင်ရွက်နေဆဲ",
    label_en: "Processing",
    internalStatuses: ["SUBMITTED", "WORKING"],
  },
  {
    id: "completed",
    label_mm: "ပြီးစီးပြီ / ထုတ်ပြန်ပြီ",
    label_en: "Completed",
    internalStatuses: ["DONE", "PUBLISH"],
  },
  {
    id: "ready",
    label_mm: "စာရွက်စာတမ်းထုတ်ယူရန်",
    label_en: "Ready for Pickup",
    internalStatuses: ["AWAITING_PICKUP", "DELIVERY"],
  },
  {
    id: "closed",
    label_mm: "ပြီးဆုံးပြီ",
    label_en: "Closed",
    internalStatuses: ["CLOSED"],
  },
]

// Sample public case data (what customer can see)
const samplePublicCase = {
  case_number: "HQ-KS-110326-0001",
  service_type_name: "Kyant Sal (ကျန်းဆယ်)",
  internal_status: "PUBLISH",
  created_at: "11 Mar 2026",
  pickup_deadline: "11 Apr 2027",
  customer_requested_at: null as string | null,
  public_documents: [
    {
      id: "doc-1",
      original_name: "kyant-sal-certificate.pdf",
      mime_type: "application/pdf",
      file_size_bytes: 245000,
      created_at: "15 Mar 2026",
    },
    {
      id: "doc-2",
      original_name: "receipt.pdf",
      mime_type: "application/pdf",
      file_size_bytes: 120000,
      created_at: "11 Mar 2026",
    },
  ],
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export default function PublicTrackPage() {
  const params = useParams()
  const token = params.token as string
  const [requested, setRequested] = useState(!!samplePublicCase.customer_requested_at)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const caseData = samplePublicCase

  // Determine current stage
  const currentStageIndex = PUBLIC_STAGES.findIndex((stage) =>
    stage.internalStatuses.includes(caseData.internal_status)
  )

  // Can request final doc?
  const canRequestFinalDoc =
    caseData.internal_status === "AWAITING_PICKUP" && !caseData.customer_requested_at

  const handleRequestFinalDoc = async () => {
    setIsPending(true)
    setError(null)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRequested(true)
    setIsPending(false)
  }

  const handleDownload = (doc: typeof caseData.public_documents[0]) => {
    // In production, this would generate and use a signed URL for secure download
    window.open(`/api/documents/${doc.id}/download`, "_blank")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">SRP</span>
          </div>
          <div>
            <p className="font-bold text-slate-900">SRP Visa & Work Permit</p>
            <p className="text-xs text-slate-500">
              ဗီဇာ နှင့် ကျွမ်းကျင်သားလုပ်ငန်းခွင်ဝင်ခွင့်ပြုချက် ဝန်ဆောင်မှု
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Case Number + Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-xs text-slate-500 mb-1">ဖိုင်နံပါတ် / Case Number</p>
          <p className="font-mono text-xl font-bold text-slate-900">{caseData.case_number}</p>
          <p className="text-sm text-slate-600 mt-1">{caseData.service_type_name}</p>
          <div className="mt-3">
            <PublicStatusBadge status={caseData.internal_status} />
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">
            လုပ်ငန်းစဉ် / Progress
          </p>
          <div className="space-y-0">
            {PUBLIC_STAGES.map((stage, idx) => {
              const isLast = idx === PUBLIC_STAGES.length - 1
              const isCurrent = idx === currentStageIndex
              const isCompleted = idx < currentStageIndex

              return (
                <div key={stage.id} className="flex gap-3">
                  {/* Dot + Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center",
                        isCurrent && "border-indigo-500 bg-indigo-500",
                        isCompleted && "border-green-500 bg-green-500",
                        !isCurrent && !isCompleted && "border-slate-300 bg-white"
                      )}
                    >
                      {isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          "w-0.5 flex-1 mt-1 mb-1",
                          isCompleted ? "bg-green-400" : "bg-slate-200"
                        )}
                        style={{ minHeight: "20px" }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="pb-4">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCurrent && "text-indigo-600",
                        isCompleted && "text-green-700",
                        !isCurrent && !isCompleted && "text-slate-400"
                      )}
                    >
                      {stage.label_mm}
                    </p>
                    <p className="text-xs text-slate-400">{stage.label_en}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Request Final Doc button (AWAITING_PICKUP only) */}
        {canRequestFinalDoc && !requested && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <p className="font-semibold text-amber-800 flex items-center gap-2">
              <FileText className="size-5" />
              သင်၏စာရွက်စာတမ်းများ အဆင်သင့်ဖြစ်နေပြီ
            </p>
            <p className="text-sm text-amber-700">
              ကျွန်ုပ်တို့ပြင်ဆင်ပေးသောဖိုင်များ ယူရန်အတွက် အောက်ပါခလုတ်ကို နှိပ်ပါ။ ၃
              ပတ်အတွင်း ဖြေရှင်းပေးပါမည်။
            </p>
            <p className="text-xs text-amber-600">
              Your documents are ready. Click the button below to request pickup. We will
              process within 3 weeks.
            </p>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2">
                <AlertCircle className="size-4" />
                {error}
              </p>
            )}
            <Button
              onClick={handleRequestFinalDoc}
              disabled={isPending}
              className={cn(
                "w-full py-3 font-semibold text-white text-sm transition-all",
                isPending
                  ? "bg-amber-300 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 active:scale-95"
              )}
            >
              {isPending ? "တောင်းဆိုနေသည်..." : "စာရွက်စာတမ်းပြင်ဆင်ပေးပါ ✓"}
            </Button>
          </div>
        )}

        {/* Already requested */}
        {(requested || !!caseData.customer_requested_at) &&
          caseData.internal_status === "AWAITING_PICKUP" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="font-semibold text-green-800 flex items-center gap-2">
                <Check className="size-5" />
                တောင်းဆိုမှုလက်ခံပြီး
              </p>
              <p className="text-sm text-green-700 mt-1">
                သင်၏ တောင်းဆိုမှုကို လက်ခံပြီးဖြစ်ပါသည်။ ၃ ပတ်အတွင်း
                ပြင်ဆင်ပေးပါမည်။
              </p>
              <p className="text-xs text-green-600 mt-1">
                Your request has been received. We will process within 3 weeks.
              </p>
            </div>
          )}

        {/* Pickup Deadline warning */}
        {caseData.pickup_deadline &&
          caseData.internal_status === "AWAITING_PICKUP" &&
          !caseData.customer_requested_at &&
          !requested && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm font-medium text-orange-800 flex items-center gap-2">
                <Clock className="size-4" />
                သတ်မှတ်ရက် / Deadline
              </p>
              <p className="text-sm text-orange-700 mt-0.5">
                {caseData.pickup_deadline} မတိုင်မီ တောင်းဆိုရပါမည်။
              </p>
              <p className="text-xs text-orange-600 mt-0.5">
                Please request before {caseData.pickup_deadline}.
              </p>
            </div>
          )}

        {/* Public Documents */}
        {caseData.public_documents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText className="size-4" />
              သင်၏စာရွက်စာတမ်းများ / Your Documents ({caseData.public_documents.length})
            </p>
            <div className="space-y-2">
              {caseData.public_documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-red-600 text-xs font-bold">
                      {doc.mime_type === "application/pdf" ? "PDF" : "IMG"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {doc.original_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(doc.file_size_bytes)}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDownload(doc)}
                    size="sm"
                    className="shrink-0 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Download className="size-3 mr-1" />
                    ဒေါင်းလုပ်
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pb-6 space-y-1">
          <p className="font-medium">SRP Visa & Work Permit Services</p>
          <p>ဤစာမျက်နှာသည် ကိုယ်ပိုင်ဆိုင်ရာသာဖြစ်ပါသည်</p>
          <p>လင့်ခ်ကို မျှဝေခြင်းမပြုရ</p>
          <p className="text-slate-300 mt-2">
            This page is private. Do not share this link.
          </p>
        </div>
      </div>
    </div>
  )
}

// Public status badge component
function PublicStatusBadge({ status }: { status: string }) {
  const getConfig = () => {
    switch (status) {
      case "RECEIVE":
      case "CHECKING":
        return {
          label: "စစ်ဆေးနေဆဲ",
          labelEn: "Reviewing",
          color: "bg-blue-100 text-blue-700",
        }
      case "SUBMITTED":
      case "WORKING":
        return {
          label: "ဆောင်ရွက်နေဆဲ",
          labelEn: "Processing",
          color: "bg-orange-100 text-orange-700",
        }
      case "DONE":
      case "PUBLISH":
        return {
          label: "ပြီးစီးပြီ",
          labelEn: "Completed",
          color: "bg-green-100 text-green-700",
        }
      case "AWAITING_PICKUP":
        return {
          label: "ထုတ်ယူရန်ကျန်",
          labelEn: "Ready for Pickup",
          color: "bg-amber-100 text-amber-700",
        }
      case "DELIVERY":
        return {
          label: "ပို့ဆောင်နေဆဲ",
          labelEn: "Out for Delivery",
          color: "bg-cyan-100 text-cyan-700",
        }
      case "CLOSED":
        return {
          label: "ပြီးဆုံးပြီ",
          labelEn: "Closed",
          color: "bg-slate-100 text-slate-700",
        }
      default:
        return {
          label: "မသိ",
          labelEn: "Unknown",
          color: "bg-slate-100 text-slate-700",
        }
    }
  }

  const config = getConfig()

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
        config.color
      )}
    >
      {config.label}
      <span className="text-xs opacity-70">({config.labelEn})</span>
    </span>
  )
}
