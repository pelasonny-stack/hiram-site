export type EventKind = "payment" | "signup" | "churn_signal" | "fraud_probe";
export type ActionKind = "charge" | "route_retention" | "route_fraud" | "notify";

export interface SyntheticEvent {
  id: number;
  kind: EventKind;
  action: ActionKind;
  startedAt: number;
}

export const KIND_COLOR: Record<EventKind, string> = {
  payment: "var(--accent)",
  signup: "var(--info)",
  churn_signal: "var(--warning)",
  fraud_probe: "var(--danger)",
};

export function decide(kind: EventKind): ActionKind {
  switch (kind) {
    case "payment":
      return "charge";
    case "signup":
      return "notify";
    case "churn_signal":
      return "route_retention";
    case "fraud_probe":
      return Math.random() > 0.3 ? "route_fraud" : "notify";
  }
}

export function pickRandomKind(kinds: readonly EventKind[]): EventKind {
  return kinds[Math.floor(Math.random() * kinds.length)]!;
}
