import { useGetManyReference, useRecordContext, useRedirect } from "ra-core";
import { FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getStatusLabel,
  isExpiringSoon,
} from "../service-contracts/contractUtils";
import type { Deal, ServiceContract } from "../types";

export const DealContractPanel = () => {
  const deal = useRecordContext<Deal>();
  const redirect = useRedirect();

  const { data: contracts } = useGetManyReference<ServiceContract>(
    "service_contracts",
    { target: "deal_id", id: deal?.id ?? 0 },
  );

  const handleCreate = () => {
    redirect("create", "service_contracts", undefined, undefined, {
      record: { deal_id: deal?.id, company_id: deal?.company_id },
    });
  };

  if (!deal) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Contrat d'entretien</h3>
        <Button variant="outline" size="sm" onClick={handleCreate}>
          <Plus className="h-3 w-3 mr-1" /> Créer un contrat
        </Button>
      </div>
      {(contracts ?? []).map((contract) => (
        <div
          key={contract.id}
          className="flex items-center justify-between text-sm border rounded p-2 cursor-pointer hover:bg-muted"
          onClick={() => redirect("show", "service_contracts", contract.id)}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            <span>{contract.name}</span>
          </div>
          <Badge
            variant={
              isExpiringSoon(contract.renewal_date) ? "destructive" : "default"
            }
          >
            {getStatusLabel(contract.status)}
          </Badge>
        </div>
      ))}
      {(!contracts || contracts.length === 0) && (
        <p className="text-xs text-muted-foreground">Aucun contrat lié</p>
      )}
    </div>
  );
};
