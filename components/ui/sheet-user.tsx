import { useEffect, useState } from "react";
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
import { User } from "@/app/admin/users/page"; // Mengimpor tipe User dari page.tsx, sesuaikan dengan path sebenarnya

interface SheetUserProps {
  open: boolean;
  user: User | null;
  onSave: (data: User) => void;
  onClose: () => void;
}

export function SheetUser({ open, user, onSave, onClose }: SheetUserProps) {
  const [formData, setFormData] = useState<User>({
    userId: "",
    username: "",
    email: "",
    role: { roleName: "" },
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        userId: "",
        username: "",
        email: "",
        role: { roleName: "" },
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: User) => ({ ...prev, [id]: value }));
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
          <SheetTitle>{user ? "Edit User" : "Add New User"}</SheetTitle>
          <SheetDescription>
            Fill out the form below to {user ? "edit the" : "add a new"} user.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              value={formData.role.roleName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
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
