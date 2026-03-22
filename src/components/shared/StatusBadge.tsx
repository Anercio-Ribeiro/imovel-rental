// src/components/shared/StatusBadge.tsx
import { cn } from "@/lib/utils";
import {
  CheckCircle2, XCircle, Clock, Ban, Eye, EyeOff,
  CheckCircle, AlertCircle,
} from "lucide-react";

type StatusType =
  | "active" | "inactive" | "pending" | "sold" | "rented"
  | "approved" | "rejected" | "cancelled" | "completed"
  | "owner" | "tenant" | "admin";

const STATUS_CONFIG: Record<StatusType, { label: string; labelEn: string; className: string; Icon: React.ElementType }> = {
  active:    { label: "Activo",     labelEn: "Active",    className: "badge-active",    Icon: CheckCircle2 },
  inactive:  { label: "Inactivo",   labelEn: "Inactive",  className: "badge-inactive",  Icon: EyeOff },
  pending:   { label: "Pendente",   labelEn: "Pending",   className: "badge-pending",   Icon: Clock },
  sold:      { label: "Vendido",    labelEn: "Sold",      className: "badge-approved",  Icon: CheckCircle },
  rented:    { label: "Arrendado",  labelEn: "Rented",    className: "badge-approved",  Icon: CheckCircle },
  approved:  { label: "Aprovado",   labelEn: "Approved",  className: "badge-approved",  Icon: CheckCircle2 },
  rejected:  { label: "Rejeitado",  labelEn: "Rejected",  className: "badge-rejected",  Icon: XCircle },
  cancelled: { label: "Cancelado",  labelEn: "Cancelled", className: "badge-cancelled", Icon: Ban },
  completed: { label: "Concluído",  labelEn: "Completed", className: "badge-active",    Icon: CheckCircle2 },
  owner:     { label: "Proprietário", labelEn: "Owner",   className: "badge-approved",  Icon: AlertCircle },
  tenant:    { label: "Inquilino",  labelEn: "Tenant",    className: "badge-active",    Icon: AlertCircle },
  admin:     { label: "Admin",      labelEn: "Admin",     className: "badge-pending",   Icon: AlertCircle },
};

interface Props {
  status: StatusType;
  locale?: "pt" | "en";
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, locale = "pt", showIcon = true, className }: Props) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  const { Icon } = config;
  const label = locale === "en" ? config.labelEn : config.label;

  return (
    <span className={cn("badge", config.className, className)}>
      {showIcon && <Icon className="w-3 h-3" />}
      {label}
    </span>
  );
}
