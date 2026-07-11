# Estela en tu iPhone (PWA)

Esta carpeta es tu app lista para instalar en el iPhone como si fuera nativa,
sin App Store. Contenido:

```
index.html              la app
manifest.webmanifest    identidad de la app (nombre, icono, color)
sw.js                   funcionamiento offline
icons/                  iconos de la app
```

---

## 1. Publícala con HTTPS (obligatorio para PWA)

Sube **toda la carpeta** (con la estructura tal cual) a cualquier hosting estático
con HTTPS. Opciones fáciles y gratuitas:

- **Netlify Drop** (netlify.com/drop): arrastra la carpeta y listo, te da una URL https.
- **Vercel** o **Cloudflare Pages**: conecta un repo o sube la carpeta.
- **GitHub Pages**: sube los archivos a un repo y actívalo.

Debe quedar accesible como `https://tudominio/index.html` (o la raíz).
El service worker **solo funciona sobre HTTPS**, por eso no vale abrir el archivo
local ni un servidor http sin cifrar.

---

## 2. Instálala en el iPhone

1. Abre la URL en **Safari** (tiene que ser Safari, no Chrome, para "Añadir a inicio").
2. Toca el botón **Compartir** (el cuadrito con la flecha hacia arriba).
3. **Añadir a pantalla de inicio**.
4. Confirma. Aparece el icono de Estela en tu pantalla de inicio.

Al abrirla desde ese icono se ve a pantalla completa, sin barra de Safari, con su
propio icono en el selector de apps. Funciona sin conexión (los datos que ya tengas
guardados se ven igual).

---

## 3. Que la sincronización con Garmin funcione desde el móvil (en cualquier lado)

Para que el botón *Sincronizar* funcione fuera de casa, tu backend de Garmin debe
estar en internet con **HTTPS** (una PWA https no puede leer un backend http).

La forma más sencilla: despliega el backend (carpeta `garmin-backend`) en un host
que dé HTTPS público y programa ahí el `garmin_sync.py`:

- **Render / Railway / Fly.io** (planes gratis): corre `server.py` como servicio web
  y `garmin_sync.py` como tarea programada. Te dan una URL `https://...`.
- **Raspberry Pi / PC en casa**: expónlo con **Cloudflare Tunnel** o **Tailscale**
  para tener HTTPS accesible desde el móvil sin abrir puertos.

Luego, en la app (Actividades → Sincronización automática), pon esa URL
`https://tu-backend/garmin.json` y tu clave, y activa "al abrir" para que se
actualice sola cada vez que entres.

> Alternativa sin servidor: si publicas `garmin_data.json` en el **mismo** hosting
> que la app, usa la URL `./garmin_data.json` (sin clave). Solo tienes que
> regenerar ese archivo periódicamente y volver a subirlo.

---

## 4. Sobre tus datos

- La app guarda todo en tu iPhone (localStorage). Persiste entre sesiones.
- iOS puede liberar ese almacenamiento si el espacio escasea o pasas mucho tiempo
  sin abrir la app. Por eso usa de vez en cuando **Respaldo** (arriba a la derecha)
  para bajar un JSON de seguridad, y ten en cuenta que la sincronización con Garmin
  vuelve a traer tus datos aunque se borren.
- Nada sale de tu teléfono salvo la llamada a tu propio backend de Garmin.

---

## 5. Actualizar la app más adelante

Cuando cambies algo, sube los archivos nuevos y, en `sw.js`, sube el número de
versión de la caché (`estela-v1` → `estela-v2`). Así el iPhone recoge la versión
nueva la próxima vez que abras la app.
