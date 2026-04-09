import { add } from "date-fns";
import { datatype, lorem, random } from "faker/locale/en_US";

import type { ServiceContract } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";

export const generateServiceContracts = (db: Db): ServiceContract[] => {
  const contracts: ServiceContract[] = [];
  let id = 0;

  const machinesByCompany = new Map<number, typeof db.company_machines>();
  for (const machine of db.company_machines) {
    const list = machinesByCompany.get(machine.company_id) ?? [];
    list.push(machine);
    machinesByCompany.set(machine.company_id, list);
  }

  const now = new Date();

  for (const [companyId, machines] of machinesByCompany) {
    const company = db.companies.find((c) => c.id === companyId);
    if (!company) continue;

    const companyDeals = db.deals.filter((d) => d.company_id === companyId);
    const deal =
      companyDeals.length > 0 ? random.arrayElement(companyDeals) : null;

    // First 3 contracts expire soon (-10 to +55 days) for demo purposes
    let renewalDate: string;
    let status: ServiceContract["status"];
    if (id < 3) {
      const daysFromNow = datatype.number({ min: 0, max: 65 }) - 10;
      const renewal = add(now, { days: daysFromNow });
      renewalDate = renewal.toISOString().split("T")[0];
      status = daysFromNow <= 0 ? "a-renouveler" : "actif";
    } else {
      renewalDate = randomDate(add(now, { months: 2 }), add(now, { years: 2 }))
        .toISOString()
        .split("T")[0];
      status = random.arrayElement([
        "actif",
        "actif",
        "actif",
        "a-renouveler",
        "resilier",
      ] as ServiceContract["status"][]);
    }

    const start_date = add(new Date(renewalDate), { years: -1 })
      .toISOString()
      .split("T")[0];

    contracts.push({
      id: id++,
      created_at: randomDate().toISOString(),
      name: `Contrat maintenance ${company.name}`,
      company_id: companyId,
      contact_ids: [],
      deal_id: deal ? (deal.id as number) : null,
      machine_ids: machines.map((m) => m.id),
      start_date,
      renewal_date: renewalDate,
      amount: datatype.number({ min: 500, max: 5000 }) * 100,
      notes: datatype.boolean() ? lorem.sentence() : null,
      status,
      sales_id: company.sales_id as number | null,
    });
  }

  return contracts;
};
