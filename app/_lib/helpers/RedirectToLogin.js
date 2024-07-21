import { useRouter, redirect } from "next/navigation";

export function RedirectToLogin() {
  const router = useRouter();

  router.push("/auth/login");
}
