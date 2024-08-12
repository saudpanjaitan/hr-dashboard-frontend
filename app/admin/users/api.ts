import { User } from "./page";

export async function fetchUsers(token: string): Promise<User[]> {
  const response = await fetch(
    "https://hr-dashboard-app-project.et.r.appspot.com/api/users",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

// api.ts
export async function saveUser(
  token: string,
  user: User,
  isEdit: boolean
): Promise<User> {
  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/users/${
      isEdit ? user.userId : ""
    }`,
    {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save user");
  }

  return response.json();
}

export async function deleteUser(token: string, userId: string): Promise<void> {
  const response = await fetch(
    `https://hr-dashboard-app-project.et.r.appspot.com/api/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
}

export function handleEdit(
  user: User,
  setEditingUser: (user: User | null) => void
) {
  setEditingUser(user);
}

export async function handleSave(
  newData: User,
  editingUser: User | null,
  setData: (data: (prev: User[]) => User[]) => void,
  setEditingUser: (user: User | null) => void,
  setError: (error: string) => void,
  router: any
) {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/auth");
    return;
  }

  try {
    const updatedUser = await saveUser(token, newData, !!editingUser);
    setData((prev: User[]) =>
      editingUser
        ? prev.map((u: User) =>
            u.userId === updatedUser.userId ? updatedUser : u
          )
        : [...prev, updatedUser]
    );
    setEditingUser(null);
  } catch (error) {
    setError("Failed to save user");
  }
}

export async function handleDelete(
  userId: string,
  setData: (data: (prev: User[]) => User[]) => void,
  setError: (error: string) => void,
  router: any
) {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/auth");
    return;
  }

  try {
    await deleteUser(token, userId);
    setData((prev: User[]) => prev.filter((u: User) => u.userId !== userId));
  } catch (error) {
    setError("Failed to delete user");
  }
}
