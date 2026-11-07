# Arquitectura del frontend

Este documento describe cómo se organiza la aplicación y dónde debe vivir cada tipo de código.

## Estructura

```text
src/app/
  core/                 Servicios globales/singleton de la aplicación
    auth/               Autenticación: API y sesión
    interceptors/       Interceptores HTTP
    error/              Manejo global de errores
  shared/               Código reutilizable entre features
    components/         Componentes reutilizables
    models/             Modelos compartidos
    services/           Servicios compartidos (dialog, notification, catalog API)
    data/               Datos estáticos locales
    styles/             Estilos compartidos
    validators/         Validadores reutilizables
  features/             Funcionalidad por dominio
    admin/
      data-access/      Facades y estado del panel admin
      pages/            Páginas del panel
      components/       Componentes del panel
      models/           Modelos del panel
      constants/        Constantes del panel
    auth/
      login/
      signup/
        data-access/    Estado de catálogos del signup
        steps/
        constants/
    landing/
    agency-dashboard/
```

## Reglas de dependencias

```text
features → shared
features → core
shared → core
```

Nunca:

```text
shared → features
feature A → feature B
componente → HttpClient
```

## Convención de nombres

| Tipo | Sufijo | Ejemplo |
|---|---|---|
| Llamadas HTTP | `*.api.service.ts` | `CatalogApiService` |
| Estado/caché | `*.state.service.ts` | `AdminAccountsStateService` |
| Orquestación | `*.facade.ts` | `AdminCatalogFacade` |
| Utilidades compartidas | `*.service.ts` | `NotificationService` |
| Mocks | `*.mock.ts` | `admin-accounts.mock.ts` |
| Modelos | `*.model.ts` | `catalog.model.ts` |

## Autenticación

`AuthApiService` solo hace HTTP.

`AuthSessionService` maneja:

- token
- usuario actual
- `initializeAuth`
- `login`
- `logout`
- rol y redirección

El interceptor `core/interceptors/auth.interceptor.ts` agrega el `Bearer token`.

## Catálogos

`CatalogApiService` es la única puerta HTTP de `/api/catalogs`.

- El signup usa `SignupCatalogStateService`, que transforma la respuesta a `CatalogItem`.
- El panel admin usa `AdminCatalogFacade`, que traduce los labels del formulario a `CatalogType`.

## Datos estáticos

`StaticDataService` consume JSON locales (`/data/*.json`), no el backend.

## Dónde agregar cosas

### Nuevo endpoint

1. Agregar el método en el `*ApiService` correspondiente.
2. Agregarlo a `docs/api-map.md`.
3. Si necesita transformación o estado, agregarlo al facade/state de la feature.

### Nuevo servicio de feature

```text
features/<feature>/data-access/
```

### Nuevo modelo compartido

```text
shared/models/
```

### Validación reutilizable

```text
shared/validators/
```

## Documentación relacionada

- `docs/api-map.md` — mapa de endpoints y servicios.
