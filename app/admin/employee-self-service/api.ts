import { ESS } from "./page";

export async function fetchESS(token: string): Promise<ESS[]> {
  const response = await fetch(
    "https://hr-dashboard-app-project.et.r.appspot.com/api/ess",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch ESS data");
  }
  return response.json();
}

export async function saveESS(
  token: string,
  ess: ESS,
  isEdit: boolean
): Promise<ESS> {
  const formData = new FormData();
  formData.append("nama_dokumen", ess.nama_dokumen);
  if (ess.lampiran instanceof File) {
    formData.append("lampiran", ess.lampiran);
  }

  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/ess${
      isEdit ? `/${ess.essId}` : ""
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
    throw new Error(errorData.message || "Failed to save ESS");
  }

  return response.json();
}

export async function deleteESS(token: string, essId: string): Promise<void> {
  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/ess/${essId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete ESS");
  }
}
