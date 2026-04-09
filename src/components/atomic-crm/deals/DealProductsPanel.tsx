import { useDelete, useGetManyReference, useRecordContext } from "ra-core";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "../products/productUtils";
import type { Deal, DealProduct } from "../types";

export const DealProductsPanel = () => {
  const deal = useRecordContext<Deal>();
  const [deleteOne] = useDelete();

  const { data: dealProducts, refetch } = useGetManyReference<DealProduct>(
    "deal_products",
    { target: "deal_id", id: deal?.id ?? 0 },
    { enabled: !!deal?.id },
  );

  const handleDelete = async (id: number) => {
    await deleteOne("deal_products", { id });
    refetch();
  };

  const total = (dealProducts ?? []).reduce(
    (sum, dp) => sum + (dp.unit_price ?? 0) * dp.quantity,
    0,
  );

  if (!deal) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Produits</h3>
        <span className="text-xs text-muted-foreground">
          Total : {formatPrice(total)}
        </span>
      </div>
      {(dealProducts ?? []).map((dp) => (
        <div
          key={dp.id}
          className="flex items-center justify-between text-sm border rounded p-2"
        >
          <span>
            Produit #{dp.product_id} × {dp.quantity}
          </span>
          <span>{formatPrice(dp.unit_price)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(dp.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {(!dealProducts || dealProducts.length === 0) && (
        <p className="text-xs text-muted-foreground">Aucun produit lié</p>
      )}
    </div>
  );
};
