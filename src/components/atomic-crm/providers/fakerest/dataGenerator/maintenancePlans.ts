import type { MaintenancePlan } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";

const planDefinitions = [
  {
    name: "Entretien Bronze",
    description: "1 visite annuelle de maintenance préventive.",
    visits_per_year: 1,
    price: 49900,
  },
  {
    name: "Entretien Silver",
    description: "2 visites annuelles incluant réglages et nettoyage.",
    visits_per_year: 2,
    price: 89900,
  },
  {
    name: "Entretien Gold",
    description:
      "4 visites annuelles avec remplacement des consommables inclus.",
    visits_per_year: 4,
    price: 149900,
  },
  {
    name: "Entretien Platinum",
    description:
      "6 visites annuelles, pièces de rechange et main-d'œuvre illimitées incluses.",
    visits_per_year: 6,
    price: 249900,
  },
];

export const generateMaintenancePlans = (_db: Db): MaintenancePlan[] =>
  planDefinitions.map((def, id) => ({
    id,
    created_at: randomDate().toISOString(),
    name: def.name,
    description: def.description,
    visits_per_year: def.visits_per_year,
    price: def.price,
    active: true,
  }));
