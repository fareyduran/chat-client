import { User, UserApiResponse } from "@/types/user";

import { env } from './../../config/env';

export async function getOrCreateUser(name: string): Promise<User> {
  const response = await fetch(`${env.apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: name }),
  });

  if (!response.ok) {
    throw new Error("Failed to get or create user");
  }

  const json = (await response.json()) as UserApiResponse<User>;

  return json.data;
}