---
version: alpha
name: Krexon
description: >-
  Distribuidor español de maquinaria industrial de corte por láser de fibra. Sistema visual
  inspirado en la estructura de fabricantes de primer nivel (referencia medida: tcicutting.com):
  la máquina es la protagonista, una sola tipografía en seminegrita, superficies neutras y un
  único color de acción.
colors:
  ink: '#1c1c1c'            # titulares y fondos oscuros (cabecera, secciones oscuras)
  ink-2: '#262626'
  text: '#3d3d3d'           # texto de lectura
  muted: '#6b6b6b'          # etiquetas pequeñas
  surface: '#ffffff'
  panel: '#f1f1f1'          # paneles redondeados (datos, accesos, tarjetas de apoyo)
  line: '#e1e1e1'
  brand: '#1f5a7e'          # azul Krexon (logotipo, enlaces, cifras)
  action: '#1b7686'         # único color de acción: botones principales (texto blanco, AA)
  action-hover: '#1f5a7e'
  rule: '#2997aa'           # raya vertical junto a los títulos de sección
typography:
  family: Figtree           # alternativa libre a Proxima Nova (la que usa la referencia)
  display:  { fontSize: 62px, fontWeight: 600, lineHeight: 1.08, letterSpacing: -0.01em }
  headline: { fontSize: 56px, fontWeight: 600, lineHeight: 1.1 }
  title:    { fontSize: 28px, fontWeight: 600, lineHeight: 1.2 }
  body:     { fontSize: 18px, fontWeight: 400, lineHeight: 1.6 }
  label:    { fontSize: 12px, fontWeight: 600, letterSpacing: 0.18em, textTransform: uppercase }
  nav:      { fontSize: 13px, fontWeight: 500, letterSpacing: 0.12em, textTransform: uppercase }
  button:   { fontSize: 14px, fontWeight: 700, letterSpacing: 0.04em, textTransform: uppercase }
rounded:
  button: 7px
  card: 10px
  panel: 20px
spacing:
  section: 110px
  panel-padding: 56px
  gutter: 28px
components:
  header: fondo ink, logotipo blanco, menú pequeño en mayúsculas espaciadas
  button-primary: fondo action, texto blanco, radio 7px, mayúsculas, chevron "›" al final
  button-ghost: (sobre foto o fondo oscuro) borde 2px claro, fondo translúcido
  section-head: etiqueta pequeña + titular grande, con raya vertical de 3px color rule a la izquierda
  machine-tile: foto de la máquina a sangre, degradado oscuro abajo y nombre en blanco
  stats-panel: panel gris claro redondeado (20px) con cifras grandes en ink y texto corto debajo
  machine-card: blanca, radio 10px, borde fino line; etiqueta de tipo en mayúsculas pequeñas grises
---

## Principios

1. **La máquina es la protagonista.** Las fotos de las máquinas (con el logo de Krexon) mandan;
   la interfaz alrededor es neutra: blanco, gris claro y casi negro.
2. **Una tipografía, un peso de titular.** Figtree 600 para todos los titulares, en frase normal
   (nunca todo en mayúsculas); las mayúsculas se reservan para etiquetas pequeñas, menú y botones.
3. **Un solo color de acción.** El turquesa oscuro `action` solo aparece en botones principales.
   El azul Krexon se usa para el logotipo, las cifras y los enlaces.
4. **Estructura que informa.** La raya vertical marca el inicio de cada sección; los paneles
   redondeados agrupan datos; no hay adornos sin función.
5. **Pensado para personas de taller de 40–50 años.** Texto de lectura a 18 px, botones de al
   menos 48 px de alto, contraste AA y acciones con el nombre exacto de lo que hacen.

## Qué no hacer

- No destacar una sola palabra del titular en otro color.
- No usar más de un color fuerte a la vez en la misma pantalla.
- No poner sombras pesadas: borde fino o sombra muy suave.
- No usar fotos de proveedor con su logotipo; solo las fotos con marca Krexon.
