import { useRecordContext } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";

import { TopToolbar } from "../layout/TopToolbar";
import { formatPrice, getPlanLabel } from "./planUtils";

const MaintenancePlanListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

const VisitsField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext();
  if (!record) return null;
  return <span>{getPlanLabel(record.visits_per_year)}</span>;
};

const PriceField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext();
  if (!record) return null;
  return <span>{formatPrice(record.price)}</span>;
};

const ActiveField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext();
  if (!record) return null;
  return <span>{record.active ? "Oui" : "Non"}</span>;
};

const MaintenancePlanList = () => (
  <List
    filters={filters}
    actions={<MaintenancePlanListActions />}
    sort={{ field: "name", order: "ASC" }}
  >
    <DataTable>
      <DataTable.Col source="name" label="Formule" />
      <DataTable.Col source="visits_per_year" label="Visites/an">
        <VisitsField />
      </DataTable.Col>
      <DataTable.Col source="price" label="Prix annuel">
        <PriceField />
      </DataTable.Col>
      <DataTable.Col source="active" label="Actif">
        <ActiveField />
      </DataTable.Col>
    </DataTable>
  </List>
);

export default MaintenancePlanList;
