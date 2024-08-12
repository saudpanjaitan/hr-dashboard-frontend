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
import { Karyawan } from "@/app/admin/karyawan/page";

interface SheetKaryawanProps {
  open: boolean;
  karyawan: Karyawan | null;
  onSave: (data: Karyawan) => void;
  onClose: () => void;
  isViewOnly?: boolean;
}

export function SheetKaryawan({
  open,
  karyawan,
  onSave,
  onClose,
  isViewOnly = false,
}: SheetKaryawanProps) {
  const [formData, setFormData] = useState<Karyawan>({
    karyawanId: "",
    nama_karyawan: "",
    alamat: "",
    no_telfon: 0,
    gender: "",
    tanggal_join: new Date(),
    habis_kontrak: new Date(),
    unit: "",
    ktp: "",
    kartu_keluarga: "",
    pass_foto: "",
    bpjs: "",
    ijazah: "",
    offering_letter: "",
    kontrak_kerja: "",
    sp: "",
    create_at: new Date(),
  });

  useEffect(() => {
    if (karyawan) {
      setFormData(karyawan);
    }
  }, [karyawan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, files } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else if (type === "date") {
      setFormData((prev) => ({ ...prev, [id]: new Date(value) }));
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
      <Label htmlFor={id} className="text-left font-semibold">
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
            value={
              type !== "file"
                ? type === "date" && value instanceof Date
                  ? value.toISOString().split("T")[0]
                  : value
                : undefined
            }
          />
        )}
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out w-full sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle>
            {isViewOnly
              ? `View Karyawan: ${formData.nama_karyawan}`
              : karyawan
              ? `Edit Karyawan: ${formData.nama_karyawan}`
              : "Add New Karyawan"}
          </SheetTitle>
          <SheetDescription>
            {isViewOnly
              ? "Karyawan details"
              : `Fill out the form below to ${
                  karyawan ? "edit the" : "add a new"
                } karyawan.`}
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="grid gap-4 py-4">
            {renderField(
              "Nama Karyawan",
              formData.nama_karyawan,
              "nama_karyawan"
            )}
            {renderField("Alamat", formData.alamat, "alamat")}
            {renderField(
              "No. Telepon",
              formData.no_telfon,
              "no_telfon",
              "number"
            )}
            {renderField("Gender", formData.gender, "gender")}
            {renderField(
              "Tanggal Join",
              formData.tanggal_join,
              "tanggal_join",
              "date"
            )}
            {renderField(
              "Habis Kontrak",
              formData.habis_kontrak,
              "habis_kontrak",
              "date"
            )}
            {renderField("Unit", formData.unit, "unit")}
            {renderField("KTP", formData.ktp, "ktp", "file")}
            {renderField(
              "Kartu Keluarga",
              formData.kartu_keluarga,
              "kartu_keluarga",
              "file"
            )}
            {renderField("Pass Foto", formData.pass_foto, "pass_foto", "file")}
            {renderField("BPJS", formData.bpjs, "bpjs", "file")}
            {renderField("Ijazah", formData.ijazah, "ijazah", "file")}
            {renderField(
              "Offering Letter",
              formData.offering_letter,
              "offering_letter",
              "file"
            )}
            {renderField(
              "Kontrak Kerja",
              formData.kontrak_kerja,
              "kontrak_kerja",
              "file"
            )}
            {renderField("SP", formData.sp, "sp", "file")}
            {isViewOnly &&
              renderField(
                "Created At",
                formData.create_at,
                "create_at",
                "date"
              )}
          </div>
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
}
