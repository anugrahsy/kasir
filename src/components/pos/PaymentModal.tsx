"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Banknote,
  FileText,
  CheckCircle2,
  QrCode,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (paymentMethod: string) => void;
  total: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onComplete,
  total,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: Banknote },
    { id: "card", label: "Credit/Debit Card", icon: CreditCard },
    { id: "lankapay", label: "Lanka Pay (QR)", icon: QrCode },
    { id: "cheque", label: "Cheque", icon: FileText },
  ];

  const handlePayment = () => {
    if (!selectedMethod) return;

    if (selectedMethod === "lankapay") {
      setShowQR(true);
      return;
    }

    processPayment();
  };

  const processPayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      setTimeout(() => {
        onComplete(selectedMethod!);
        resetModal();
      }, 1500);
    }, 2000);
  };

  const resetModal = () => {
    setIsComplete(false);
    setSelectedMethod(null);
    setShowQR(false);
  };

  const handleClose = () => {
    if (!isProcessing && !isComplete) {
      resetModal();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Complete your order by selecting a payment method
          </DialogDescription>
        </DialogHeader>

        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="mb-2">Payment Successful!</h3>
            <p className="text-gray-500">Order has been placed</p>
          </div>
        ) : showQR ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="mb-2">Scan QR Code to Pay</h3>
              <p className="text-gray-500 mb-4">Lanka Pay Mobile Payment</p>

              {/* Mock QR Code */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 inline-block mb-4">
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">QR Code</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-lg mb-4">
                <p>Amount to Pay</p>
                <p className="text-2xl">Rs. {total.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowQR(false)}
                disabled={isProcessing}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={processPayment}
                disabled={isProcessing}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {isProcessing ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-orange-500">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <p className="mb-3 text-gray-600">Select Payment Method</p>
              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span>{method.label}</span>
                      {method.id === "lankapay" && (
                        <span className="ml-auto text-sm text-gray-500">
                          Scan QR
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {isProcessing
                  ? "Processing..."
                  : selectedMethod === "lankapay"
                    ? "Show QR Code"
                    : "Confirm Payment"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
