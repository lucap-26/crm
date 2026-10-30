# Krexon · cosas pendientes

Última actualización: 30 de octubre de 2026

## Aplazado para más adelante (decidido)
- **Idiomas**: selector de idioma con versiones propias por idioma (`/en/`, `/fr/`, `/it/`, `/ca/`).
  Empezar por inglés. Traducción técnica y de la privacidad revisada por nativos o alguien del sector.
- **Aviso legal**: necesita razón social, CIF, domicilio y datos del Registro Mercantil (tomo, folio, hoja).

## Para confirmar con la empresa
- **Sociedad titular de Krexon**: la política de privacidad usa ILUTRARE SL (CIF B67259804),
  tomada de lanmoon.org. Confirmar que Krexon pertenece a esa sociedad.
- **Teléfono de WhatsApp**: confirmar que +34 623 968 619 tiene WhatsApp (en textos antiguos salía también +34 611 523 034).
- **Destino de los formularios**: dónde deben llegar (servicio de formularios o servidor propio). La web ya tiene la función preparada (`ENVIO.url`).
- **Revisión legal**: que un asesor o gestoría revise la política de privacidad (y el aviso legal cuando esté).

## Contenido
- **Foto de la Serie T** (corte de tubos): hay un detalle de la imagen que hay que cambiar (pendiente de que digas cuál).
- **Foto de la Serie S** (soldadura láser): hay un detalle de la imagen que hay que cambiar (pendiente de que digas cuál).
- **Catálogo `Tube.pdf`**: los nombres de modelo y una de las fotos llevan el prefijo «SF» (p. ej. SF6012T, SF6016S1), que es la nomenclatura de Senfeng, no de Krexon. Valorar pedir una versión con modelos Krexon.
- **Datos de la Serie HC** (PDF K3015HC): el formato ya es 3000 × 1500 mm; la web sigue mostrando 1,5–12 kW y 2.900 kg de la serie (el PDF: 1,5–6 kW y 1.100 kg).
- **Datos de la Serie HM** (PDF K3015HM): comprobar contra su PDF (12–30 kW según el nombre del archivo; la web muestra 6–30 kW).
- **Datos de la Serie C** (PDF K3015C): la web muestra 1,5–6 kW y formato hasta 6050 × 2030 mm; el PDF dice 3000 × 1500 mm, tubo 500–6000 mm y Ø 20–220 mm, 100 m/min y 1.100 kg.
- **Datos de la Serie NP semicerrada** (PDF K3015NP): el formato ya es 3000 × 1500 mm; la web sigue mostrando 1,5–12 kW y 30 mm de la serie (el PDF: 1,5–6 kW, 100 m/min y 1.100 kg).
- **Fichas en PDF**: faltan las de 10 máquinas (nombres esperados en `docs/LEEME.txt`). Plegadoras ya hecho: las tres usan `docs/krexon-catalogo-plegadoras-2026.pdf` (catálogo en inglés). K3015HC (antes Serie HC), K3015NP (cabina semicerrada, antes Serie NP) K3015HM y K3015C (corte combinado, antes Serie HM y Serie C) ya tienen su ficha. Corte de tubos (Serie T y Serie NT) usa el catálogo general `docs/Tube.pdf`. La NP de cabina abierta sigue sin PDF.
- **Foto `ws`** (soldadora portátil): se ve "SENFENG" en la bobina.
- **Códigos de modelo** en algunas fotos (p. ej. "SF-3015NP") que no coinciden con las series de la web.
- **Foto para "Recambios y consumibles"** (ahora sin foto propia).
- **Permiso de los proveedores** (Senfeng, Gweike) para usar sus textos y datos técnicos.

## Para subir la web a krexon.com
- Decidir alojamiento: **Vercel Pro** (de pago, publica solo) o **LucusHost** (ya contratado, subida manual).
- Acceso a **IONOS** (donde está el dominio). No tocar los registros MX ni TXT (correo de Google).
- Antes del cambio (trabajo técnico): meter logo, icono y vídeo dentro de la web (ahora se cargan de krexon.com/wp-content)
  y redirigir las direcciones antiguas (`/contacto/`, `/nosotros/`, `/servicios/`, `/corte-plancha-laser-fibra/`,
  `/corte-combinado-plancha-tubos-laser-fibra/`, `/home/`).
- Guardar las letras (Google Fonts) dentro de la web y quitar esa mención de la política de privacidad.
- No borrar WordPress ni LucusHost hasta comprobar que todo va bien.

## Reglas acordadas
- **PDF de máquinas**: cada PDF se guarda con su nombre en `docs/` y se enlaza a su máquina. Los nombres de las máquinas en la web se mantienen como «Serie …» (la empresa prefiere que se vea que es una serie con varios modelos).
- **Corte plano 2D**: el formato que se destaca es el 3015 (3000 × 1500 mm); en la ficha se indica que también hay 4020 (4000 × 2000 mm) y 6025 (6000 × 2500 mm).

## Copias de seguridad
- **Punto inicial**: ramas `punto-inicial` (web) y `punto-inicial-fuentes` (archivos de trabajo); publicado en `/index-v3.html`.
