# Tondix CRM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Customize Atomic CRM into a B2B CRM for Tondix (lawnmower sales + annual maintenance contracts) with a product catalog, machine park per client, and contract renewal tracking.

**Architecture:** Extend Atomic CRM's existing React + Supabase stack by adding 4 new database tables (`products`, `deal_products`, `company_machines`, `service_contracts`), a DB view for aggregated contract/machine data, 2 new React resources (products, service_contracts), and panel extensions to the existing deal and company views. App-level configuration (theme, sectors, stages) is updated in `App.tsx`.

**Tech Stack:** React 19 + TypeScript, ra-core + shadcn-admin-kit, Supabase (PostgreSQL + PostgREST), Vitest, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-04-09-tondix-crm-design.md`

---

## File Map

### Created
- `src/components/atomic-crm/products/index.ts`
- `src/components/atomic-crm/products/ProductList.tsx`
- `src/components/atomic-crm/products/ProductShow.tsx`
- `src/components/atomic-crm/products/ProductCreate.tsx`
- `src/components/atomic-crm/products/ProductEdit.tsx`
- `src/components/atomic-crm/products/ProductInputs.tsx`
- `src/components/atomic-crm/products/productUtils.ts`
- `src/components/atomic-crm/products/productUtils.test.ts`
- `src/components/atomic-crm/service-contracts/index.ts`
- `src/components/atomic-crm/service-contracts/ServiceContractList.tsx`
- `src/components/atomic-crm/service-contracts/ServiceContractShow.tsx`
- `src/components/atomic-crm/service-contracts/ServiceContractCreate.tsx`
- `src/components/atomic-crm/service-contracts/ServiceContractEdit.tsx`
- `src/components/atomic-crm/service-contracts/ServiceContractInputs.tsx`
- `src/components/atomic-crm/service-contracts/contractUtils.ts`
- `src/components/atomic-crm/service-contracts/contractUtils.test.ts`
- `src/components/atomic-crm/deals/DealProductsPanel.tsx`
- `src/components/atomic-crm/deals/DealContractPanel.tsx`
- `src/components/atomic-crm/companies/CompanyMachinesTab.tsx`
- `src/components/atomic-crm/dashboard/RenewalWidget.tsx`
- `src/components/atomic-crm/providers/fakerest/dataGenerator/products.ts`
- `src/components/atomic-crm/providers/fakerest/dataGenerator/companyMachines.ts`
- `src/components/atomic-crm/providers/fakerest/dataGenerator/serviceContracts.ts`

### Modified
- `src/App.tsx` — Tondix configuration (theme, sectors, stages, categories)
- `src/components/atomic-crm/root/defaultConfiguration.ts` — Tondix defaults
- `src/components/atomic-crm/root/CRM.tsx` — register products + service_contracts resources
- `src/components/atomic-crm/types.ts` — add Product, DealProduct, CompanyMachine, ServiceContract
- `src/components/atomic-crm/deals/DealShow.tsx` — add products panel + contract panel
- `src/components/atomic-crm/companies/CompanyShow.tsx` — add Parc machines tab
- `src/components/atomic-crm/dashboard/Dashboard.tsx` — add RenewalWidget
- `src/components/atomic-crm/providers/fakerest/dataGenerator/types.ts` — extend Db type
- `src/components/atomic-crm/providers/fakerest/dataGenerator/index.ts` — wire new generators
- `supabase/schemas/01_tables.sql` — add 4 new tables
- `supabase/schemas/03_views.sql` — add service_contracts_with_machines view

---

## Task 1: App.tsx — Tondix configuration

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/atomic-crm/root/defaultConfiguration.ts`

- [ ] **Step 1: Update `defaultConfiguration.ts` with Tondix values**

Replace the entire file content:

```typescript
import type { ConfigurationContextValue } from "./ConfigurationContext";

export const defaultDarkModeLogo = "./logos/logo_atomic_crm_dark.svg";
export const defaultLightModeLogo = "./logos/logo_atomic_crm_light.svg";

export const defaultCurrency = "EUR";

export const defaultTitle = "Tondix CRM";

export const defaultCompanySectors = [
  { value: "golf", label: "Golf" },
  { value: "collectivite", label: "Collectivité" },
  { value: "paysagiste", label: "Paysagiste" },
  { value: "camping", label: "Camping / Hôtellerie" },
  { value: "sports-loisirs", label: "Sports & Loisirs" },
  { value: "syndic", label: "Syndic / Immobilier" },
];

export const defaultDealStages = [
  { value: "prospection", label: "Prospection" },
  { value: "demonstration", label: "Démonstration" },
  { value: "devis-envoye", label: "Devis envoyé" },
  { value: "negociation", label: "Négociation" },
  { value: "gagne", label: "Gagné" },
  { value: "perdu", label: "Perdu" },
];

export const defaultDealPipelineStatuses = ["gagne"];

export const defaultDealCategories = [
  { value: "thermique", label: "Tondeuse thermique" },
  { value: "electrique", label: "Tondeuse électrique" },
  { value: "robot", label: "Robot tondeuse" },
  { value: "autoportee", label: "Autoportée" },
  { value: "accessoires", label: "Accessoires" },
];

export const defaultNoteStatuses = [
  { value: "cold", label: "Cold", color: "#7dbde8" },
  { value: "warm", label: "Warm", color: "#e8cb7d" },
  { value: "hot", label: "Hot", color: "#e88b7d" },
  { value: "in-contract", label: "In Contract", color: "#a4e87d" },
];

export const defaultTaskTypes = [
  { value: "appel", label: "Appel" },
  { value: "demonstration", label: "Démonstration" },
  { value: "email", label: "Email" },
  { value: "devis", label: "Devis" },
  { value: "reunion", label: "Réunion" },
  { value: "relance", label: "Relance" },
  { value: "renouvellement", label: "Renouvellement contrat" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  currency: defaultCurrency,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
```

- [ ] **Step 2: Update `App.tsx` with Tondix theme**

```typescript
import { CRM } from "@/components/atomic-crm/root/CRM";
import type { RaThemeOptions } from "ra-core";

const tondixLightTheme: RaThemeOptions = {
  palette: {
    primary: { main: "#2d6a2d" },
    secondary: { main: "#e8c84a" },
    background: { default: "#f8faf8" },
  },
};

const tondixDarkTheme: RaThemeOptions = {
  palette: {
    primary: { main: "#4a9e4a" },
    secondary: { main: "#e8c84a" },
  },
};

const App = () => (
  <CRM lightTheme={tondixLightTheme} darkTheme={tondixDarkTheme} />
);

export default App;
```

- [ ] **Step 3: Start the app and verify visually**

```bash
make start-demo
```

Open http://localhost:5173 — the sidebar and buttons should be green (`#2d6a2d`). Deal stages should show Prospection → Démonstration → Devis envoyé → etc. Company sectors should show Golf, Collectivité, etc.

- [ ] **Step 4: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/atomic-crm/root/defaultConfiguration.ts
git commit -m "feat: configure Tondix theme, sectors, stages, and categories"
```

---

## Task 2: Database schema — new tables and view

**Files:**
- Modify: `supabase/schemas/01_tables.sql`
- Modify: `supabase/schemas/03_views.sql`

- [ ] **Step 1: Add new tables to `supabase/schemas/01_tables.sql`**

Append at the end of the file (before the foreign keys section):

```sql
create table public.products (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone not null default now(),
    reference text not null,
    name text not null,
    type text,
    price bigint,
    description text,
    active boolean not null default true,
    sales_id bigint references public.sales(id)
);

create table public.deal_products (
    id bigint generated by default as identity primary key,
    deal_id bigint not null references public.deals(id) on delete cascade,
    product_id bigint not null references public.products(id),
    quantity smallint not null default 1,
    unit_price bigint
);

create table public.company_machines (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone not null default now(),
    company_id bigint not null references public.companies(id) on delete cascade,
    product_id bigint not null references public.products(id),
    serial_number text,
    purchase_date date,
    deal_id bigint references public.deals(id),
    notes text
);

create table public.service_contracts (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone not null default now(),
    name text not null,
    company_id bigint references public.companies(id) on delete cascade,
    contact_ids bigint[],
    deal_id bigint references public.deals(id),
    machine_ids bigint[],
    start_date date not null,
    renewal_date date not null,
    amount bigint,
    notes text,
    status text not null default 'actif',
    sales_id bigint references public.sales(id)
);
```

Also add indexes at the end of the indexes section:

```sql
create index deal_products_deal_id_idx on public.deal_products using btree (deal_id);
create index company_machines_company_id_idx on public.company_machines using btree (company_id);
create index service_contracts_company_id_idx on public.service_contracts using btree (company_id);
create index service_contracts_renewal_date_idx on public.service_contracts using btree (renewal_date);
```

- [ ] **Step 2: Add view to `supabase/schemas/03_views.sql`**

Append at the end:

```sql
create or replace view public.service_contracts_with_machines as
select
    sc.*,
    coalesce(
        (
            select json_agg(json_build_object(
                'id', cm.id,
                'product_id', cm.product_id,
                'serial_number', cm.serial_number,
                'purchase_date', cm.purchase_date,
                'product_name', p.name,
                'product_reference', p.reference
            ))
            from public.company_machines cm
            join public.products p on p.id = cm.product_id
            where cm.id = any(sc.machine_ids)
        ),
        '[]'::json
    ) as machines
from public.service_contracts sc;
```

- [ ] **Step 3: Generate migration**

```bash
npx supabase db diff --local -f tondix_tables
```

Expected: creates `supabase/migrations/<timestamp>_tondix_tables.sql`.

- [ ] **Step 4: Apply migration**

```bash
npx supabase migration up --local
```

Expected: `Applying migration ... done`.

- [ ] **Step 5: Verify tables exist**

```bash
npx supabase db dump --local --schema public 2>/dev/null | grep "create table public.products"
```

Expected: line found.

- [ ] **Step 6: Commit**

```bash
git add supabase/schemas/01_tables.sql supabase/schemas/03_views.sql supabase/migrations/
git commit -m "feat: add products, deal_products, company_machines, service_contracts tables"
```

---

## Task 3: TypeScript types

**Files:**
- Modify: `src/components/atomic-crm/types.ts` (find the existing types file — it may be at this path or nearby)

- [ ] **Step 1: Add new types to `src/components/atomic-crm/types.ts`**

Append to the file:

```typescript
export type Product = {
  id: number;
  created_at: string;
  reference: string;
  name: string;
  type: "thermique" | "electrique" | "robot" | "autoportee" | "accessoires" | string;
  price: number | null;
  description: string | null;
  active: boolean;
  sales_id: number | null;
};

export type DealProduct = {
  id: number;
  deal_id: number;
  product_id: number;
  quantity: number;
  unit_price: number | null;
};

export type CompanyMachine = {
  id: number;
  created_at: string;
  company_id: number;
  product_id: number;
  serial_number: string | null;
  purchase_date: string | null;
  deal_id: number | null;
  notes: string | null;
};

export type ServiceContract = {
  id: number;
  created_at: string;
  name: string;
  company_id: number | null;
  contact_ids: number[];
  deal_id: number | null;
  machine_ids: number[];
  start_date: string;
  renewal_date: string;
  amount: number | null;
  notes: string | null;
  status: "actif" | "a-renouveler" | "resilier";
  sales_id: number | null;
};
```

- [ ] **Step 3: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/atomic-crm/types.ts
git commit -m "feat: add Product, DealProduct, CompanyMachine, ServiceContract types"
```

---

## Task 4: Products resource

**Files:**
- Create: `src/components/atomic-crm/products/productUtils.ts`
- Create: `src/components/atomic-crm/products/productUtils.test.ts`
- Create: `src/components/atomic-crm/products/ProductInputs.tsx`
- Create: `src/components/atomic-crm/products/ProductList.tsx`
- Create: `src/components/atomic-crm/products/ProductCreate.tsx`
- Create: `src/components/atomic-crm/products/ProductEdit.tsx`
- Create: `src/components/atomic-crm/products/ProductShow.tsx`
- Create: `src/components/atomic-crm/products/index.ts`

- [ ] **Step 1: Write failing test for `formatPrice`**

Create `src/components/atomic-crm/products/productUtils.test.ts`:

```typescript
import { formatPrice, getProductTypeLabel } from "./productUtils";

describe("formatPrice", () => {
  it("formats centimes to euros", () => {
    expect(formatPrice(150000)).toBe("1 500,00 €");
  });

  it("returns em dash for null", () => {
    expect(formatPrice(null)).toBe("—");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("0,00 €");
  });
});

describe("getProductTypeLabel", () => {
  it("returns correct label for known type", () => {
    expect(getProductTypeLabel("robot")).toBe("Robot tondeuse");
  });

  it("returns the raw value for unknown type", () => {
    expect(getProductTypeLabel("unknown")).toBe("unknown");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
make test -- --reporter=verbose productUtils
```

Expected: FAIL — `Cannot find module './productUtils'`

- [ ] **Step 3: Implement `productUtils.ts`**

Create `src/components/atomic-crm/products/productUtils.ts`:

```typescript
const PRODUCT_TYPE_LABELS: Record<string, string> = {
  thermique: "Tondeuse thermique",
  electrique: "Tondeuse électrique",
  robot: "Robot tondeuse",
  autoportee: "Autoportée",
  accessoires: "Accessoires",
};

export const formatPrice = (centimes: number | null): string => {
  if (centimes === null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(centimes / 100);
};

export const getProductTypeLabel = (type: string): string =>
  PRODUCT_TYPE_LABELS[type] ?? type;

export const PRODUCT_TYPE_CHOICES = Object.entries(PRODUCT_TYPE_LABELS).map(
  ([value, label]) => ({ id: value, name: label }),
);
```

- [ ] **Step 4: Run test to verify it passes**

```bash
make test -- --reporter=verbose productUtils
```

Expected: PASS (3 tests in `formatPrice`, 2 in `getProductTypeLabel`).

- [ ] **Step 5: Create `ProductInputs.tsx`**

```typescript
import { SelectInput, TextInput, BooleanInput, NumberInput } from "ra-core";
import { PRODUCT_TYPE_CHOICES } from "./productUtils";

export const ProductInputs = () => (
  <div className="grid grid-cols-2 gap-4">
    <TextInput source="reference" label="Référence" isRequired />
    <TextInput source="name" label="Nom" isRequired />
    <SelectInput
      source="type"
      label="Type"
      choices={PRODUCT_TYPE_CHOICES}
    />
    <NumberInput source="price" label="Prix catalogue (€)" step={0.01} />
    <TextInput source="description" label="Description" multiline rows={3} />
    <BooleanInput source="active" label="Actif" defaultValue={true} />
  </div>
);
```

- [ ] **Step 6: Create `ProductList.tsx`**

```typescript
import { Datagrid, List, TextField, BooleanField, NumberField, FunctionField } from "ra-core";
import type { Product } from "../types";
import { formatPrice, getProductTypeLabel } from "./productUtils";

const ProductList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="reference" label="Référence" />
      <TextField source="name" label="Nom" />
      <FunctionField<Product>
        label="Type"
        render={(record) => getProductTypeLabel(record.type ?? "")}
      />
      <FunctionField<Product>
        label="Prix catalogue"
        render={(record) => formatPrice(record.price)}
      />
      <BooleanField source="active" label="Actif" />
    </Datagrid>
  </List>
);

export default ProductList;
```

- [ ] **Step 7: Create `ProductCreate.tsx` and `ProductEdit.tsx`**

`src/components/atomic-crm/products/ProductCreate.tsx`:
```typescript
import { Create, SimpleForm } from "ra-core";
import { ProductInputs } from "./ProductInputs";

const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <ProductInputs />
    </SimpleForm>
  </Create>
);

export default ProductCreate;
```

`src/components/atomic-crm/products/ProductEdit.tsx`:
```typescript
import { Edit, SimpleForm } from "ra-core";
import { ProductInputs } from "./ProductInputs";

const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <ProductInputs />
    </SimpleForm>
  </Edit>
);

export default ProductEdit;
```

- [ ] **Step 8: Create `ProductShow.tsx`**

```typescript
import { ShowBase, useShowContext } from "ra-core";
import type { Product } from "../types";
import { formatPrice, getProductTypeLabel } from "./productUtils";

const ProductShow = () => (
  <ShowBase>
    <ProductShowContent />
  </ShowBase>
);

const ProductShowContent = () => {
  const { record } = useShowContext<Product>();
  if (!record) return null;
  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold">{record.name}</h2>
      <p className="text-sm text-muted-foreground">{record.reference}</p>
      <p>Type : {getProductTypeLabel(record.type ?? "")}</p>
      <p>Prix : {formatPrice(record.price)}</p>
      {record.description && <p>{record.description}</p>}
    </div>
  );
};

export default ProductShow;
```

- [ ] **Step 9: Create `index.ts`**

```typescript
import React from "react";

const ProductList = React.lazy(() => import("./ProductList"));
const ProductCreate = React.lazy(() => import("./ProductCreate"));
const ProductEdit = React.lazy(() => import("./ProductEdit"));
const ProductShow = React.lazy(() => import("./ProductShow"));

export default {
  list: ProductList,
  create: ProductCreate,
  edit: ProductEdit,
  show: ProductShow,
};
```

- [ ] **Step 10: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add src/components/atomic-crm/products/
git commit -m "feat: add products resource (catalogue tondeuses)"
```

---

## Task 5: Register resources in CRM.tsx

**Files:**
- Modify: `src/components/atomic-crm/root/CRM.tsx`

- [ ] **Step 1: Import new resources**

In `CRM.tsx`, add imports after the existing resource imports:

```typescript
import products from "../products";
import serviceContracts from "../service-contracts";
```

- [ ] **Step 2: Register resources in DesktopAdmin**

Add after `<Resource name="tags" />`:

```tsx
<Resource name="products" {...products} />
<Resource name="service_contracts" {...serviceContracts} />
<Resource name="deal_products" />
<Resource name="company_machines" />
```

- [ ] **Step 3: Run typecheck**

```bash
make typecheck
```

Expected: error about missing `service-contracts` module — this is expected and will be resolved in Task 7.

- [ ] **Step 4: Temporarily create stub index**

Create `src/components/atomic-crm/service-contracts/index.ts`:

```typescript
export default {};
```

- [ ] **Step 5: Run typecheck again**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/atomic-crm/root/CRM.tsx src/components/atomic-crm/service-contracts/index.ts
git commit -m "feat: register products and service_contracts resources"
```

---

## Task 6: Deal products panel

**Files:**
- Create: `src/components/atomic-crm/deals/DealProductsPanel.tsx`
- Modify: `src/components/atomic-crm/deals/DealShow.tsx`

- [ ] **Step 1: Create `DealProductsPanel.tsx`**

```typescript
import {
  useRecordContext,
  useGetManyReference,
  useCreate,
  useDelete,
  useNotify,
} from "ra-core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { Deal, DealProduct, Product } from "../types";
import { formatPrice } from "../products/productUtils";

export const DealProductsPanel = () => {
  const deal = useRecordContext<Deal>();
  const notify = useNotify();
  const [create] = useCreate();
  const [deleteOne] = useDelete();

  const { data: dealProducts, refetch } = useGetManyReference<DealProduct>(
    "deal_products",
    { target: "deal_id", id: deal?.id ?? 0, enabled: !!deal?.id }
  );

  const handleDelete = async (id: number) => {
    await deleteOne("deal_products", { id });
    refetch();
  };

  const total = (dealProducts ?? []).reduce(
    (sum, dp) => sum + (dp.unit_price ?? 0) * dp.quantity,
    0
  );

  if (!deal) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Produits</h3>
        <span className="text-xs text-muted-foreground">
          Total : {formatPrice(total)}
        </span>
      </div>
      {(dealProducts ?? []).map((dp) => (
        <div key={dp.id} className="flex items-center justify-between text-sm border rounded p-2">
          <span>Produit #{dp.product_id} × {dp.quantity}</span>
          <span>{formatPrice(dp.unit_price)}</span>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(dp.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {(!dealProducts || dealProducts.length === 0) && (
        <p className="text-xs text-muted-foreground">Aucun produit lié</p>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Add panel to `DealShow.tsx`**

In `DealShow.tsx`, import and add the panel:

```typescript
import { DealProductsPanel } from "./DealProductsPanel";
```

In `DealShowContent`, add after the existing fields (find the `<Separator />` before notes and insert before it):

```tsx
<DealProductsPanel />
<Separator />
```

- [ ] **Step 3: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/atomic-crm/deals/DealProductsPanel.tsx src/components/atomic-crm/deals/DealShow.tsx
git commit -m "feat: add products panel to deal view"
```

---

## Task 7: Service contracts resource

**Files:**
- Create: `src/components/atomic-crm/service-contracts/contractUtils.ts`
- Create: `src/components/atomic-crm/service-contracts/contractUtils.test.ts`
- Create: `src/components/atomic-crm/service-contracts/ServiceContractInputs.tsx`
- Create: `src/components/atomic-crm/service-contracts/ServiceContractList.tsx`
- Create: `src/components/atomic-crm/service-contracts/ServiceContractCreate.tsx`
- Create: `src/components/atomic-crm/service-contracts/ServiceContractEdit.tsx`
- Create: `src/components/atomic-crm/service-contracts/ServiceContractShow.tsx`
- Modify: `src/components/atomic-crm/service-contracts/index.ts`

- [ ] **Step 1: Write failing tests for `contractUtils`**

Create `src/components/atomic-crm/service-contracts/contractUtils.test.ts`:

```typescript
import { daysUntilRenewal, isExpiringSoon, getStatusLabel } from "./contractUtils";

describe("daysUntilRenewal", () => {
  it("returns positive days for future renewal", () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    expect(daysUntilRenewal(future.toISOString().split("T")[0])).toBe(30);
  });

  it("returns 0 for today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(daysUntilRenewal(today)).toBe(0);
  });

  it("returns negative days for past date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 10);
    expect(daysUntilRenewal(past.toISOString().split("T")[0])).toBe(-10);
  });
});

describe("isExpiringSoon", () => {
  it("returns true when renewal is within 60 days", () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 45);
    expect(isExpiringSoon(soon.toISOString().split("T")[0])).toBe(true);
  });

  it("returns false when renewal is beyond 60 days", () => {
    const far = new Date();
    far.setDate(far.getDate() + 90);
    expect(isExpiringSoon(far.toISOString().split("T")[0])).toBe(false);
  });

  it("returns true when renewal is already past", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(isExpiringSoon(past.toISOString().split("T")[0])).toBe(true);
  });
});

describe("getStatusLabel", () => {
  it("returns label for actif", () => {
    expect(getStatusLabel("actif")).toBe("Actif");
  });
  it("returns label for a-renouveler", () => {
    expect(getStatusLabel("a-renouveler")).toBe("À renouveler");
  });
  it("returns label for resilier", () => {
    expect(getStatusLabel("resilier")).toBe("Résilié");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
make test -- --reporter=verbose contractUtils
```

Expected: FAIL — `Cannot find module './contractUtils'`

- [ ] **Step 3: Implement `contractUtils.ts`**

```typescript
const STATUS_LABELS: Record<string, string> = {
  actif: "Actif",
  "a-renouveler": "À renouveler",
  resilier: "Résilié",
};

export const STATUS_CHOICES = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({ id: value, name: label })
);

export const daysUntilRenewal = (renewalDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewal = new Date(renewalDate);
  renewal.setHours(0, 0, 0, 0);
  return Math.round((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const isExpiringSoon = (renewalDate: string, thresholdDays = 60): boolean =>
  daysUntilRenewal(renewalDate) <= thresholdDays;

export const getStatusLabel = (status: string): string =>
  STATUS_LABELS[status] ?? status;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
make test -- --reporter=verbose contractUtils
```

Expected: PASS (8 tests total).

- [ ] **Step 5: Create `ServiceContractInputs.tsx`**

```typescript
import { DateInput, ReferenceInput, SelectInput, TextInput, NumberInput, AutocompleteInput } from "ra-core";
import { STATUS_CHOICES } from "./contractUtils";

export const ServiceContractInputs = () => (
  <div className="grid grid-cols-2 gap-4">
    <TextInput source="name" label="Nom du contrat" isRequired />
    <ReferenceInput source="company_id" reference="companies">
      <AutocompleteInput optionText="name" label="Client" isRequired />
    </ReferenceInput>
    <DateInput source="start_date" label="Date de début" isRequired />
    <DateInput source="renewal_date" label="Date de renouvellement" isRequired />
    <NumberInput source="amount" label="Montant annuel (€)" step={0.01} />
    <SelectInput source="status" label="Statut" choices={STATUS_CHOICES} defaultValue="actif" />
    <TextInput source="notes" label="Notes" multiline rows={3} />
  </div>
);
```

- [ ] **Step 6: Create `ServiceContractList.tsx`**

```typescript
import { Datagrid, List, TextField, DateField, FunctionField } from "ra-core";
import { Badge } from "@/components/ui/badge";
import type { ServiceContract } from "../types";
import { getStatusLabel, isExpiringSoon, daysUntilRenewal } from "./contractUtils";
import { formatPrice } from "../products/productUtils";

const ServiceContractList = () => (
  <List sort={{ field: "renewal_date", order: "ASC" }}>
    <Datagrid rowClick="show">
      <TextField source="name" label="Contrat" />
      <TextField source="company_id" label="Client" />
      <DateField source="renewal_date" label="Renouvellement" />
      <FunctionField<ServiceContract>
        label="Montant"
        render={(r) => formatPrice(r.amount)}
      />
      <FunctionField<ServiceContract>
        label="Statut"
        render={(r) => {
          const expiring = isExpiringSoon(r.renewal_date);
          const days = daysUntilRenewal(r.renewal_date);
          return (
            <Badge variant={expiring ? "destructive" : "default"}>
              {expiring && days <= 0 ? "Expiré" : getStatusLabel(r.status)}
            </Badge>
          );
        }}
      />
    </Datagrid>
  </List>
);

export default ServiceContractList;
```

- [ ] **Step 7: Create `ServiceContractCreate.tsx` and `ServiceContractEdit.tsx`**

`ServiceContractCreate.tsx`:
```typescript
import { Create, SimpleForm } from "ra-core";
import { ServiceContractInputs } from "./ServiceContractInputs";

const ServiceContractCreate = () => (
  <Create>
    <SimpleForm>
      <ServiceContractInputs />
    </SimpleForm>
  </Create>
);
export default ServiceContractCreate;
```

`ServiceContractEdit.tsx`:
```typescript
import { Edit, SimpleForm } from "ra-core";
import { ServiceContractInputs } from "./ServiceContractInputs";

const ServiceContractEdit = () => (
  <Edit>
    <SimpleForm>
      <ServiceContractInputs />
    </SimpleForm>
  </Edit>
);
export default ServiceContractEdit;
```

- [ ] **Step 8: Create `ServiceContractShow.tsx`**

```typescript
import { ShowBase, useShowContext, ReferenceField, TextField } from "ra-core";
import type { ServiceContract } from "../types";
import { getStatusLabel, isExpiringSoon, daysUntilRenewal } from "./contractUtils";
import { formatPrice } from "../products/productUtils";
import { Badge } from "@/components/ui/badge";

const ServiceContractShow = () => (
  <ShowBase>
    <ServiceContractShowContent />
  </ShowBase>
);

const ServiceContractShowContent = () => {
  const { record } = useShowContext<ServiceContract>();
  if (!record) return null;
  const days = daysUntilRenewal(record.renewal_date);
  const expiring = isExpiringSoon(record.renewal_date);
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">{record.name}</h2>
        <Badge variant={expiring ? "destructive" : "default"}>
          {expiring && days <= 0 ? "Expiré" : getStatusLabel(record.status)}
        </Badge>
      </div>
      <p>Renouvellement : {record.renewal_date} ({days >= 0 ? `dans ${days} j` : `expiré depuis ${-days} j`})</p>
      <p>Montant : {formatPrice(record.amount)}</p>
      {record.notes && <p className="text-muted-foreground">{record.notes}</p>}
    </div>
  );
};

export default ServiceContractShow;
```

- [ ] **Step 9: Replace stub `index.ts`**

```typescript
import React from "react";

const ServiceContractList = React.lazy(() => import("./ServiceContractList"));
const ServiceContractCreate = React.lazy(() => import("./ServiceContractCreate"));
const ServiceContractEdit = React.lazy(() => import("./ServiceContractEdit"));
const ServiceContractShow = React.lazy(() => import("./ServiceContractShow"));

export default {
  list: ServiceContractList,
  create: ServiceContractCreate,
  edit: ServiceContractEdit,
  show: ServiceContractShow,
};
```

- [ ] **Step 10: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add src/components/atomic-crm/service-contracts/
git commit -m "feat: add service_contracts resource with renewal tracking"
```

---

## Task 8: Deal contract panel

**Files:**
- Create: `src/components/atomic-crm/deals/DealContractPanel.tsx`
- Modify: `src/components/atomic-crm/deals/DealShow.tsx`

- [ ] **Step 1: Create `DealContractPanel.tsx`**

```typescript
import { useRecordContext, useGetManyReference, useRedirect } from "ra-core";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import type { Deal, ServiceContract } from "../types";
import { getStatusLabel, isExpiringSoon } from "../service-contracts/contractUtils";
import { Badge } from "@/components/ui/badge";

export const DealContractPanel = () => {
  const deal = useRecordContext<Deal>();
  const redirect = useRedirect();

  const { data: contracts } = useGetManyReference<ServiceContract>(
    "service_contracts",
    { target: "deal_id", id: deal?.id ?? 0, enabled: !!deal?.id }
  );

  const handleCreate = () => {
    redirect("create", "service_contracts", undefined, undefined, {
      record: { deal_id: deal?.id, company_id: deal?.company_id },
    });
  };

  if (!deal) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Contrat d'entretien</h3>
        <Button variant="outline" size="sm" onClick={handleCreate}>
          <Plus className="h-3 w-3 mr-1" /> Créer un contrat
        </Button>
      </div>
      {(contracts ?? []).map((contract) => (
        <div
          key={contract.id}
          className="flex items-center justify-between text-sm border rounded p-2 cursor-pointer hover:bg-muted"
          onClick={() => redirect("show", "service_contracts", contract.id)}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            <span>{contract.name}</span>
          </div>
          <Badge variant={isExpiringSoon(contract.renewal_date) ? "destructive" : "default"}>
            {getStatusLabel(contract.status)}
          </Badge>
        </div>
      ))}
      {(!contracts || contracts.length === 0) && (
        <p className="text-xs text-muted-foreground">Aucun contrat lié</p>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Add panel to `DealShow.tsx`**

Import:
```typescript
import { DealContractPanel } from "./DealContractPanel";
```

Add after `<DealProductsPanel />`:
```tsx
<DealContractPanel />
<Separator />
```

- [ ] **Step 3: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/atomic-crm/deals/DealContractPanel.tsx src/components/atomic-crm/deals/DealShow.tsx
git commit -m "feat: add contract panel to deal view with quick-create shortcut"
```

---

## Task 9: Company machine park tab

**Files:**
- Create: `src/components/atomic-crm/companies/CompanyMachinesTab.tsx`
- Modify: `src/components/atomic-crm/companies/CompanyShow.tsx`

- [ ] **Step 1: Create `CompanyMachinesTab.tsx`**

```typescript
import { useRecordContext, useGetManyReference } from "ra-core";
import { AlertTriangle } from "lucide-react";
import type { Company, CompanyMachine } from "../types";
import { isExpiringSoon } from "../service-contracts/contractUtils";
import { Badge } from "@/components/ui/badge";

export const CompanyMachinesTab = () => {
  const company = useRecordContext<Company>();

  const { data: machines } = useGetManyReference<CompanyMachine>(
    "company_machines",
    { target: "company_id", id: company?.id ?? 0, enabled: !!company?.id }
  );

  if (!company) return null;

  return (
    <div className="space-y-3 p-4">
      <h3 className="font-semibold">Parc machines ({(machines ?? []).length})</h3>
      {(machines ?? []).map((machine) => (
        <MachineRow key={machine.id} machine={machine} />
      ))}
      {(!machines || machines.length === 0) && (
        <p className="text-sm text-muted-foreground">Aucune machine enregistrée</p>
      )}
    </div>
  );
};

const MachineRow = ({ machine }: { machine: CompanyMachine }) => {
  // Note: in a production implementation, resolve product name via ReferenceField.
  // This minimal version shows product_id until a full reference is wired.
  return (
    <div className="border rounded p-3 text-sm space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-medium">Produit #{machine.product_id}</span>
        {machine.serial_number && (
          <span className="text-muted-foreground text-xs">S/N : {machine.serial_number}</span>
        )}
      </div>
      {machine.purchase_date && (
        <p className="text-xs text-muted-foreground">Acheté le : {machine.purchase_date}</p>
      )}
      {machine.notes && <p className="text-xs">{machine.notes}</p>}
    </div>
  );
};
```

- [ ] **Step 2: Add tab to `CompanyShow.tsx`**

In `CompanyShow.tsx`, find the `<Tabs>` component (around the contacts/deals tabs) and add:

```tsx
import { CompanyMachinesTab } from "./CompanyMachinesTab";

// Inside <TabsList>:
<TabsTrigger value="machines">Parc machines</TabsTrigger>

// Inside <Tabs> after existing TabsContent:
<TabsContent value="machines">
  <CompanyMachinesTab />
</TabsContent>
```

- [ ] **Step 3: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/atomic-crm/companies/CompanyMachinesTab.tsx src/components/atomic-crm/companies/CompanyShow.tsx
git commit -m "feat: add machine park tab to company view"
```

---

## Task 10: Dashboard renewal widget

**Files:**
- Create: `src/components/atomic-crm/dashboard/RenewalWidget.tsx`
- Modify: `src/components/atomic-crm/dashboard/Dashboard.tsx`

- [ ] **Step 1: Create `RenewalWidget.tsx`**

```typescript
import { useGetList, useRedirect } from "ra-core";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceContract } from "../types";
import { daysUntilRenewal } from "../service-contracts/contractUtils";

export const RenewalWidget = () => {
  const redirect = useRedirect();

  // Fetch contracts with renewal_date within next 60 days
  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);

  const { data: contracts } = useGetList<ServiceContract>("service_contracts", {
    sort: { field: "renewal_date", order: "ASC" },
    filter: { "renewal_date@lte": sixtyDaysFromNow.toISOString().split("T")[0] },
    pagination: { page: 1, perPage: 10 },
  });

  const expiring = (contracts ?? []).filter(
    (c) => c.status !== "resilier"
  );

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
          <p className="text-sm text-muted-foreground">Aucun contrat à renouveler sous 60 jours</p>
        ) : (
          <ul className="space-y-2">
            {expiring.map((contract) => {
              const days = daysUntilRenewal(contract.renewal_date);
              return (
                <li
                  key={contract.id}
                  className="flex items-center justify-between text-sm cursor-pointer hover:underline"
                  onClick={() => redirect("show", "service_contracts", contract.id)}
                >
                  <span>{contract.name}</span>
                  <span className={`text-xs font-medium ${days < 0 ? "text-red-500" : "text-yellow-600"}`}>
                    {days < 0 ? `Expiré depuis ${-days} j` : `dans ${days} j`}
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
```

- [ ] **Step 2: Add widget to `Dashboard.tsx`**

Read `src/components/atomic-crm/dashboard/Dashboard.tsx` first to understand where to insert. Then:

```typescript
import { RenewalWidget } from "./RenewalWidget";
```

Add `<RenewalWidget />` in the dashboard grid, alongside the existing KPI cards.

- [ ] **Step 3: Run typecheck**

```bash
make typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/atomic-crm/dashboard/RenewalWidget.tsx src/components/atomic-crm/dashboard/Dashboard.tsx
git commit -m "feat: add contract renewal widget to dashboard"
```

---

## Task 11: FakeRest data generators

**Files:**
- Create: `src/components/atomic-crm/providers/fakerest/dataGenerator/products.ts`
- Create: `src/components/atomic-crm/providers/fakerest/dataGenerator/companyMachines.ts`
- Create: `src/components/atomic-crm/providers/fakerest/dataGenerator/serviceContracts.ts`
- Modify: `src/components/atomic-crm/providers/fakerest/dataGenerator/types.ts`
- Modify: `src/components/atomic-crm/providers/fakerest/dataGenerator/index.ts`

- [ ] **Step 1: Update `types.ts`**

```typescript
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
```

- [ ] **Step 2: Create `products.ts` generator**

```typescript
import { datatype, lorem, random } from "faker/locale/en_US";
import type { Product } from "../../../types";
import type { Db } from "./types";

const PRODUCT_TYPES = ["thermique", "electrique", "robot", "autoportee", "accessoires"];
const MODELS = ["TX-200", "TX-350", "TX-450", "TX-550", "TX-Robot Pro", "TX-Auto 600", "TX-Eco"];

export const generateProducts = (_db: Db): Product[] =>
  MODELS.map((reference, id) => ({
    id,
    created_at: new Date().toISOString(),
    reference,
    name: `Tondix ${reference}`,
    type: random.arrayElement(PRODUCT_TYPES),
    price: datatype.number({ min: 500, max: 15000 }) * 100,
    description: lorem.sentence(),
    active: true,
    sales_id: null,
  }));
```

- [ ] **Step 3: Create `companyMachines.ts` generator**

```typescript
import { datatype, random } from "faker/locale/en_US";
import type { CompanyMachine } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";

export const generateCompanyMachines = (db: Db): CompanyMachine[] => {
  const machines: CompanyMachine[] = [];
  let id = 0;
  db.companies.slice(0, 20).forEach((company) => {
    const count = datatype.number({ min: 1, max: 3 });
    for (let i = 0; i < count; i++) {
      const product = random.arrayElement(db.products);
      const deal = random.arrayElement(
        db.deals.filter((d) => d.company_id === company.id)
      );
      machines.push({
        id: id++,
        created_at: new Date().toISOString(),
        company_id: company.id,
        product_id: product.id,
        serial_number: `SN-${datatype.number({ min: 10000, max: 99999 })}`,
        purchase_date: randomDate(new Date("2020-01-01")).toISOString().split("T")[0],
        deal_id: deal?.id ?? null,
        notes: null,
      });
    }
  });
  return machines;
};
```

- [ ] **Step 4: Create `serviceContracts.ts` generator**

```typescript
import { datatype, lorem, random } from "faker/locale/en_US";
import { add, sub } from "date-fns";
import type { ServiceContract } from "../../../types";
import type { Db } from "./types";

export const generateServiceContracts = (db: Db): ServiceContract[] => {
  const contracts: ServiceContract[] = [];
  let id = 0;

  // Create contracts for companies that have machines
  const companiesWithMachines = [...new Set(db.company_machines.map((m) => m.company_id))];

  companiesWithMachines.forEach((companyId) => {
    const companyMachines = db.company_machines.filter((m) => m.company_id === companyId);
    const deal = db.deals.find((d) => d.company_id === companyId) ?? null;

    // Make some contracts expire soon for demo purposes
    const daysOffset = id < 3 ? datatype.number({ min: -10, max: 55 }) : datatype.number({ min: 60, max: 365 });
    const renewal = add(new Date(), { days: daysOffset });

    contracts.push({
      id: id++,
      created_at: new Date().toISOString(),
      name: `Contrat entretien ${id}`,
      company_id: companyId,
      contact_ids: [],
      deal_id: deal?.id ?? null,
      machine_ids: companyMachines.map((m) => m.id),
      start_date: sub(renewal, { years: 1 }).toISOString().split("T")[0],
      renewal_date: renewal.toISOString().split("T")[0],
      amount: datatype.number({ min: 500, max: 3000 }) * 100,
      notes: null,
      status: daysOffset < 0 ? "a-renouveler" : "actif",
      sales_id: null,
    });
  });

  return contracts;
};
```

- [ ] **Step 5: Update `index.ts` to wire new generators**

```typescript
import { generateCompanies } from "./companies";
import { generateCompanyMachines } from "./companyMachines";
import { generateContactNotes } from "./contactNotes";
import { generateContacts } from "./contacts";
import { generateDealNotes } from "./dealNotes";
import { generateDeals } from "./deals";
import { finalize } from "./finalize";
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
  db.company_machines = generateCompanyMachines(db);
  db.service_contracts = generateServiceContracts(db);
  db.configuration = [
    {
      id: 1,
      config: {} as Db["configuration"][number]["config"],
    },
  ];
  finalize(db);
  return db;
};
```

- [ ] **Step 6: Run typecheck and tests**

```bash
make typecheck && make test
```

Expected: no errors, all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/atomic-crm/providers/fakerest/dataGenerator/
git commit -m "feat: add FakeRest data generators for products, machines, and contracts"
```

---

## Task 12: End-to-end smoke test

- [ ] **Step 1: Start demo mode**

```bash
make start-demo
```

- [ ] **Step 2: Verify checklist in browser**

Open http://localhost:5173 and verify:

- [ ] App title is "Tondix CRM"
- [ ] Sidebar is green (`#2d6a2d`)
- [ ] Sidebar has sections: Prospection, Ventes, Catalogue, Suivi
- [ ] "Tondeuses" link in sidebar opens product list with TX-* references
- [ ] "Contrats entretien" link shows list sorted by renewal date
- [ ] Some contracts show red badge (expiring/expired)
- [ ] Dashboard has "Contrats à renouveler" widget
- [ ] Clicking a deal shows a "Produits" panel and a "Contrat d'entretien" panel
- [ ] Clicking a company shows a "Parc machines" tab
- [ ] Deal stage dropdown shows: Prospection, Démonstration, Devis envoyé, Négociation, Gagné, Perdu
- [ ] Company sector dropdown shows: Golf, Collectivité, Paysagiste, etc.

- [ ] **Step 3: Run full test suite**

```bash
make test && make typecheck && make lint
```

Expected: all pass.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final smoke test — all Tondix features verified"
```
