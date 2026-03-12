"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateCaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const serviceTypes = [
  { value: "KS", label: "Kyant Sal", slaDays: 14 },
  { value: "WP", label: "Work Permit", slaDays: 21 },
  { value: "VS", label: "Visa Extension", slaDays: 7 },
  { value: "TR", label: "Travel Document", slaDays: 10 },
]

export function CreateCaseModal({ open, onOpenChange, onSuccess }: CreateCaseModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerType: "INDIVIDUAL",
    customerName: "",
    phone: "",
    email: "",
    serviceType: "",
    notes: "",
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    onSuccess?.()
    onOpenChange(false)
    // Reset form
    setStep(1)
    setFormData({
      customerType: "INDIVIDUAL",
      customerName: "",
      phone: "",
      email: "",
      serviceType: "",
      notes: "",
    })
  }

  const selectedService = serviceTypes.find((s) => s.value === formData.serviceType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Enter customer information" : "Select service type"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              step >= 1 ? "bg-indigo-600" : "bg-muted"
            )}
          />
          <div
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              step >= 2 ? "bg-indigo-600" : "bg-muted"
            )}
          />
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            {/* Customer Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Customer Type
              </label>
              <RadioGroup
                value={formData.customerType}
                onValueChange={(value) =>
                  setFormData({ ...formData, customerType: value })
                }
                className="grid grid-cols-2 gap-3"
              >
                <label
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                    formData.customerType === "INDIVIDUAL"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="INDIVIDUAL" className="sr-only" />
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Individual</p>
                    <p className="text-xs text-muted-foreground">Single person</p>
                  </div>
                </label>
                <label
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                    formData.customerType === "COLLECTIVE"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="COLLECTIVE" className="sr-only" />
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Collective</p>
                    <p className="text-xs text-muted-foreground">Company/Group</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {formData.customerType === "INDIVIDUAL" ? "Full Name" : "Company Name"}
              </label>
              <Input
                placeholder={
                  formData.customerType === "INDIVIDUAL"
                    ? "Enter full name"
                    : "Enter company name"
                }
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+66 XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Service Type
              </label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {service.slaDays}d SLA
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedService && (
                <p className="text-xs text-muted-foreground">
                  SLA: {selectedService.slaDays} working days
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Notes (Optional)
              </label>
              <Textarea
                placeholder="Any additional information about this case..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Case Summary
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Customer:</span>{" "}
                  <span className="font-medium">{formData.customerName || "—"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span className="font-medium">{formData.customerType}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Service:</span>{" "}
                  <span className="font-medium">
                    {selectedService?.label || "—"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === 2 && (
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setStep(2)}
              disabled={!formData.customerName || !formData.phone}
            >
              Continue
            </Button>
          ) : (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSubmit}
              disabled={!formData.serviceType || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Case"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
