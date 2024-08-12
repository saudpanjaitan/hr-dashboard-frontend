import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Are you sure?
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          This action cannot be undone. This will permanently delete the user.
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
