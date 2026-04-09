import { Create } from "@/components/admin/create";
import { SimpleForm } from "@/components/admin/simple-form";

import { MaintenancePlanInputs } from "./MaintenancePlanInputs";

const MaintenancePlanCreate = () => (
  <Create>
    <SimpleForm defaultValues={{ active: true }}>
      <MaintenancePlanInputs />
    </SimpleForm>
  </Create>
);

export default MaintenancePlanCreate;
