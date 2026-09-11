# Manifiesto de Clientes — Frontend

SPA en React (Vite) que consume el microservicio de **Clientes**
(`ms-clientes`, Python + MySQL) del sistema de Logística y Entregas.

Diseño: pensado como un manifiesto de envío — cada cliente es una "etiqueta"
con su código de rastreo (`CLI-000001`) y sus direcciones se muestran como
paradas de entrega numeradas.

## Métodos REST que consume (mínimo 2 exigidos por el enunciado)

- `GET /clientes` — listar clientes en el manifiesto
- `GET /clientes/{id}` — ver la etiqueta/detalle de un cliente
- `POST /clientes` — registrar un cliente nuevo
- `PUT /clientes/{id}` — editar un cliente
- `DELETE /clientes/{id}` — eliminar un cliente
- `POST /clientes/{id}/direcciones` — agregar una parada de entrega
- `DELETE /direcciones/{id}` — quitar una parada de entrega

## Cómo correrlo en local

1. Asegúrate de que el backend `ms-clientes` esté corriendo (ver su propio
   README) y accesible en `http://localhost:8001`.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173`.

Si tu backend corre en otra URL, edita el archivo `.env`:
```
VITE_API_CLIENTES_URL=http://localhost:8001
```

## Build de producción

```bash
npm run build
```
Genera la carpeta `dist/` lista para desplegar.

## Despliegue en AWS Amplify (lo que pide el enunciado)

1. Sube este proyecto a un repositorio de GitHub público.
2. En AWS Amplify → "New app" → "Host web app" → conecta el repositorio.
3. Build settings (Amplify detecta Vite automáticamente, o usa esto):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```
4. En "Environment variables" de Amplify, define `VITE_API_CLIENTES_URL`
   apuntando a la URL pública de tu API Gateway (no a `localhost`), por
   ejemplo: `https://xxxx.execute-api.us-east-1.amazonaws.com`.

## Próximos pasos para completar el frontend del proyecto

Este frontend hoy solo consume Clientes. El enunciado pide que la página
consuma los 5 microservicios (incluyendo el analítico). Cuando tengan listos
Vehículos, Envíos, Seguimiento y Analytics, se puede:
- Agregar un archivo `api/` por cada microservicio (mismo patrón que
  `clientesApi.js`).
- Agregar pestañas o rutas nuevas en `App.jsx` para cada dominio.
- Armar una vista de "Consultas Analíticas" que combine datos de varios
  microservicios, como pide el ejemplo del enunciado.
