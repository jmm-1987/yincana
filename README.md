# Yincana de Mérida

Dominio de producción: https://yincanas.jm2-tech.es/.

React 19, TypeScript, TanStack Start, Tailwind CSS y SQLite en el servidor.
Requiere Node.js 24 o posterior. No necesita cuenta ni claves de Supabase.

## Desarrollo

    npm install
    npm run dev

En PowerShell usa npm.cmd si se bloquea npm.ps1.
SQLite crea automáticamente data/yincana.sqlite al consultar o publicar resultados.
Las funciones de servidor validan los datos y mantienen protección CSRF.
La publicación sigue siendo anónima; las puntuaciones enviadas por el cliente
no certifican que se hayan completado las pruebas.

## Producción en Ubuntu

La compilaci?n usa Nitro node-server:

    npm install
    npm run build
    DATABASE_PATH=/var/lib/yincana/yincana.sqlite HOST=127.0.0.1 PORT=3000 npm start

El usuario del servicio necesita escritura en /var/lib/yincana.
Configura las variables en systemd o tu gestor de procesos: Node no carga
el archivo .env automáticamente al arrancar el bundle.
Sirve la aplicación detrás de Nginx con HTTPS y apunta el dominio al VPS.
Mantén la base fuera del directorio de despliegue para conservar los datos al actualizar.
Este backend necesita Node.js y disco persistente.

## Copias de seguridad

Con sqlite3 instalado en Ubuntu:

    sqlite3 /var/lib/yincana/yincana.sqlite ".backup '/ruta/copias/yincana.sqlite'"

No copies solo el archivo principal mientras la aplicación escribe: utiliza WAL.
Conserva copias fuera del VPS y comprueba su restauraci?n.

## Comprobaciones

    npm run test:db
    npx tsc --noEmit
    npm run build

La base nueva empieza vacía. Los datos históricos de Supabase no se importan automáticamente.
Las migraciones en supabase/migrations son referencia histórica; la aplicación ya no las usa.
Usa npm con package-lock.json para instalar dependencias.
