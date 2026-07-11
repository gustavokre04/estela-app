# Estela en la nube · compartir con tu grupo (Supabase)

Con esto, cada deportista tiene su cuenta y ve **solo sus datos**, y tú como
entrenador ves los de **todo tu grupo** (en modo lectura). La separación la
garantiza la base de datos, no el navegador.

Tiempo estimado: ~20 minutos, una sola vez.

---

## 1. Crea el proyecto en Supabase

1. Entra a **supabase.com**, crea una cuenta (gratis) y un proyecto nuevo.
2. Elige una contraseña de base de datos y guarda el proyecto.
3. Cuando termine de crearse, ve a **Project Settings → API** y copia:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - La clave **anon public**

---

## 2. Crea las tablas y las reglas de seguridad

1. En Supabase, abre **SQL Editor → New query**.
2. Pega **todo** el contenido de `schema.sql` y pulsa **Run**.
3. Debe decir *Success*. Con esto quedan creadas las tablas `profiles`,
   `groups` y `athlete_state`, y las reglas RLS que hacen que cada atleta solo
   acceda a lo suyo.

---

## 3. Conecta la app

En `index.html`, busca cerca del final del script estas dos líneas y rellénalas
con lo que copiaste en el paso 1:

```js
const SUPABASE_URL = "https://xxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";   // tu clave anon public
```

Vuelve a subir la app a tu hosting. La clave *anon* es pública por diseño: la
seguridad real la ponen las reglas RLS, no el ocultar la clave.

---

## 4. Conviértete en entrenador y crea tu grupo

1. Abre la app, ve a la pestaña **Cuenta** y **crea tu cuenta** (con tu email).
   Confirma el correo que te llega.
2. En Supabase → **SQL Editor**, averigua tu UUID:
   ```sql
   select id, name, role from public.profiles;
   ```
3. Conviértete en entrenador y crea tu grupo:
   ```sql
   update public.profiles set role='coach' where id='TU_UUID';
   insert into public.groups (name, coach_id) values ('Esquí náutico', 'TU_UUID');
   ```
4. Copia el `id` del grupo:
   ```sql
   select id, name from public.groups;
   ```

---

## 5. Añade a tus deportistas

1. Cada atleta abre la app, va a **Cuenta** y **crea su propia cuenta**.
   (Importante: que la creen ellos, con su consentimiento; así los datos son suyos.)
2. Cuando ya estén registrados, los asignas a tu grupo. En SQL Editor:
   ```sql
   -- ver quién se ha registrado
   select id, name, role from public.profiles;
   -- asignar un atleta a tu grupo
   update public.profiles set group_id='ID_DEL_GRUPO' where id='UUID_DEL_ATLETA';
   ```
3. Listo: en tu pestaña **Cuenta** aparecerá "Mi grupo" con cada atleta y un
   botón **Ver datos** para revisar su perfil completo en solo lectura.

---

## 6. Cómo funciona la sincronización

- Cada cambio que hace un atleta se guarda en su dispositivo y se sube a su
  cuenta en la nube automáticamente (con un pequeño retardo).
- Al entrar en otro dispositivo con su cuenta, sus datos bajan solos.
- La conexión con Garmin sigue igual: cada atleta sincroniza su propio Garmin
  con su backend, y esos datos entran en su cuenta.

---

## 7. Privacidad y responsabilidad (importante)

- Manejas datos de salud de otras personas. Pide su **consentimiento** antes de
  añadirlos a tu grupo, y déjales claro qué ves tú.
- Con las reglas RLS, un atleta **nunca** puede leer los datos de otro atleta.
  Solo el entrenador de su grupo puede leerlos, y solo en lectura.
- Si un atleta quiere irse, quítalo del grupo (`group_id = null`) o borra su
  cuenta desde Supabase → Authentication.
- El plan gratis **duerme el proyecto tras 7 días sin uso**; se despierta solo
  al volver a entrar. Si os molesta, el plan Pro (25 USD/mes) lo elimina.
- El plan gratis no hace copias de seguridad automáticas. Para un grupo pequeño
  no es crítico, pero tenlo en cuenta si los datos importan mucho.

---

## 8. Si algo falla

- **"row violates row-level security"** al guardar: normal si no has iniciado
  sesión; entra con tu cuenta.
- **El entrenador no ve a un atleta**: revisa que el atleta tenga el `group_id`
  correcto y que ya haya sincronizado al menos una vez.
- **La app dice "la nube no está configurada"**: te faltó rellenar
  `SUPABASE_URL` / `SUPABASE_ANON_KEY` en `index.html`.
