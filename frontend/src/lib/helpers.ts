// src/lib/helpers.ts
import DateObject from 'react-date-object';

/* ---------- Members (Users) ---------- */

export type MemberServer = {
  id: string;
  full_name: string;
  phone_number: string | null;
  birthdate: string | null;
  health_conditions: string | null;
  fitness_goals: string | null;
};

export type MemberUI = {
  id?: string;
  name: string;
  lastName: string;
  phone: string;
  birthDate: string | Date | null;
  medicalCondition: string;
  sportGoal: string;
};

// تبدیل ارقام فارسی/عربی به انگلیسی
const fa2en = (s: string) =>
  (s || '')
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

const toNull = (s?: string) => (s && s.trim() ? s : null);

/** از بک به فرانت (برای نمایش) */
export function fromServer(m: MemberServer): MemberUI {
  const parts = (m.full_name || '').trim().split(/\s+/);
  return {
    id: m.id,
    name: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    phone: m.phone_number || '',
    birthDate: m.birthdate || null,
    medicalCondition: m.health_conditions || '',
    sportGoal: m.fitness_goals || '',
  };
}

/** از فرانت به بک (برای POST/PUT) */
export function toServer(f: Partial<MemberUI>): Partial<MemberServer> {
  const full_name = `${(f.name || '').trim()} ${(f.lastName || '').trim()}`.trim();
  return {
    full_name,
    phone_number: fa2en((f.phone || '').trim()),
    birthdate: f.birthDate
      ? new DateObject(f.birthDate).format('YYYY-MM-DD')
      : null,
    health_conditions: toNull(f.medicalCondition),
    fitness_goals: toNull(f.sportGoal),
  };
}

/* ---------- Purchases (PaymentStatus) ---------- */

export type PurchaseServer = {
  id: string;
  member_id: string;
  plan_id: string;
  session_count: number;
  amount: number;
  payment_method: string | null;
  paid_at: string | null;  // ISO یا تاریخ ساده
  status: string | null;
};

export type PurchaseUI = {
  id: string;
  memberId: string;
  memberName: string; // برای نمایش
  planId: string;
  planName: string;   // برای نمایش
  sessions: number;
  amount: number;
  method: string;
  status: string;
  paidAt?: string | null;
};

type IdName = { id: string; name: string };
type MemberLite = { id: string; name: string; lastName: string };

const toNameMap = (items: Array<IdName | MemberLite> = []) =>
  Object.fromEntries(
    items.map((x: any) => [
      x.id,
      x.lastName ? `${x.name} ${x.lastName}` : (x.name || ''),
    ])
  );

/** از بک به UI برای پرداخت‌ها */
export function purchaseFromServer(
  p: PurchaseServer,
  members: MemberLite[] = [],
  plans: IdName[] = []
): PurchaseUI {
  const memberMap = toNameMap(members);
  const planMap = toNameMap(plans);

  return {
    id: p.id,
    memberId: p.member_id,
    memberName: memberMap[p.member_id] || p.member_id,
    planId: p.plan_id,
    planName: planMap[p.plan_id] || p.plan_id,
    sessions: Number(p.session_count ?? 0),
    amount: Number(p.amount ?? 0),
    method: p.payment_method ?? '',
    status: p.status ?? '',
    paidAt: p.paid_at ?? null,
  };
}

/* ---------- Utilities you wanted exported ---------- */

// فقط تاریخ (YYYY-MM-DD)
export const toYMD = (jsDate: Date): string => {
  const y = jsDate.getFullYear();
  const m = String(jsDate.getMonth() + 1).padStart(2, '0');
  const d = String(jsDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// نگاشت روش پرداخت UI → enum بک
export const METHOD_MAP = { 'نقدی': 'CASH', 'کارتخوان': 'CARD' } as const;
