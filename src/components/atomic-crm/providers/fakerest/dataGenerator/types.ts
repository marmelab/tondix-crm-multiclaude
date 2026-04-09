import type {
  Company,
  CompanyMachine,
  Contact,
  ContactNote,
  Deal,
  DealNote,
  DealProduct,
  MaintenancePlan,
  Product,
  Sale,
  ServiceContract,
  Tag,
  Task,
} from "../../../types";
import type { ConfigurationContextValue } from "../../../root/ConfigurationContext";

export interface Db {
  companies: Company[];
  contacts: Contact[];
  contact_notes: ContactNote[];
  deals: Deal[];
  deal_notes: DealNote[];
  sales: Sale[];
  tags: Tag[];
  tasks: Task[];
  products: Product[];
  deal_products: DealProduct[];
  company_machines: CompanyMachine[];
  service_contracts: ServiceContract[];
  maintenance_plans: MaintenancePlan[];
  configuration: Array<{ id: number; config: ConfigurationContextValue }>;
}
