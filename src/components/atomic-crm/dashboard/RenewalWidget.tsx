import { useGetList, useRedirect } from "ra-core";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceContract } from "../types";
import { daysUntilRenewal } from "../service-contracts/contractUtils";

export const RenewalWidget = () => {
  const redirect = useRedirect();

  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);

  const { data: contracts } = useGetList<ServiceContract>("service_contracts", {
    sort: { field: "renewal_date", order: "ASC" },
    filter: {
      "renewal_date@lte": sixtyDaysFromNow.toISOString().split("T")[0],
    },
    pagination: { page: 1, perPage: 10 },
  });

  const expiring = (contracts ?? []).filter((c) => c.status !== "resilier");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          Contrats à renouveler
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expiring.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun contrat à renouveler sous 60 jours
          </p>
        ) : (
          <ul className="space-y-2">
            {expiring.map((contract) => {
              const days = daysUntilRenewal(contract.renewal_date);
              return (
                <li
                  key={contract.id}
                  className="flex items-center justify-between text-sm cursor-pointer hover:underline"
                  onClick={() =>
                    redirect("show", "service_contracts", contract.id)
                  }
                >
                  <span>{contract.name}</span>
                  <span
                    className={
                      "text-xs font-medium " +
                      (days < 0 ? "text-red-500" : "text-yellow-600")
                    }
                  >
                    {days < 0
                      ? "Expiré depuis " + -days + " j"
                      : "dans " + days + " j"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
