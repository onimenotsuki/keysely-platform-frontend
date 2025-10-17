# 🎨 Paleta de Colores Keysely

Esta documentación describe la paleta de colores actualizada para Keysely, siguiendo la regla de diseño 60-30-10 para una interfaz coherente y profesional.

## 🎯 Colores Principales (Extraídos del Logo)

### Navy Blue - Color Principal de Marca

```
HEX: #1A2B42
RGB: rgb(26, 43, 66)
HSL: 214 44% 18%
Variable CSS: --primary
Clases Tailwind: bg-primary, text-primary, border-primary
```

**Uso:** Color central de la marca. Ideal para:

- Titulares principales
- Logo
- Footer
- Navegación
- Elementos que transmiten solidez y confianza

### Off-White - Fondo Principal

```
HEX: #F8F9FA
RGB: rgb(248, 249, 250)
HSL: 210 17% 98%
Variable CSS: --background
Clases Tailwind: bg-background
```

**Uso:** Color de fondo principal para todo el sitio (60% de la interfaz)

- Proporciona un lienzo limpio y profesional
- Más suave a la vista que el blanco puro
- Reduce la fatiga visual

## ⚡ Colores de Acento y UI

### Action Blue - Azul de Acción

```
HEX: #3B82F6
RGB: rgb(59, 130, 246)
HSL: 217 91% 60%
Variable CSS: --accent, --primary-light
Clases Tailwind: bg-accent, text-accent, bg-primary-light
```

**Uso:** Elementos interactivos (10% de la interfaz)

- Botones de llamada a la acción (CTA)
- Enlaces importantes
- Íconos activos
- Información destacada
- Es vibrante y capta la atención

### Dark Gray - Texto Principal

```
HEX: #343A40
RGB: rgb(52, 58, 64)
HSL: 210 9% 18%
Variable CSS: --foreground
Clases Tailwind: text-foreground
```

**Uso:** Cuerpo de texto principal (30% de la interfaz)

- Párrafos y contenido extenso
- Excelente contraste sobre fondo claro
- Más suave que el negro puro
- Mejora la legibilidad

### Medium Gray - Texto Secundario

```
HEX: #6C757D
RGB: rgb(108, 117, 125)
HSL: 210 7% 46%
Variable CSS: --muted, --secondary
Clases Tailwind: text-muted, bg-secondary
```

**Uso:** Elementos secundarios

- Texto secundario y subtítulos
- Etiquetas de formularios
- Bordes sutiles
- Metadatos y timestamps

## 🚦 Colores Semánticos (Estados y Notificaciones)

### Success Green - Éxito

```
HEX: #198754
RGB: rgb(25, 135, 84)
HSL: 151 69% 31%
Variable CSS: --success
Clases Tailwind: bg-success, text-success
```

**Uso:** Mensajes de confirmación

- "¡Reserva completada!"
- Confirmaciones exitosas
- Estados activos/completados

### Warning Yellow - Advertencia

```
HEX: #FFC107
RGB: rgb(255, 193, 7)
HSL: 45 100% 51%
Variable CSS: --warning
Clases Tailwind: bg-warning, text-warning
```

**Uso:** Alertas no críticas

- "Quedan pocos horarios disponibles"
- Información que requiere atención
- Estados pendientes o en progreso

### Danger Red - Error

```
HEX: #DC3545
RGB: rgb(220, 53, 69)
HSL: 354 70% 54%
Variable CSS: --destructive
Clases Tailwind: bg-destructive, text-destructive
```

**Uso:** Mensajes de error

- Validaciones fallidas
- Errores de formularios
- Acciones destructivas ("Cancelar reserva")

## 📐 Regla de Aplicación 60-30-10

Esta paleta sigue el principio de diseño 60-30-10 para lograr balance visual:

### 60% - Fondo Claro (#F8F9FA)

- Color dominante
- Proporciona sensación de amplitud
- Crea un lienzo limpio para el contenido

```tsx
<div className="bg-background">{/* Contenido principal */}</div>
```

### 30% - Navy Blue y Grises (#1A2B42, #343A40, #6C757D)

- Texto y titulares
- Navegación
- Footer
- Áreas de contenido importantes

```tsx
<h1 className="text-primary">Título Principal</h1>
<p className="text-foreground">Contenido del párrafo</p>
<span className="text-muted">Texto secundario</span>
```

### 10% - Action Blue (#3B82F6)

- Elementos en los que el usuario debe hacer clic
- Llamadas a la acción
- Enlaces importantes
- Íconos interactivos

```tsx
<button className="bg-accent text-accent-foreground">Reservar Ahora</button>
```

## 💡 Ejemplos de Uso

### Botones de Acción

```tsx
// CTA Principal (Action Blue)
<button className="bg-accent hover:bg-accent/90 text-accent-foreground">
  Reservar Ahora
</button>

// Botón Secundario (Navy Blue)
<button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Ver Más
</button>

// Botón Outline
<button className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
  Explorar
</button>
```

### Tarjetas

```tsx
<div className="bg-card border border-border rounded-xl shadow-sm">
  <h3 className="text-foreground font-semibold">Título de Tarjeta</h3>
  <p className="text-muted">Descripción secundaria</p>
</div>
```

### Notificaciones

```tsx
// Éxito
<div className="bg-success text-success-foreground p-4 rounded-lg">
  ¡Reserva completada exitosamente!
</div>

// Advertencia
<div className="bg-warning text-warning-foreground p-4 rounded-lg">
  Quedan solo 2 espacios disponibles
</div>

// Error
<div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
  Error al procesar el pago
</div>
```

### Navegación y Footer

```tsx
// Header con fondo navy blue
<header className="bg-primary text-primary-foreground">
  <nav>{/* Contenido de navegación */}</nav>
</header>

// Footer
<footer className="bg-primary text-primary-foreground py-12">
  {/* Contenido del footer */}
</footer>
```

## 🎨 Variables CSS Disponibles

Todas las variables están definidas en `src/index.css` y se pueden usar directamente:

```css
/* Colores principales */
var(--primary)              /* Navy Blue #1A2B42 */
var(--primary-foreground)   /* Texto sobre primary */
var(--background)           /* Off-White #F8F9FA */
var(--foreground)           /* Dark Gray #343A40 */

/* Colores de acento */
var(--accent)               /* Action Blue #3B82F6 */
var(--accent-foreground)    /* Texto sobre accent */
var(--muted)                /* Medium Gray #6C757D */
var(--secondary)            /* Medium Gray #6C757D */

/* Colores semánticos */
var(--success)              /* Success Green #198754 */
var(--warning)              /* Warning Yellow #FFC107 */
var(--destructive)          /* Danger Red #DC3545 */

/* UI Elements */
var(--border)               /* Bordes sutiles */
var(--input)                /* Fondo de inputs */
var(--ring)                 /* Focus rings */
var(--card)                 /* Fondo de tarjetas */
```

## ✅ Beneficios de Esta Paleta

1. **Profesionalismo:** Navy Blue transmite confianza y estabilidad
2. **Legibilidad:** Alto contraste entre texto y fondo
3. **Accesibilidad:** Cumple con estándares WCAG
4. **Coherencia:** Sistema unificado con variables CSS
5. **Escalabilidad:** Fácil de mantener y extender
6. **Usabilidad:** Colores semánticos claros para estados
7. **Balance Visual:** Regla 60-30-10 aplicada correctamente

## 🔄 Migración desde Paleta Anterior

Si estás actualizando componentes existentes:

1. **Primary colors:** Se mantienen las clases, pero ahora usan Navy Blue
2. **Accent:** Ahora es más brillante (Action Blue) para mayor impacto
3. **Nuevos colores:** `warning` está disponible para casos de uso específicos
4. **Background:** Cambió a off-white para mayor suavidad visual

Los cambios son automáticos gracias al sistema de variables CSS. Solo necesitas actualizar componentes específicos que usen colores hardcodeados.

---

**Última actualización:** Octubre 2025  
**Diseñado para:** Ofikai Platform - Marketplace de espacios de trabajo
