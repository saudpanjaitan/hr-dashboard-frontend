import React, { useState } from "react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

interface DynamicSheetProps<T> {
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    value: string;
    type: string;
    options?: { value: string; label: string }[];
  }>;
  onSave: (data: T) => void;
}

export function DynamicSheet<T>({
  title,
  description,
  fields,
  onSave,
}: DynamicSheetProps<T>) {
  const [formData, setFormData] = useState<T>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.id]: field.value }),
      {}
    ) as T
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Data
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-left">
                {field.label}
              </Label>
              {field.type === "select" ? (
                <Select
                  value={(formData as any)[field.id]}
                  onValueChange={(value) => handleSelectChange(field.id, value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{field.label}</SelectLabel>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  value={(formData as any)[field.id]} // Cast to any to access dynamically
                  onChange={handleChange}
                  className="col-span-3"
                />
              )}
            </div>
          ))}
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
