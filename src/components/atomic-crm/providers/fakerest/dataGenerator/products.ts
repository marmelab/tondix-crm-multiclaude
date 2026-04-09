import { datatype, lorem, random } from "faker/locale/en_US";

import type { Product } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";

const productDefinitions = [
  { reference: "TX-200", name: "Tondix TX-200", type: "thermique" },
  { reference: "TX-350", name: "Tondix TX-350", type: "thermique" },
  { reference: "TX-450", name: "Tondix TX-450", type: "electrique" },
  { reference: "TX-550", name: "Tondix TX-550", type: "electrique" },
  { reference: "TX-Robot Pro", name: "Tondix Robot Pro", type: "robot" },
  { reference: "TX-Auto 600", name: "Tondix Auto 600", type: "autoportee" },
  { reference: "TX-Eco", name: "Tondix Eco", type: "accessoires" },
];

export const generateProducts = (_db: Db): Product[] => {
  return productDefinitions.map((def, id) => ({
    id,
    created_at: randomDate().toISOString(),
    reference: def.reference,
    name: def.name,
    type: def.type,
    price: datatype.number({ min: 500, max: 15000 }) * 100,
    description: lorem.sentence(),
    active: true,
    sales_id: random.arrayElement([null, null, 0]),
  }));
};
