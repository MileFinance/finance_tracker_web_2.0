"use client";

import { useAuthContext } from "@/app/context/authContext";

export function useAuth() {
  return useAuthContext();
}
