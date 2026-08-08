# Frontend Architecture

Thin App Router pages compose domain UI. HTTP never lives in components.

```
src/
  app/                 # Routes + layouts only (thin pages)
  components/
    ui/                # Primitives (Button, Input, DataTable, …)
    common/            # Cross-role tables/stats
    Layouts/           # AppShell
    Auth/              # Login + register forms
    Landing/           # Marketing/entry
    SuperAdmin|Client|User/  # Role-specific feature UI (as needed)
  constants/           # Endpoints, routes, nav, copy
  services/            # Domain API functions → apiClient
  hooks/               # useAsyncData, …
  lib/
    api/               # Central apiClient + ApiError
    auth/              # Session cookies
    utils/             # Formatters, query helpers
  types/               # Shared TypeScript contracts
  styles/tokens/       # Design tokens (CSS variables)
  proxy.ts             # Role-based route guard (Next 16)
```

**Request flow:** Page/Component → `services/*` → `constants/*-endpoints` → `lib/api/client` → backend.
