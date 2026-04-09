import { required } from "ra-core";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { TextInput } from "@/components/admin/text-input";

export const MaintenancePlanInputs = () => (
  <div className="flex flex-col gap-4">
    <TextInput
      source="name"
      label="Nom"
      validate={required()}
      helperText={false}
    />
    <TextInput source="description" multiline helperText={false} />
    <NumberInput
      source="visits_per_year"
      label="Visites par an"
      validate={required()}
      helperText={false}
    />
    <NumberInput
      source="price"
      label="Prix annuel (€)"
      step={0.01}
      helperText={false}
    />
    <BooleanInput source="active" defaultValue={true} />
  </div>
);
