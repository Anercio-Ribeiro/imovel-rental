"use client";
// ============================================================
// src/components/properties/BookingModal.tsx
// ============================================================
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useI18n, formatPrice } from "@/i18n";
import { useCreateBooking } from "@/hooks/useProperties";
import { toast } from "sonner";
import { CalendarDays, MessageSquare, X, Loader2 } from "lucide-react";
import { cn, calculateNights } from "@/lib/utils";
import type { Property } from "@/types";

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t, locale } = useI18n();
  const createBooking = useCreateBooking();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const nights = startDate && endDate ? calculateNights(startDate, endDate) : 0;
  const pricePerDay = property.priceUnit === "month" ? property.price / 30 : property.price;
  const totalPrice = nights > 0 ? pricePerDay * nights : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error(t.booking.loginRequired);
      router.push("/login");
      return;
    }
    if (!startDate || !endDate || nights <= 0) {
      toast.error("Seleccione datas válidas");
      return;
    }
    try {
      await createBooking.mutateAsync({
        propertyId: property.id,
        startDate,
        endDate,
        message: message || undefined,
      });
      toast.success(t.booking.success);
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t.common.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-card border border-gold-500/20 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gold-500/10">
          <div>
            <h2 className="font-display text-lg font-semibold">{t.booking.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{property.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-dark-surface flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Dates — modern calendar inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {t.booking.checkIn}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {t.booking.checkOut}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          {/* Price summary */}
          {nights > 0 && (
            <div className="bg-gold-500/8 border border-gold-500/20 rounded-xl p-4 text-sm">
              <div className="flex justify-between mb-2 text-muted-foreground">
                <span>{formatPrice(pricePerDay, locale)} × {nights} {t.booking.nights}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-gold-500/20 pt-2 mt-2">
                <span>{t.booking.totalPrice}</span>
                <span className="text-gold-500 font-display">{formatPrice(totalPrice, locale)}</span>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              {t.booking.message}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.booking.messagePlaceholder}
              rows={3}
              className="input-base resize-none"
            />
          </div>

          {/* Submit */}
          {!session?.user ? (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {t.booking.loginRequired}
            </button>
          ) : (
            <button
              type="submit"
              disabled={createBooking.isPending || nights <= 0}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {createBooking.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> A enviar...</>
              ) : (
                <><CalendarDays className="w-4 h-4" /> {t.booking.confirm}</>
              )}
            </button>
          )}
          <p className="text-xs text-center text-muted-foreground">
            Não será cobrado agora. O proprietário irá aprovar o pedido.
          </p>
        </form>
      </div>
    </div>
  );
}
