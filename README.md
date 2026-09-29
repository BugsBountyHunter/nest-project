# Used Car Pricing API

A NestJS REST API where signed-in users submit **used-car sale reports** (make, model, year, mileage, location, price). It covers session-based authentication, route guards and response serialization.

![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/TypeORM-SQLite-003B57?logo=sqlite)

## Highlights

- **Hand-rolled authentication.** Passwords are hashed with Node's `scrypt` and a random salt. Sign-in state is kept in a signed cookie session.
- **`AuthGuard` and a `@CurrentUser()` decorator.** An interceptor loads the signed-in user onto the request, so protected routes stay clean.
- **A custom `@Serialize(Dto)` interceptor** that strips sensitive fields, such as the password hash, from every response.
- **Validation** with `class-validator`, for example year between 1930 and 2050, valid latitude/longitude, and bounded mileage and price.
- **Per-environment configuration**: `.env.development` and `.env.test` point at separate SQLite databases.
- **Unit tests** for services and controllers, with mocked dependencies.

## API

### Auth — `/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | – | Create an account and start a session |
| `POST` | `/auth/signin` | – | Sign in |
| `POST` | `/auth/signout` | – | End the session |
| `GET` | `/auth/whoami` | ✅ | Current user |
| `GET` | `/auth/:id` | – | Find a user by ID |
| `GET` | `/auth?email=` | – | Find users by email |
| `PATCH` | `/auth/:id` | – | Update a user |
| `DELETE` | `/auth/:id` | – | Delete a user |

### Reports — `/reports`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/reports` | ✅ | Submit a used-car sale report |

```json
{ "make": "toyota", "model": "corolla", "year": 2015,
  "mileage": 100000, "lng": 0, "lat": 0, "price": 12000 }
```

There are ready-to-run requests in `src/users/requests.http` and `src/reports/request.http` (for the VS Code REST Client).

## Getting started

```bash
npm install
npm run start:dev      # NODE_ENV=development → http://localhost:3000
npm test               # NODE_ENV=test
```

## Roadmap

- [ ] Price estimate endpoint (the average of similar reports by make, model, location and mileage)
- [ ] Admin approval of reports
- [ ] Move the cookie-session key to environment config, and switch to Postgres with migrations for production
