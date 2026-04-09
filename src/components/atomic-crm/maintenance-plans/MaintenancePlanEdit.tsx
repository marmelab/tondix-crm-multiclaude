import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";

import { MaintenancePlanInputs } from "./MaintenancePlanInputs";

const MaintenancePlanEdit = () => (
  <Edit>
    <SimpleForm>
      <MaintenancePlanInputs />
    </SimpleForm>
  </Edit>
);

export default MaintenancePlanEdit;
