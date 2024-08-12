// C:\next-js-project\hr-dashboard\frontend\app\admin\karyawan\api.ts

import { Karyawan } from "./page";

export async function fetchKaryawan(token: string): Promise<Karyawan[]> {
  const response = await fetch(
    "https://hr-dashboard-app-project.et.r.appspot.com/api/karyawan",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch karyawan data");
  }
  return response.json();
}

export async function saveKaryawan(
  token: string,
  karyawan: Karyawan,
  isEdit: boolean
): Promise<Karyawan> {
  const formData = new FormData();
  (Object.keys(karyawan) as Array<keyof Karyawan>).forEach((key) => {
    if (key !== "karyawanId" && karyawan[key] !== undefined) {
      if (karyawan[key] instanceof File) {
        formData.append(key, karyawan[key] as File);
      } else if (karyawan[key] instanceof Date) {
        formData.append(key, (karyawan[key] as Date).toISOString());
      } else {
        formData.append(key, String(karyawan[key]));
      }
    }
  });

  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/karyawan${
      isEdit ? `/${karyawan.karyawanId}` : ""
    }`,
    {
      method: isEdit ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save karyawan");
  }

  return response.json();
}

export async function deleteKaryawan(
  token: string,
  karyawanId: string
): Promise<void> {
  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/karyawan/${karyawanId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete karyawan");
  }
}
