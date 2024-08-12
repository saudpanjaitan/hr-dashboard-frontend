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
import { SheetEmployeeSelfService } from "@/components/ui/sheet-employee-self-service";
import DeleteConfirmation from "@/components/ui/delete-confirmation";
import { SuccessAlertDialog } from "@/components/ui/success-alert-dialog";
import { ErrorAlertDialog } from "@/components/ui/error-alert-dialog";
import { PlusCircle } from "lucide-react";
import { fetchESS, saveESS, deleteESS } from "./api";

export type ESS = {
  essId: string;
  nama_dokumen: string;
  lampiran: string | File;
  create_at: Date;
};

export default function EmployeeSelfService() {
  const [data, setData] = useState<ESS[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingESS, setEditingESS] = useState<ESS | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [deletingEssId, setDeletingEssId] = useState<string | null>(null);
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
        const essData = await fetchESS(token);
        setData(essData);
      } catch (error) {
        setError("Failed to fetch ESS data");
      }
    };

    fetchData();
  }, [router]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleSave = async (newData: ESS) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const updatedESS = await saveESS(token, newData, !!editingESS);
      setData((prev) =>
        editingESS
          ? prev.map((e) => (e.essId === updatedESS.essId ? updatedESS : e))
          : [...prev, updatedESS]
      );
      setEditingESS(null);
      setIsSheetOpen(false);
      setSuccessDialog({ message: "ESS data saved successfully", show: true });
    } catch (error: any) {
      setErrorDialog({ message: error.message, show: true });
    }
  };

  const handleEdit = (ess: ESS) => {
    setEditingESS(ess);
    setIsSheetOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingEssId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      await deleteESS(token, deletingEssId);
      setData((prev) => prev.filter((e) => e.essId !== deletingEssId));
      setIsDeleteConfirmOpen(false);
      setSuccessDialog({
        message: "ESS data deleted successfully",
        show: true,
      });
    } catch (error: any) {
      setError(error.message);
      setErrorDialog({ message: error.message, show: true });
    }
  };

  const columns: ColumnDef<ESS>[] = [
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
      accessorKey: "nama_dokumen",
      header: "Nama Dokumen",
    },
    {
      accessorKey: "create_at",
      header: "Tanggal Dibuat",
      cell: ({ row }) => {
        const date = new Date(row.getValue("create_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "lampiran",
      header: "Lampiran",
      cell: ({ row }) => (
        <a
          href={row.getValue("lampiran")}
          target="_blank"
          rel="noopener noreferrer"
        >
          View File
        </a>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const ess = row.original;

        return (
          <div className="flex justify-end space-x-2">
            <Button
              className="h-8 gap-1"
              size="sm"
              onClick={() => handleEdit(ess)}
            >
              Edit
            </Button>
            <Button
              className="h-8 gap-1"
              size="sm"
              onClick={() => {
                setDeletingEssId(ess.essId);
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
        <h1 className="text-lg font-semibold md:text-2xl">
          Employee Self Service
        </h1>
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={() => {
            setEditingESS(null);
            setIsSheetOpen(true);
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Data
          </span>
        </Button>
        <SheetEmployeeSelfService
          open={isSheetOpen}
          ess={editingESS}
          onSave={handleSave}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>

      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Nama Dokumen..."
            value={
              (table.getColumn("nama_dokumen")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("nama_dokumen")
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
