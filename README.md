# Task Manager API

Este proyecto está enfocado en mostrar el funcionamiento y manejo de una API, donde el cliente se registra y sus datos se almacenan con encriptación, permitiéndole crear, modificar y borrar tareas.

## Tecnologías

- Node.js
- Express
- MySQL
- JWT (autenticación)
- bcryptjs (hash de contraseñas)

## Funcionalidades

- Registro y login de usuarios con JWT
- CRUD completo de tareas
- Cada usuario solo puede ver/editar/borrar sus propias tareas
- Filtros y paginación en el listado de tareas

## Requisitos previos

- Node.js (versión v24.18.0)
- MySQL corriendo localmente

## Instalación

1. Cloná el repo: `git clone https://github.com/GuionGN/task-manager-api`
2. Instalá dependencias: `npm install`
3. Creá la base de datos y corré `schema.sql` en tu cliente de MySQL
4. Copiá `.env.example` a `.env` y completá los valores reales
5. Corré el servidor: `npm start` (o `node src/app.js`, el comando que uses)

## Variables de entorno

Ver `.env.example` para la lista completa de variables necesarias.

## Endpoints

## Endpoints

### Auth

| Método | Ruta | Protegida | Body | Respuesta |
|--------|------|-----------|------|-----------|
| POST | `/auth/register` | No | `{ "name", "email", "password" }` | `201` — usuario creado + token |
| POST | `/auth/login` | No | `{ "email", "password" }` | `200` — usuario + token |

### Tasks

Todas las rutas de `/tasks` requieren el header `Authorization: Bearer <token>`.

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| POST | `/tasks` | `{ "title", "description"?, "status"? }` | `201` — tarea creada |
| GET | `/tasks?status=&page=&limit=` | — | `200` — lista de tareas (filtrable y paginada) |
| GET | `/tasks/:id` |  —   | `200` — tarea puntual / `404` si no existe o no es tuya |
| PUT | `/tasks/:id` | `{ "title"?, "description"?, "status"? }` (todos opcionales) | `200` — tarea actualizada / `404` |
| DELETE | `/tasks/:id` | — | `204` sin body / `404` |

`status` acepta únicamente: `pending`, `in_progress`, `completed`.

### Otros

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Chequeo de que el servidor está corriendo |