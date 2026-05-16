// Helpers for building coordinator status-change email payloads.
// Used when invoking the `send-transactional-email` edge function.

export type CoordinatorEmailStatus = "approved" | "rejected" | "pending";

export interface CoordinatorRowLike {
  id: string;
  full_name: string;
  email?: string | null;
  member_code?: string | null;
  role_level?: string | null;
  approval_status?: string | null;
}

/** App origin — works in browser and falls back to production URL. */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://merepahal.org";
}

/**
 * Resolve the most useful in-app destination for the coordinator,
 * based on their new status and role level.
 */
export function resolveCoordinatorDashboardUrl(
  status: CoordinatorEmailStatus,
  roleLevel?: string | null,
  baseUrl: string = getAppBaseUrl(),
): string {
  const base = baseUrl.replace(/\/+$/, "");
  const role = (roleLevel ?? "").toLowerCase();

  if (status === "rejected") return `${base}/contact`;
  if (status === "pending") return `${base}/dashboard`;

  // approved
  if (role === "admin" || role === "national") {
    return `${base}/dashboard/admin/coordinators`;
  }
  if (role) {
    return `${base}/dashboard/coordinator?role=${encodeURIComponent(role)}`;
  }
  return `${base}/dashboard/coordinator`;
}

/**
 * Build the templateData payload for the
 * `coordinator-status-changed` transactional email template.
 */
export function buildCoordinatorStatusEmailData(
  coordinator: CoordinatorRowLike,
  newStatus: CoordinatorEmailStatus,
  baseUrl: string = getAppBaseUrl(),
) {
  return {
    name: coordinator.full_name,
    status: newStatus,
    memberCode: coordinator.member_code ?? null,
    roleLevel: coordinator.role_level ?? undefined,
    appBaseUrl: baseUrl,
    dashboardUrl: resolveCoordinatorDashboardUrl(
      newStatus,
      coordinator.role_level,
      baseUrl,
    ),
  };
}

/** Stable idempotency key — safe to retry without sending duplicates. */
export function coordinatorStatusEmailKey(
  coordinatorId: string,
  newStatus: CoordinatorEmailStatus,
) {
  return `coord-status-${coordinatorId}-${newStatus}`;
}
