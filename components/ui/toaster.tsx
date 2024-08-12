import { useEffect } from "react";

interface ToasterProps {
  message: string;
  type: "success" | "error";
  show: boolean;
  onClose: () => void;
}

export function Toaster({ message, type, show, onClose }: ToasterProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Toaster will disappear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded shadow-lg transition-all duration-300 transform ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
      role="alert"
    >
      {message}
    </div>
  );
}
