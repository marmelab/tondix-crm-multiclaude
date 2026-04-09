import type {
  Company,
  CompanyMachine,
  Contact,
  ContactNote,
  Deal,
  DealNote,
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
  company_machines: CompanyMachine[];
  service_contracts: ServiceContract[];
  configuration: Array<{ id: number; config: ConfigurationContextValue }>;
}
