"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import DeleteConfirmation from "@/components/ui/delete-confirmation";
import { SuccessAlertDialog } from "@/components/ui/success-alert-dialog";
import { ErrorAlertDialog } from "@/components/ui/error-alert-dialog";
import { PlusCircle } from "lucide-react";
import { fetchKaryawan, saveKaryawan, deleteKaryawan } from "./api";
import { SheetKaryawan } from "@/components/ui/sheet-karyawan";

export type Karyawan = {
  karyawanId: string;
  nama_karyawan: string;
  alamat: string;
  no_telfon: number;
  gender: string;
  tanggal_join: Date;
  habis_kontrak: Date;
  unit: string;
  ktp: string | File;
  kartu_keluarga: string | File;
  pass_foto: string | File;
  bpjs: string | File;
  ijazah: string | File;
  offering_letter: string | File;
  kontrak_kerja: string | File;
  sp: string | File;
  create_at: Date;
};

export default function KaryawanPage() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null);
  const [viewingKaryawan, setViewingKaryawan] = useState<Karyawan | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [deletingKaryawanId, setDeletingKaryawanId] = useState<string | null>(
    null
  );
  const [successDialog, setSuccessDialog] = useState<{
    message: string;
    show: boolean;
  }>({
    message: "",
    show: false,
  });
  const [errorDialog, setErrorDialog] = useState<{
    message: string;
    show: boolean;
  }>({
    message: "",
    show: false,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const karyawanData = await fetchKaryawan(token);
        setData(karyawanData);
      } catch (error) {
        setError("Failed to fetch karyawan data");
      }
    };

    fetchData();
  }, [router]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleSave = async (newData: Karyawan) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const updatedKaryawan = await saveKaryawan(
        token,
        newData,
        !!editingKaryawan
      );
      setData((prev) =>
        editingKaryawan
          ? prev.map((k) =>
              k.karyawanId === updatedKaryawan.karyawanId ? updatedKaryawan : k
            )
          : [...prev, updatedKaryawan]
      );
      setEditingKaryawan(null);
      setIsSheetOpen(false);
      setSuccessDialog({
        message: "Karyawan data saved successfully",
        show: true,
      });
    } catch (error: any) {
      setErrorDialog({ message: error.message, show: true });
    }
  };

  const handleEdit = (karyawan: Karyawan) => {
    setEditingKaryawan(karyawan);
    setIsSheetOpen(true);
  };

  const handleView = (karyawan: Karyawan) => {
    setViewingKaryawan(karyawan);
    setIsViewSheetOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingKaryawanId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      await deleteKaryawan(token, deletingKaryawanId);
      setData((prev) =>
        prev.filter((k) => k.karyawanId !== deletingKaryawanId)
      );
      setIsDeleteConfirmOpen(false);
      setSuccessDialog({
        message: "Karyawan data deleted successfully",
        show: true,
      });
    } catch (error: any) {
      setError(error.message);
      setErrorDialog({ message: error.message, show: true });
    }
  };

  const columns: ColumnDef<Karyawan>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nama_karyawan",
      header: "Nama Karyawan",
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "tanggal_join",
      header: "Tanggal Join",
      cell: ({ row }) => {
        const date = new Date(row.getValue("tanggal_join"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "habis_kontrak",
      header: "Habis Kontrak",
      cell: ({ row }) => {
        const date = new Date(row.getValue("habis_kontrak"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const karyawan = row.original;

        return (
          <div className="flex justify-end space-x-2">
            <Button
              className="h-8 gap-1"
              size="sm"
              onClick={() => handleView(karyawan)}
            >
              View
            </Button>
            <Button
              className="h-8 gap-1"
              size="sm"
              onClick={() => handleEdit(karyawan)}
            >
              Edit
            </Button>
            <Button
              className="h-8 gap-1"
              size="sm"
              onClick={() => {
                setDeletingKaryawanId(karyawan.karyawanId);
                setIsDeleteConfirmOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Data Karyawan</h1>
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={() => {
            setEditingKaryawan(null);
            setIsSheetOpen(true);
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Karyawan
          </span>
        </Button>
      </div>

      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Nama Karyawan..."
            value={
              (table.getColumn("nama_karyawan")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("nama_karyawan")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <SheetKaryawan
        open={isSheetOpen}
        karyawan={editingKaryawan}
        onSave={handleSave}
        onClose={() => setIsSheetOpen(false)}
      />
      <SheetKaryawan
        open={isViewSheetOpen}
        karyawan={viewingKaryawan}
        onSave={() => {}}
        onClose={() => setIsViewSheetOpen(false)}
        isViewOnly={true}
      />
      {isDeleteConfirmOpen && (
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
      {successDialog.show && (
        <SuccessAlertDialog
          message={successDialog.message}
          onClose={() => {
            setSuccessDialog({ message: "", show: false });
            window.location.reload();
          }}
        />
      )}
      {errorDialog.show && (
        <ErrorAlertDialog
          message={errorDialog.message}
          onClose={() => {
            setErrorDialog({ message: "", show: false });
            window.location.reload();
          }}
        />
      )}
    </main>
  );
}
