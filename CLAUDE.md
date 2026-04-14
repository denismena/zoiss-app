# Zoiss App

## Project Overview
Zoiss is a supply chain management app for the furniture and interior design industry. It manages:
- Customer orders (`comenzi`) and supplier orders (`comenzi-furn`)
- Quotations (`oferte`)
- Deliveries (`livrari`) and transport
- Goods reception documents (`NIR` - Nota Interna de Receptie)
- Master data: products, clients, suppliers, architects, warehouses, branches, transporters

Frontend: Angular 21 (SPA, module-based, no standalone components)  
Backend: ASP.NET Core C# REST API  
Dev API: `https://localhost:44384/api`  
Prod API: `https://api.zoiss.ro/api`

---

## Commands

### Frontend (this repo)
```bash
npm start          # Dev server → http://localhost:4200
ng build           # Production build → dist/
ng test            # Karma/Jasmine unit tests
```

### Backend (separate repo/solution)
Run the ASP.NET Core solution in Visual Studio or via `dotnet run`.

---

## Architecture

- **Module-based Angular** — feature modules declared in `AppModule` (no lazy loading)
- **No NgRx** — state is managed with services + RxJS BehaviorSubjects/Observables
- **HTTP services** — each feature has a dedicated service (e.g. `ProduseService`, `ClientiService`)
- **JWT auth** — tokens stored in localStorage, refreshed automatically via `JwtInterceptorService`
- **UI** — Angular Material + Bootstrap 5.3 + custom SCSS themes

### Key directories
```
src/app/
  security/        # Login, register, guards, JWT interceptor
  utilities/       # Shared services (NotificationService, ExportService), pipes, generic components
  material/        # Angular Material module
  nomenclatoare/   # Master data (products, clients, suppliers, architects, warehouses…)
  comenzi/         # Customer orders
  comenzi-furn/    # Supplier orders
  oferte/          # Quotations
  livrari/         # Deliveries
  nir/             # Goods reception (NIR)
  transport/       # Transport management
  rapoarte/        # Reports
  notificari/      # Notifications
  stickyNote/      # Sticky notes
```

### Routing
All routes are in `src/app/app-routing.module.ts`. Protected by `IsAuthenticatedGuard`.

### Auth flow
`SecurityService` → stores JWT + refresh token in localStorage → `JwtInterceptorService` attaches Bearer token and handles 401 refresh + 429 rate-limit retries.

---

## Code Conventions

### Always follow existing patterns
Before writing any new component, service, or pipe — read a similar existing one first.
- List views: see `src/app/nomenclatoare/produse/`
- Detail/edit dialogs: see existing dialog components in feature modules
- HTTP services: follow the pattern in any existing `*service.ts`

### Language
**All user-facing text must be in Romanian.** This includes:
- Labels, button text, column headers
- Validation messages (use Romanian strings in RxWeb validators)
- Snackbar/notification messages via `NotificationService`
- Error messages and dialog prompts

### Subscriptions / lifecycle
Use `takeUntilDestroyed(this.destroyRef)` — NOT the deprecated `UnsubscribeService`.

### Forms
Use Angular reactive forms with `@rxweb/reactive-form-validators` for validation.

### Notifications
Always use `NotificationService` (from `src/app/utilities/`) for showing errors and messages — never raw `alert()` or console-only errors.

### Exports
Use `ExportService` for Excel exports — do not add new export dependencies.

---

## Do NOT Do

- Do not introduce NgRx or other state management libraries
- Do not convert modules to standalone components / lazy loading
- Do not add new major dependencies without discussion
- Do not store sensitive data beyond what is already in localStorage (JWT tokens)
- Do not use `UnsubscribeService` — it is deprecated

---

## Domain Glossary (Romanian → English)

| Romanian | English |
|---|---|
| Comanda | Order |
| Comanda furnizor | Supplier order |
| Oferta | Quotation |
| Livrare | Delivery |
| NIR | Goods reception document |
| Produs | Product |
| Client | Customer |
| Furnizor | Supplier |
| Arhitect | Architect / interior designer (used as sales agent) |
| Depozit | Warehouse |
| Sucursala | Branch |
| Transportator | Carrier/Transporter |
| UM | Unit of measure |
| Utilizator | User |
| Raport | Report |
