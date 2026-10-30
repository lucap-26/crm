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
- **Fichas en PDF**: faltan las de 16 máquinas (nombres esperados en `docs/LEEME.txt`). Plegadoras ya hecho: las tres usan `docs/krexon-catalogo-plegadoras-2026.pdf` (catálogo en inglés).
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

## Copias de seguridad
- **Punto inicial**: ramas `punto-inicial` (web) y `punto-inicial-fuentes` (archivos de trabajo); publicado en `/index-v3.html`.
