import { useGetManyReference, useRecordContext } from "ra-core";
import type { Company, CompanyMachine } from "../types";

export const CompanyMachinesTab = () => {
  const company = useRecordContext<Company>();

  const { data: machines } = useGetManyReference<CompanyMachine>(
    "company_machines",
    { target: "company_id", id: company?.id ?? 0 },
  );

  if (!company) return null;

  return (
    <div className="space-y-3 p-4">
      <h3 className="font-semibold">
        Parc machines ({(machines ?? []).length})
      </h3>
      {(machines ?? []).map((machine) => (
        <div key={machine.id} className="border rounded p-3 text-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">Produit #{machine.product_id}</span>
            {machine.serial_number && (
              <span className="text-muted-foreground text-xs">
                S/N : {machine.serial_number}
              </span>
            )}
          </div>
          {machine.purchase_date && (
            <p className="text-xs text-muted-foreground">
              Acheté le : {machine.purchase_date}
            </p>
          )}
          {machine.notes && <p className="text-xs">{machine.notes}</p>}
        </div>
      ))}
      {(!machines || machines.length === 0) && (
        <p className="text-sm text-muted-foreground">
          Aucune machine enregistrée
        </p>
      )}
    </div>
  );
};
