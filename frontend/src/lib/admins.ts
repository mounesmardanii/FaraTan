// src/lib/admins.ts
import { api } from "./api";

export const adminsApi = {
  memberGrowth: () => api("/api/v1/admins/member-growth"),
  revenueThisMonth: () => api("/api/v1/admins/revenue-this-month"),
  activeMembersCount: () => api("/api/v1/admins/active-members-count"),
};
