import { GameButton } from "@/components/game/ui";

export type PendingTransaction = {
  mode: "buy" | "sell";
  itemName: string;
  quantity: number;
  unit: number;
  total: number;
  currencyShort: string;
};

export function ShopConfirmationModal({
  tx,
  onCancel,
  onConfirm,
}: {
  tx: PendingTransaction | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!tx) return null;
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80">
      <div className="panel-frame w-[360px] p-4">
        <h3 className="label-caps text-primary">
          {tx.mode === "buy" ? "Confirm Purchase" : "Confirm Sale"}
        </h3>
        <p className="mt-3 font-display text-sm tracking-wider text-foreground">{tx.itemName}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">Quantity: {tx.quantity}</p>
        <p className="mt-2 font-mono text-sm text-accent">
          {tx.unit.toLocaleString()} × {tx.quantity} = {tx.total.toLocaleString()} {tx.currencyShort}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <GameButton onClick={onCancel}>Cancel</GameButton>
          <GameButton variant="primary" onClick={onConfirm}>
            Confirm
          </GameButton>
        </div>
      </div>
    </div>
  );
}
