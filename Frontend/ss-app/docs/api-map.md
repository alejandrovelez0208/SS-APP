# API Map

Mapa de endpoints del backend y el servicio TypeScript que los consume.

## Autenticación

| Endpoint | Servicio frontend | Feature | Backend |
|---|---|---|---|
| `POST /api/auth/signup` | `AuthApiService.signup()` | auth | `AuthController.signup()` |
| `POST /api/auth/login` | `AuthApiService.login()` desde `AuthSessionService.login()` | auth | `AuthController.login()` |
| `GET /api/auth/current-user` | `AuthApiService.getCurrentUser()` desde `AuthSessionService.initializeAuth()` | core | `AuthController` |
| `GET /api/auth/verify-email/{token}` | `AuthApiService.verifyEmail()` | auth | `AuthController` |
| `POST /api/auth/resend-verification` | `AuthApiService.resendVerificationEmail()` | auth | `AuthController` |
| `POST /api/auth/forgot-password` | `AuthApiService.forgotPassword()` | auth | `AuthController` |
| `POST /api/auth/reset-password/{token}` | `AuthApiService.resetPassword()` | auth | `AuthController` |

## Catálogos

| Endpoint | Servicio frontend | Feature | Backend |
|---|---|---|---|
| `GET /api/catalogs?type=...&active=true` | `CatalogApiService.searchByType()` desde `SignupCatalogStateService.search()` | auth/signup | `CatalogController.getAll()` |
| `GET /api/catalogs` | `CatalogApiService.getAll()` desde `AdminCatalogFacade.getAll()` | admin | `CatalogController.getAll()` |
| `POST /api/catalogs` | `CatalogApiService.create()` desde `AdminCatalogFacade.create()` | admin | `CatalogController.create()` |
| `PATCH /api/catalogs/{id}/status` | `CatalogApiService.updateStatus()` desde `AdminCatalogFacade.updateStatus()` | admin | `CatalogController.updateStatus()` |

## Perfiles admin

| Endpoint | Servicio frontend | Feature | Backend |
|---|---|---|---|
| `GET /api/admin/profiles` | `AdminProfilesApiService.getAll()` desde `AdminProfilesStateService.load()` | admin | `AdminProfileController.getAll()` |
| `GET /api/admin/profiles/{id}` | `AdminProfilesApiService.getById()` desde `AdminProfilesStateService.loadDetail()` | admin | `AdminProfileController.getById()` |
| `PATCH /api/admin/profiles/{id}/status` | `AdminProfilesApiService.updateStatus()` desde `AdminProfilesStateService.changeStatus()` | admin | `AdminProfileController.updateStatus()` |

Trazabilidad del listado:

```text
profiles.html
  → AdminProfiles.ngOnInit()
  → AdminProfilesStateService.load()
  → AdminProfilesApiService.getAll()
  → GET /api/admin/profiles
  → AdminProfileController.getAll()
  → AdminProfileServiceImpl.getAllProfiles()
  → ProfileRepository.findAllForAdmin()
```

Trazabilidad del detalle:

```text
profile-detail.html
  → AdminProfileDetail
  → AdminProfilesStateService.loadDetail()
  → AdminProfilesApiService.getById()
  → GET /api/admin/profiles/{id}
  → AdminProfileController.getById()
  → AdminProfileServiceImpl.getById()
  → ProfileRepository.findByIdWithAccountAndPhotos()
```

## Datos locales

`StaticDataService` consume:

- `/data/nationalities.json`
- `/data/internationalCodePhone.json`
- `/data/citiesColombia.json`

No son endpoints del backend.

## Cómo rastrear una llamada

```text
UI → Componente → Facade/State → ApiService → endpoint → Controller → Service → Repository
```

Ejemplo de catálogos:

```text
catalogs.html
  → createCatalog() en catalogs.ts
  → AdminCatalogFacade.create()
  → CatalogApiService.create()
  → POST /api/catalogs
  → CatalogController.create()
  → CatalogService.createCatalog()
  → CatalogRepository.save()
```

## Búsquedas útiles

```regex
http\.(get|post|put|patch|delete)\(
environment\.apiUrl
/api/catalogs
/api/admin/profiles
class \w+ApiService
```

## Archivos HTTP actuales

- `src/app/core/auth/auth-api.service.ts`
- `src/app/shared/services/catalogs/catalog-api.service.ts`
- `src/app/features/admin/data-access/admin-directory-api-service.ts`
- `src/app/features/admin/data-access/admin-profiles-api.service.ts`
- `src/app/shared/data/static-data.service.ts` (JSON locales, no backend)
