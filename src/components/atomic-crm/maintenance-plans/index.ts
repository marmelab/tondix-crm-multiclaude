import React from "react";

const MaintenancePlanList = React.lazy(() => import("./MaintenancePlanList"));
const MaintenancePlanCreate = React.lazy(
  () => import("./MaintenancePlanCreate"),
);
const MaintenancePlanEdit = React.lazy(() => import("./MaintenancePlanEdit"));
const MaintenancePlanShow = React.lazy(() => import("./MaintenancePlanShow"));

export default {
  list: MaintenancePlanList,
  create: MaintenancePlanCreate,
  edit: MaintenancePlanEdit,
  show: MaintenancePlanShow,
};
