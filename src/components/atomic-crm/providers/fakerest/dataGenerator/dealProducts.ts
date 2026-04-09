import { datatype, random } from "faker/locale/en_US";

import type { DealProduct } from "../../../types";
import type { Db } from "./types";

export const generateDealProducts = (db: Db): DealProduct[] => {
  const dealProducts: DealProduct[] = [];
  let id = 0;

  for (const deal of db.deals.slice(0, 30)) {
    const count = datatype.number({ min: 1, max: 3 });
    const usedProductIds = new Set<number>();

    for (let i = 0; i < count; i++) {
      const product = random.arrayElement(db.products);
      if (usedProductIds.has(product.id)) continue;
      usedProductIds.add(product.id);

      dealProducts.push({
        id: id++,
        deal_id: deal.id as number,
        product_id: product.id,
        quantity: datatype.number({ min: 1, max: 5 }),
        unit_price: product.price ?? datatype.number({ min: 500, max: 5000 }),
      });
    }
  }

  return dealProducts;
};
