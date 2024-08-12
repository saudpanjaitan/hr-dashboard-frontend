import { Hiring } from "./page";

export async function fetchHiring(token: string): Promise<Hiring[]> {
  const response = await fetch(
    "https://hr-dashboard-app-project.et.r.appspot.com/api/hiring",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch hiring data");
  }
  return response.json();
}

export async function saveHiring(
  token: string,
  hiring: Hiring,
  isEdit: boolean
): Promise<Hiring> {
  const formData = new FormData();
  (Object.keys(hiring) as Array<keyof Hiring>).forEach((key) => {
    if (key !== "hiringId" && hiring[key] !== undefined) {
      if (key === "lampiran_cv" && hiring[key] instanceof File) {
        formData.append(key, hiring[key] as File);
      } else if (hiring[key] instanceof Date) {
        formData.append(key, (hiring[key] as Date).toISOString());
      } else {
        formData.append(key, String(hiring[key]));
      }
    }
  });

  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/hiring${
      isEdit ? `/${hiring.hiringId}` : ""
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
    throw new Error(errorData.message || "Failed to save hiring");
  }

  return response.json();
}

export async function deleteHiring(
  token: string,
  hiringId: string
): Promise<void> {
  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/hiring/${hiringId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete hiring");
  }
}
