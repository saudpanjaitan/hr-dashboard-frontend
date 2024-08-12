// C:\next-js-project\hr-dashboard\frontend\components\ui\sheet-employee-self-service.tsx

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ESS } from "@/app/admin/employee-self-service/page";

interface SheetEmployeeSelfServiceProps {
  open: boolean;
  ess: ESS | null;
  onSave: (data: ESS) => void;
  onClose: () => void;
  isViewOnly?: boolean;
}

export function SheetEmployeeSelfService({
  open,
  ess,
  onSave,
  onClose,
  isViewOnly = false,
}: SheetEmployeeSelfServiceProps) {
  const [formData, setFormData] = useState<ESS>({
    essId: "",
    nama_dokumen: "",
    lampiran: "",
    create_at: new Date(),
  });

  useEffect(() => {
    if (ess) {
      setFormData(ess);
    } else {
      setFormData({
        essId: "",
        nama_dokumen: "",
        lampiran: "",
        create_at: new Date(),
      });
    }
  }, [ess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, files } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderField = (
    label: string,
    value: any,
    id: string,
    type: string = "text"
  ) => (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor={id} className="text-right font-semibold">
        {label}
      </Label>
      <div className="col-span-3">
        {isViewOnly ? (
          type === "file" ? (
            typeof value === "string" && value ? (
              <Button
                onClick={() => window.open(value, "_blank")}
                variant="outline"
                size="sm"
              >
                View File
              </Button>
            ) : (
              "No file uploaded"
            )
          ) : type === "date" ? (
            formatDate(value)
          ) : (
            String(value)
          )
        ) : (
          <Input
            id={id}
            type={type}
            onChange={handleChange}
            className="w-full"
            disabled={isViewOnly}
            value={type !== "file" ? value : undefined}
          />
        )}
      </div>
    </div>
  );

  // ... (kode sebelumnya tetap sama)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out"
      >
        <SheetHeader>
          <SheetTitle>
            {isViewOnly
              ? `View ESS: ${formData.nama_dokumen}`
              : ess
              ? `Edit ESS: ${formData.nama_dokumen}`
              : "Add New ESS"}
          </SheetTitle>
          <SheetDescription>
            {isViewOnly
              ? "ESS details"
              : `Fill out the form below to ${
                  ess ? "edit the" : "add a new"
                } ESS record.`}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {renderField("Nama Dokumen", formData.nama_dokumen, "nama_dokumen")}
          {renderField("Lampiran", formData.lampiran, "lampiran", "file")}
          {isViewOnly &&
            renderField("Created At", formData.create_at, "create_at", "date")}
        </div>
        <SheetFooter>
          {!isViewOnly && (
            <SheetClose asChild>
              <Button type="submit" onClick={handleSave}>
                Save changes
              </Button>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  // ... (kode setelahnya tetap sama)
}
