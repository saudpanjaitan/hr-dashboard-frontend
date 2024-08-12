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
import { Hiring } from "@/app/admin/hiring-tracking/page";

interface SheetHiringProps {
  open: boolean;
  hiring: Hiring | null;
  onSave: (data: Hiring) => void;
  onClose: () => void;
}

export function SheetHiring({
  open,
  hiring,
  onSave,
  onClose,
}: SheetHiringProps) {
  const [formData, setFormData] = useState<Hiring>({
    hiringId: "",
    nama_kandidat: "",
    posisi_yang_dilamar: "",
    tanggal_interview: new Date(),
    summary: "",
    hasil_interview: "",
    lampiran_cv: "",
  });

  useEffect(() => {
    if (hiring) {
      setFormData(hiring);
    } else {
      setFormData({
        hiringId: "",
        nama_kandidat: "",
        posisi_yang_dilamar: "",
        tanggal_interview: new Date(),
        summary: "",
        hasil_interview: "",
        lampiran_cv: "",
      });
    }
  }, [hiring]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setFormData((prev) => ({ ...prev, [id]: fileInput.files![0] }));
      }
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out"
      >
        <SheetHeader>
          <SheetTitle>{hiring ? "Edit Hiring" : "Add New Hiring"}</SheetTitle>
          <SheetDescription>
            Fill out the form below to {hiring ? "edit the" : "add a new"}{" "}
            hiring record.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama_kandidat" className="text-right">
              Nama Kandidat
            </Label>
            <Input
              id="nama_kandidat"
              value={formData.nama_kandidat}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="posisi_yang_dilamar" className="text-right">
              Posisi yang Dilamar
            </Label>
            <Input
              id="posisi_yang_dilamar"
              value={formData.posisi_yang_dilamar}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tanggal_interview" className="text-right">
              Tanggal Interview
            </Label>
            <Input
              id="tanggal_interview"
              type="date"
              value={
                formData.tanggal_interview instanceof Date
                  ? formData.tanggal_interview.toISOString().split("T")[0]
                  : formData.tanggal_interview
              }
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right">
              Summary
            </Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hasil_interview" className="text-right">
              Hasil Interview
            </Label>
            <Input
              id="hasil_interview"
              value={formData.hasil_interview}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lampiran_cv" className="text-right">
              Lampiran CV
            </Label>
            <Input
              id="lampiran_cv"
              type="file"
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSave}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
