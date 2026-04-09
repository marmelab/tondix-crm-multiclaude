import { generateCompanies } from "./companies";
import { generateCompanyMachines } from "./companyMachines";
import { generateContactNotes } from "./contactNotes";
import { generateContacts } from "./contacts";
import { generateDealNotes } from "./dealNotes";
import { generateDealProducts } from "./dealProducts";
import { generateDeals } from "./deals";
import { finalize } from "./finalize";
import { generateMaintenancePlans } from "./maintenancePlans";
import { generateProducts } from "./products";
import { generateSales } from "./sales";
import { generateServiceContracts } from "./serviceContracts";
import { generateTags } from "./tags";
import { generateTasks } from "./tasks";
import type { Db } from "./types";

export default (): Db => {
  const db = {} as Db;
  db.sales = generateSales(db);
  db.tags = generateTags(db);
  db.companies = generateCompanies(db);
  db.contacts = generateContacts(db);
  db.contact_notes = generateContactNotes(db);
  db.deals = generateDeals(db);
  db.deal_notes = generateDealNotes(db);
  db.tasks = generateTasks(db);
  db.products = generateProducts(db);
  db.deal_products = generateDealProducts(db);
  db.company_machines = generateCompanyMachines(db);
  db.service_contracts = generateServiceContracts(db);
  db.maintenance_plans = generateMaintenancePlans(db);
  db.configuration = [
    {
      id: 1,
      config: {} as Db["configuration"][number]["config"],
    },
  ];
  finalize(db);

  return db;
};
