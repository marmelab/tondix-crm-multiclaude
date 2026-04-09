import { datatype, random } from "faker/locale/en_US";

import type { CompanyMachine } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";

export const generateCompanyMachines = (db: Db): CompanyMachine[] => {
  const machines: CompanyMachine[] = [];
  let id = 0;

  for (const company of db.companies.slice(0, 20)) {
    const count = datatype.number({ min: 1, max: 3 });
    const companyDeals = db.deals.filter((d) => d.company_id === company.id);

    for (let i = 0; i < count; i++) {
      const product = random.arrayElement(db.products);
      const deal =
        companyDeals.length > 0 && datatype.boolean()
          ? random.arrayElement(companyDeals)
          : null;

      machines.push({
        id: id++,
        created_at: randomDate().toISOString(),
        company_id: company.id as number,
        product_id: product.id,
        serial_number: `SN-${random.alphaNumeric(5).toUpperCase()}`,
        purchase_date: randomDate().toISOString().split("T")[0],
        deal_id: deal ? (deal.id as number) : null,
        notes: datatype.boolean() ? null : "Maintenance régulière effectuée",
      });
    }
  }

  return machines;
};
