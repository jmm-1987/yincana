# Desplegar la yincana en el VPS Ubuntu

Guía preparada para el estado comprobado el 5 de octubre de 2026.
Ejecuta los comandos del servidor en la sesión SSH como `root`, bloque a bloque.
Si un paso falla, resuélvelo antes de continuar.

## 1. Punto de partida

- Ubuntu 24.04 LTS, 2 CPU y 1,8 GiB de RAM; aproximadamente 1,1 GiB disponibles.
- 68 GB de disco libres y 1 GB de swap.
- Nginx ya atiende los puertos 80 y 443.
- El proyecto Python existente usa Gunicorn en el puerto 5000.
- Supervisor gestiona `segurymat`, confirmado como `RUNNING`.
- Nginx sirve `segurymat.jm2-tech.es` y `www.segurymat.jm2-tech.es` mediante `/etc/nginx/sites-enabled/segurymat`, con destino `127.0.0.1:5000`.
- La web existente tiene HTTPS gestionado por Certbot. Comprueba el comando instalado y reutilízalo.
- El sitio `/etc/nginx/sites-enabled/default` es el predeterminado para HTTP. Se conserva.
- En la última comprobación no había Node.js ni npm. Si ya los instalaste, verifica su versión y omite la instalación.
- El puerto 3000 estaba libre; vuelve a comprobarlo antes de usarlo.

La yincana se ejecutará con su propio usuario y servicio systemd:

```text
Dominio de la yincana → Nginx (HTTPS) → Node.js (127.0.0.1:3000)
                                           ↓
                              /var/lib/yincana/yincana.sqlite

Dominio existente → configuración actual de Nginx → Gunicorn (:5000)
```

La nueva base empieza vacía. Esta guía no importa datos históricos de Supabase.

## 2. Datos que debes preparar

El dominio ya est? configurado. Sustituye ?nicamente la IP de ejemplo:

| Ejemplo | Valor que debes usar |
| --- | --- |
| `yincanas.jm2-tech.es` | Dominio real de producción de la yincana |
| `IP_DEL_VPS` | IP pública del servidor |

No uses el mismo nombre de dominio que ya sirve Python salvo que quieras cambiar su destino.
Usaremos `/opt/yincana/app` para el código y `/var/lib/yincana` para los datos.

Comprueba la configuración existente y guarda una copia antes de añadir el sitio:

```bash
ss -ltnp
supervisorctl status
nginx -T 2>&1 | grep -E 'configuration file|listen |server_name |proxy_pass |upstream '
nginx -t
cp -a /etc/nginx "/root/nginx-antes-yincana-$(date +%Y%m%d-%H%M%S)"
```

Comprueba la aplicación Python antes del despliegue:

```bash
supervisorctl status segurymat
curl -I https://segurymat.jm2-tech.es/
```

Anota su respuesta para compararla al terminar. Una redirección puede ser normal.
No edites ni deshabilites sus archivos en `sites-enabled`.

## 3. Instalar Node.js 24

```bash
node --version
npm --version
command -v node
```

El proyecto necesita Node.js 24 o posterior. La configuración del servicio de esta guía usa `/usr/bin/node`, la ruta de la instalación mediante NodeSource.
Si falta Node.js o su versión es anterior a 24:

```bash
apt update
apt install -y ca-certificates curl
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup_24.sh
```

Si la descarga termina correctamente:

```bash
bash /tmp/nodesource_setup_24.sh
apt install -y nodejs
node --version
npm --version
command -v node
```

Comprueba que devuelve `v24.x.x` y `/usr/bin/node`. npm viene incluido.
Instala también la herramienta de copias SQLite:

```bash
apt install -y sqlite3
```

## 4. Crear el usuario y las carpetas

Si estas rutas o el usuario ya existen de un intento anterior, comprueba su contenido antes de reutilizarlos.

```bash
id yincana
ls -ld /opt/yincana /var/lib/yincana
```

En una instalación nueva es normal que indiquen que no existen:

```bash
useradd --system --user-group --create-home --home-dir /opt/yincana --shell /usr/sbin/nologin yincana
install -d -o yincana -g yincana -m 0750 /opt/yincana/app
install -d -o yincana -g yincana -m 0700 /var/lib/yincana
```

## 5. Subir la versión actual desde Windows

Esta opción incluye los cambios locales de SQLite aunque aún no estén publicados en Git.
En **PowerShell de tu ordenador**, desde la carpeta del proyecto:

```powershell
cd C:\Users\jmm87\Trabajos\yincana\yincana
tar -czf yincana-deploy.tar.gz --exclude=.git --exclude=node_modules --exclude=.output --exclude=.nitro --exclude=.tanstack --exclude=dist --exclude=data --exclude=.env --exclude=.env.local --exclude=.env.production --exclude=.env.development --exclude=yincana-deploy.tar.gz .
scp .\yincana-deploy.tar.gz root@IP_DEL_VPS:/tmp/yincana-deploy.tar.gz
```

El archivo no incluye la base local ni las claves antiguas de Supabase. No necesita un archivo `.env` para funcionar en el VPS.

De nuevo en la **sesión SSH del VPS**, para la primera instalación:

```bash
tar -xzf /tmp/yincana-deploy.tar.gz -C /opt/yincana/app
chown -R yincana:yincana /opt/yincana/app
test -f /opt/yincana/app/package-lock.json
```

El último comando debe terminar sin error: se usa ese archivo para instalar las mismas dependencias.

## 6. Instalar, comprobar y compilar

```bash
runuser -u yincana -- sh -c 'cd /opt/yincana/app && npm ci'
runuser -u yincana -- sh -c 'cd /opt/yincana/app && npm run test:db'
runuser -u yincana -- sh -c 'cd /opt/yincana/app && npx tsc --noEmit'
runuser -u yincana -- sh -c 'cd /opt/yincana/app && npm run build'
ls -l /opt/yincana/app/.output/server/index.mjs
```

Compila en un momento de poco tráfico, porque comparte memoria y CPU con Python.
Si aparece `Killed`, revisa `free -h` y `journalctl -k -n 50`; puede indicar falta de memoria.
Si ocurre, compila en otra máquina Linux compatible y sube `.output`, conservando el mismo servicio y base de datos.

## 7. Crear el servicio de la yincana

Comprueba que el puerto sigue libre:

```bash
ss -ltnp 'sport = :3000'
```

Si aparece un proceso escuchando, elige otro puerto libre y úsalo tanto en el servicio como en `proxy_pass`.
En una instalación nueva crea `/etc/systemd/system/yincana.service`:

```bash
cat > /etc/systemd/system/yincana.service <<'EOF'
[Unit]
Description=Yincana de Merida - Node.js y SQLite
After=network.target

[Service]
Type=simple
User=yincana
Group=yincana
WorkingDirectory=/opt/yincana/app
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=3000
Environment=DATABASE_PATH=/var/lib/yincana/yincana.sqlite
ExecStart=/usr/bin/node /opt/yincana/app/.output/server/index.mjs
Restart=on-failure
RestartSec=5
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/yincana

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now yincana
systemctl status yincana --no-pager
curl -I http://127.0.0.1:3000/
```

El servicio debe estar `active (running)` y la web debe responder con HTTP 200.
Si falla:

```bash
journalctl -u yincana -n 80 --no-pager
```

SQLite se crea cuando se consulta o publica el primer resultado, no necesariamente al arrancar el proceso.

## 8. Apuntar el dominio al VPS

En el panel DNS de tu proveedor crea un registro:

| Tipo | Nombre | Destino |
| --- | --- | --- |
| A | `yincanas` dentro de la zona DNS `jm2-tech.es` | IP pública del VPS |

No cambies el registro del dominio de Python. Si el nuevo dominio tiene un registro AAAA, debe apuntar a una IPv6 funcional del VPS; un AAAA incorrecto puede impedir acceder o emitir el certificado.

Comprueba la resolución desde tu ordenador:

```powershell
Resolve-DnsName yincanas.jm2-tech.es
```

## 9. Añadir un sitio a Nginx

Comprueba que `/etc/nginx/sites-available/yincana` no es un archivo existente que necesites conservar.
El bloque siguiente ya utiliza el dominio real `yincanas.jm2-tech.es`:

```bash
cat > /etc/nginx/sites-available/yincana <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name yincanas.jm2-tech.es;

    access_log /var/log/nginx/yincana.access.log;
    error_log /var/log/nginx/yincana.error.log;
    client_max_body_size 1m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
ln -s /etc/nginx/sites-available/yincana /etc/nginx/sites-enabled/yincana
nginx -t
```

Solo si `nginx -t` termina correctamente:

```bash
systemctl reload nginx
curl -I -H 'Host: yincanas.jm2-tech.es' http://127.0.0.1/
```

La recarga aplica la configuración de forma gradual. Conserva el sitio Python y no añade un nuevo `default_server`.
Comprueba en el navegador tanto la yincana por HTTP como la web Python existente.

## 10. Firewall y HTTPS

Comprueba las reglas:

```bash
ufw status verbose
```

Si UFW está activo y no permite HTTP/HTTPS, añade:

```bash
ufw allow 'Nginx Full'
```

El firewall del proveedor también debe permitir 80 y 443. Node escucha solo en localhost: no abras el puerto 3000 al exterior.

Primero comprueba si ya hay Certbot, porque la web Python ya tiene HTTPS:

```bash
command -v certbot
certbot --version
```

Si ya está instalado, utiliza esa instalación. Si falta, instala la versión snap:

```bash
apt install -y snapd
snap install --classic certbot
/snap/bin/certbot --version
```

Con el DNS apuntando al servidor y la web accesible por HTTP:

```bash
certbot --nginx -d yincanas.jm2-tech.es --redirect
```

Si acabas de instalarlo y `certbot` no está en el PATH, usa `/snap/bin/certbot` en lugar de `certbot`.
Introduce tu correo y acepta los términos cuando se soliciten. Certbot configurará el certificado del nuevo dominio.

```bash
nginx -t
curl -I https://yincanas.jm2-tech.es/
certbot renew --dry-run
systemctl list-timers --all | grep -E 'certbot|snap.certbot'
```

Si falla la emisión, revisa DNS, registros AAAA y acceso público al puerto 80 antes de reintentarlo.

## 11. Validación final

1. Abre `https://yincanas.jm2-tech.es`.
2. Completa una partida y publica un resultado y comentario de prueba.
3. Comprueba que aparecen en la portada.
4. Verifica que se ha creado la base y consulta su integridad:

```bash
ls -lh /var/lib/yincana/
runuser -u yincana -- sqlite3 /var/lib/yincana/yincana.sqlite 'PRAGMA quick_check;'
systemctl restart yincana
```

5. Recarga la web y comprueba que el resultado sigue guardado.
6. Comprueba la web Python y confirma que su puerto y servicio siguen funcionando.

```bash
supervisorctl status segurymat
curl -I https://segurymat.jm2-tech.es/
```

```bash
ss -ltnp
supervisorctl status
systemctl status yincana --no-pager
```

## 12. Copias de seguridad

Después de crear la base, haz una copia consistente con SQLite:

```bash
install -d -m 0700 /var/backups/yincana
sqlite3 /var/lib/yincana/yincana.sqlite ".backup '/var/backups/yincana/yincana-$(date +%Y%m%d-%H%M%S).sqlite'"
```

No copies únicamente el archivo principal mientras se escribe: se utiliza WAL.
Para una copia diaria a las 03:15, según la zona horaria del VPS:

```bash
timedatectl
cat > /etc/cron.d/yincana-backup <<'EOF'
15 3 * * * root /usr/bin/sqlite3 /var/lib/yincana/yincana.sqlite ".backup '/var/backups/yincana/yincana-$(date +\%Y\%m\%d-\%H\%M\%S).sqlite'" && /usr/bin/chmod 600 /var/backups/yincana/*.sqlite
EOF
chmod 0644 /etc/cron.d/yincana-backup
```

Las copias se acumulan: revisa el espacio y establece una retención adecuada.
Descarga copias periódicamente fuera del VPS; una copia en el mismo disco no cubre la pérdida del servidor.
Para comprobar una copia:

```bash
sqlite3 /var/backups/yincana/NOMBRE_DE_LA_COPIA.sqlite 'PRAGMA integrity_check;'
```

Para restaurar, detén `yincana`, conserva aparte el archivo actual y sus archivos `-wal` y `-shm`, coloca la copia en `/var/lib/yincana/yincana.sqlite` con propietario `yincana:yincana` y permisos 0600, y arranca el servicio. No mezcles los archivos WAL antiguos con la copia restaurada.

## 13. Actualizar la aplicación

Genera y sube el archivo desde Windows siguiendo el paso 5. La base está fuera del código y se conserva.
Para una actualización sencilla habrá una breve interrupción de la yincana; Python seguirá con su servicio:

```bash
cp -a /opt/yincana/app/.output "/opt/yincana/output-anterior-$(date +%Y%m%d-%H%M%S)"
systemctl stop yincana
tar -xzf /tmp/yincana-deploy.tar.gz -C /opt/yincana/app
chown -R yincana:yincana /opt/yincana/app
runuser -u yincana -- sh -c 'cd /opt/yincana/app && npm ci && npm run test:db && npx tsc --noEmit && npm run build'
```

Si la compilación termina correctamente:

```bash
systemctl start yincana
curl -I http://127.0.0.1:3000/
journalctl -u yincana -n 30 --no-pager
```

Si falla, restaura el directorio `.output` guardado antes de arrancar el servicio. La extracción superpone archivos: si una futura actualización elimina o renombra archivos de código, utiliza una carpeta de versión nueva en vez de superponer el archivo sobre la instalación anterior.

## 14. Diagnóstico y retirada del nuevo sitio

```bash
journalctl -u yincana -n 100 --no-pager
tail -n 50 /var/log/nginx/yincana.error.log
systemctl status yincana --no-pager
nginx -t
```

- **502:** comprueba que el servicio está activo y responde en `127.0.0.1:3000`.
- **Error de escritura SQLite:** verifica propietario y permisos de `/var/lib/yincana`.
- **Se muestra Python al entrar al nuevo dominio:** verifica DNS y `server_name`.
- **No publica resultados:** consulta los logs; entra por el dominio HTTPS configurado y conserva las cabeceras del proxy.

Para deshabilitar solo la nueva aplicación conservando sus datos:

```bash
systemctl disable --now yincana
unlink /etc/nginx/sites-enabled/yincana
nginx -t
```

Solo si la validación es correcta:

```bash
systemctl reload nginx
```

## Referencias

- [Instalador de NodeSource para Node.js 24](https://github.com/nodesource/distributions/blob/master/scripts/deb/setup_24.x).
- [Comprobación y recarga de Nginx](https://nginx.org/en/docs/switches.html).
- [HTTPS con Certbot en Ubuntu](https://ubuntu.com/server/docs/how-to/security/obtain-tls-certificates/).
