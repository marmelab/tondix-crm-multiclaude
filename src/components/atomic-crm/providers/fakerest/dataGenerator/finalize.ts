import type { Db } from "./types";

export const finalize = (db: Db) => {
  // set contact status according to the latest note
  db.contact_notes
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    .forEach((note) => {
      db.contacts[note.contact_id as number].status = note.status;
    });

  // Compute nb_machines per company
  db.company_machines.forEach((machine) => {
    const company = db.companies.find((c) => c.id === machine.company_id);
    if (company) {
      (company as any).nb_machines = ((company as any).nb_machines ?? 0) + 1;
    }
  });

  // Compute nb_contracts per company
  db.service_contracts.forEach((contract) => {
    if (!contract.company_id) return;
    const company = db.companies.find((c) => c.id === contract.company_id);
    if (company) {
      (company as any).nb_contracts = ((company as any).nb_contracts ?? 0) + 1;
    }
  });
};
