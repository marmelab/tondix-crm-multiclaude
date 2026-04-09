import { useRecordContext } from "ra-core";
import { Show } from "@/components/admin/show";

import type { MaintenancePlan } from "../types";
import { formatPrice, getPlanLabel } from "./planUtils";

const MaintenancePlanShowContent = () => {
  const record = useRecordContext<MaintenancePlan>();
  if (!record) return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <span className="text-xs text-muted-foreground">Formule</span>
        <p className="text-sm">{record.name}</p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Visites par an</span>
        <p className="text-sm">{getPlanLabel(record.visits_per_year)}</p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Prix annuel</span>
        <p className="text-sm">{formatPrice(record.price)}</p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Actif</span>
        <p className="text-sm">{record.active ? "Oui" : "Non"}</p>
      </div>
      {record.description && (
        <div>
          <span className="text-xs text-muted-foreground">Description</span>
          <p className="text-sm whitespace-pre-line">{record.description}</p>
        </div>
      )}
    </div>
  );
};

const MaintenancePlanShow = () => (
  <Show>
    <MaintenancePlanShowContent />
  </Show>
);

export default MaintenancePlanShow;
