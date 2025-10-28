# 🎨 Keysely Color Palette# 🎨 Paleta de Colores Keysely

This documentation describes the updated color palette for Keysely, following the 60-30-10 design rule for a coherent and professional interface.Esta documentación describe la paleta de colores actualizada para Keysely, siguiendo la regla de diseño 60-30-10 para una interfaz coherente y profesional.

## 🎯 Primary Colors (Extracted from Logo)## 🎯 Colores Principales (Extraídos del Logo)

### Navy Blue - Brand Primary Color### Navy Blue - Color Principal de Marca

`text`

HEX: #1A2B42HEX: #1A2B42

RGB: rgb(26, 43, 66)RGB: rgb(26, 43, 66)

HSL: 214 44% 18%HSL: 214 44% 18%

CSS Variable: --primaryVariable CSS: --primary

Tailwind Classes: bg-primary, text-primary, border-primaryClases Tailwind: bg-primary, text-primary, border-primary

````



**Usage:** Central brand color. Ideal for:**Uso:** Color central de la marca. Ideal para:



- Main headlines- Titulares principales

- Logo- Logo

- Footer- Footer

- Navigation- Navegación

- Elements that convey solidity and trust- Elementos que transmiten solidez y confianza



### Off-White - Main Background### Off-White - Fondo Principal



```text```

HEX: #F8F9FAHEX: #F8F9FA

RGB: rgb(248, 249, 250)RGB: rgb(248, 249, 250)

HSL: 210 17% 98%HSL: 210 17% 98%

CSS Variable: --backgroundVariable CSS: --background

Tailwind Classes: bg-backgroundClases Tailwind: bg-background

````

**Usage:** Main background color for the entire site (60% of the interface)**Uso:** Color de fondo principal para todo el sitio (60% de la interfaz)

- Provides a clean and professional canvas- Proporciona un lienzo limpio y profesional

- Softer on the eyes than pure white- Más suave a la vista que el blanco puro

- Reduces visual fatigue- Reduce la fatiga visual

## ⚡ Accent and UI Colors## ⚡ Colores de Acento y UI

### Action Blue - Action Blue### Action Blue - Azul de Acción

`text`

HEX: #3B82F6HEX: #3B82F6

RGB: rgb(59, 130, 246)RGB: rgb(59, 130, 246)

HSL: 217 91% 60%HSL: 217 91% 60%

CSS Variable: --accent, --primary-lightVariable CSS: --accent, --primary-light

Tailwind Classes: bg-accent, text-accent, bg-primary-lightClases Tailwind: bg-accent, text-accent, bg-primary-light

````



**Usage:** Interactive elements (10% of the interface)**Uso:** Elementos interactivos (10% de la interfaz)



- Call-to-action (CTA) buttons- Botones de llamada a la acción (CTA)

- Important links- Enlaces importantes

- Active icons- Íconos activos

- Highlighted information- Información destacada

- Vibrant and attention-grabbing- Es vibrante y capta la atención



### Dark Gray - Main Text### Dark Gray - Texto Principal



```text```

HEX: #343A40HEX: #343A40

RGB: rgb(52, 58, 64)RGB: rgb(52, 58, 64)

HSL: 210 9% 18%HSL: 210 9% 18%

CSS Variable: --foregroundVariable CSS: --foreground

Tailwind Classes: text-foregroundClases Tailwind: text-foreground

````

**Usage:** Main body text (30% of the interface)**Uso:** Cuerpo de texto principal (30% de la interfaz)

- Paragraphs and extensive content- Párrafos y contenido extenso

- Excellent contrast on light background- Excelente contraste sobre fondo claro

- Softer than pure black- Más suave que el negro puro

- Improves readability- Mejora la legibilidad

### Medium Gray - Secondary Text### Medium Gray - Texto Secundario

`text`

HEX: #6C757DHEX: #6C757D

RGB: rgb(108, 117, 125)RGB: rgb(108, 117, 125)

HSL: 210 7% 46%HSL: 210 7% 46%

CSS Variable: --muted, --secondaryVariable CSS: --muted, --secondary

Tailwind Classes: text-muted, bg-secondaryClases Tailwind: text-muted, bg-secondary

````



**Usage:** Secondary elements**Uso:** Elementos secundarios



- Secondary text and subtitles- Texto secundario y subtítulos

- Form labels- Etiquetas de formularios

- Subtle borders- Bordes sutiles

- Metadata and timestamps- Metadatos y timestamps



## 🚦 Semantic Colors (States and Notifications)## 🚦 Colores Semánticos (Estados y Notificaciones)



### Success Green - Success### Success Green - Éxito



```text```

HEX: #198754HEX: #198754

RGB: rgb(25, 135, 84)RGB: rgb(25, 135, 84)

HSL: 151 69% 31%HSL: 151 69% 31%

CSS Variable: --successVariable CSS: --success

Tailwind Classes: bg-success, text-successClases Tailwind: bg-success, text-success

````

**Usage:** Confirmation messages**Uso:** Mensajes de confirmación

- "Booking completed!"- "¡Reserva completada!"

- Successful confirmations- Confirmaciones exitosas

- Active/completed states- Estados activos/completados

### Warning Yellow - Warning### Warning Yellow - Advertencia

`text`

HEX: #FFC107HEX: #FFC107

RGB: rgb(255, 193, 7)RGB: rgb(255, 193, 7)

HSL: 45 100% 51%HSL: 45 100% 51%

CSS Variable: --warningVariable CSS: --warning

Tailwind Classes: bg-warning, text-warningClases Tailwind: bg-warning, text-warning

````



**Usage:** Non-critical alerts**Uso:** Alertas no críticas



- "Few time slots remaining"- "Quedan pocos horarios disponibles"

- Information requiring attention- Información que requiere atención

- Pending or in-progress states- Estados pendientes o en progreso



### Danger Red - Error### Danger Red - Error



```text```

HEX: #DC3545HEX: #DC3545

RGB: rgb(220, 53, 69)RGB: rgb(220, 53, 69)

HSL: 354 70% 54%HSL: 354 70% 54%

CSS Variable: --destructiveVariable CSS: --destructive

Tailwind Classes: bg-destructive, text-destructiveClases Tailwind: bg-destructive, text-destructive

````

**Usage:** Error messages**Uso:** Mensajes de error

- Failed validations- Validaciones fallidas

- Form errors- Errores de formularios

- Destructive actions ("Cancel booking")- Acciones destructivas ("Cancelar reserva")

## 📐 60-30-10 Application Rule## 📐 Regla de Aplicación 60-30-10

This palette follows the 60-30-10 design principle to achieve visual balance:Esta paleta sigue el principio de diseño 60-30-10 para lograr balance visual:

### 60% - Light Background (#F8F9FA)### 60% - Fondo Claro (#F8F9FA)

- Dominant color- Color dominante

- Provides a sense of spaciousness- Proporciona sensación de amplitud

- Creates a clean canvas for content- Crea un lienzo limpio para el contenido

`tsx`tsx

<div className="bg-background">{/* Main content */}</div><div className="bg-background">{/* Contenido principal */}</div>

````



### 30% - Navy Blue and Grays (#1A2B42, #343A40, #6C757D)### 30% - Navy Blue y Grises (#1A2B42, #343A40, #6C757D)



- Text and headlines- Texto y titulares

- Navigation- Navegación

- Footer- Footer

- Important content areas- Áreas de contenido importantes



```tsx```tsx

<h1 className="text-primary">Main Title</h1><h1 className="text-primary">Título Principal</h1>

<p className="text-foreground">Paragraph content</p><p className="text-foreground">Contenido del párrafo</p>

<span className="text-muted">Secondary text</span><span className="text-muted">Texto secundario</span>

````

### 10% - Action Blue (#3B82F6)### 10% - Action Blue (#3B82F6)

- Elements users should click- Elementos en los que el usuario debe hacer clic

- Calls to action- Llamadas a la acción

- Important links- Enlaces importantes

- Interactive icons- Íconos interactivos

`tsx`tsx

<button className="bg-accent text-accent-foreground">Book Now</button><button className="bg-accent text-accent-foreground">Reservar Ahora</button>

````



## 💡 Usage Examples## 💡 Ejemplos de Uso



### Action Buttons### Botones de Acción



```tsx```tsx

// Primary CTA (Action Blue)// CTA Principal (Action Blue)

<button className="bg-accent hover:bg-accent/90 text-accent-foreground"><button className="bg-accent hover:bg-accent/90 text-accent-foreground">

  Book Now  Reservar Ahora

</button></button>



// Secondary Button (Navy Blue)// Botón Secundario (Navy Blue)

<button className="bg-primary hover:bg-primary/90 text-primary-foreground"><button className="bg-primary hover:bg-primary/90 text-primary-foreground">

  Learn More  Ver Más

</button></button>



// Outline Button// Botón Outline

<button className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"><button className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">

  Explore  Explorar

</button></button>

````

### Cards### Tarjetas

`tsx`tsx

<div className="bg-card border border-border rounded-xl shadow-sm"><div className="bg-card border border-border rounded-xl shadow-sm">

  <h3 className="text-foreground font-semibold">Card Title</h3>  <h3 className="text-foreground font-semibold">Título de Tarjeta</h3>

  <p className="text-muted">Secondary description</p>  <p className="text-muted">Descripción secundaria</p>

</div></div>

````



### Notifications### Notificaciones



```tsx```tsx

// Success// Éxito

<div className="bg-success text-success-foreground p-4 rounded-lg"><div className="bg-success text-success-foreground p-4 rounded-lg">

  Booking completed successfully!  ¡Reserva completada exitosamente!

</div></div>



// Warning// Advertencia

<div className="bg-warning text-warning-foreground p-4 rounded-lg"><div className="bg-warning text-warning-foreground p-4 rounded-lg">

  Only 2 spaces available  Quedan solo 2 espacios disponibles

</div></div>



// Error// Error

<div className="bg-destructive text-destructive-foreground p-4 rounded-lg"><div className="bg-destructive text-destructive-foreground p-4 rounded-lg">

  Payment processing error  Error al procesar el pago

</div></div>

````

### Navigation and Footer### Navegación y Footer

`tsx`tsx

// Header with navy blue background// Header con fondo navy blue

<header className="bg-primary text-primary-foreground"><header className="bg-primary text-primary-foreground">

  <nav>{/* Navigation content */}</nav>  <nav>{/* Contenido de navegación */}</nav>

</header></header>

// Footer// Footer

<footer className="bg-primary text-primary-foreground py-12"><footer className="bg-primary text-primary-foreground py-12">

{/_ Footer content _/} {/_ Contenido del footer _/}

</footer></footer>

````



## 🎨 Available CSS Variables## 🎨 Variables CSS Disponibles



All variables are defined in `src/index.css` and can be used directly:Todas las variables están definidas en `src/index.css` y se pueden usar directamente:



```css```css

/* Primary colors *//* Colores principales */

var(--primary)              /* Navy Blue #1A2B42 */var(--primary)              /* Navy Blue #1A2B42 */

var(--primary-foreground)   /* Text on primary */var(--primary-foreground)   /* Texto sobre primary */

var(--background)           /* Off-White #F8F9FA */var(--background)           /* Off-White #F8F9FA */

var(--foreground)           /* Dark Gray #343A40 */var(--foreground)           /* Dark Gray #343A40 */



/* Accent colors *//* Colores de acento */

var(--accent)               /* Action Blue #3B82F6 */var(--accent)               /* Action Blue #3B82F6 */

var(--accent-foreground)    /* Text on accent */var(--accent-foreground)    /* Texto sobre accent */

var(--muted)                /* Medium Gray #6C757D */var(--muted)                /* Medium Gray #6C757D */

var(--secondary)            /* Medium Gray #6C757D */var(--secondary)            /* Medium Gray #6C757D */



/* Semantic colors *//* Colores semánticos */

var(--success)              /* Success Green #198754 */var(--success)              /* Success Green #198754 */

var(--warning)              /* Warning Yellow #FFC107 */var(--warning)              /* Warning Yellow #FFC107 */

var(--destructive)          /* Danger Red #DC3545 */var(--destructive)          /* Danger Red #DC3545 */



/* UI Elements *//* UI Elements */

var(--border)               /* Subtle borders */var(--border)               /* Bordes sutiles */

var(--input)                /* Input backgrounds */var(--input)                /* Fondo de inputs */

var(--ring)                 /* Focus rings */var(--ring)                 /* Focus rings */

var(--card)                 /* Card backgrounds */var(--card)                 /* Fondo de tarjetas */

````

## ✅ Benefits of This Palette## ✅ Beneficios de Esta Paleta

1. **Professionalism:** Navy Blue conveys trust and stability1. **Profesionalismo:** Navy Blue transmite confianza y estabilidad

2. **Readability:** High contrast between text and background2. **Legibilidad:** Alto contraste entre texto y fondo

3. **Accessibility:** Meets WCAG standards3. **Accesibilidad:** Cumple con estándares WCAG

4. **Consistency:** Unified system with CSS variables4. **Coherencia:** Sistema unificado con variables CSS

5. **Scalability:** Easy to maintain and extend5. **Escalabilidad:** Fácil de mantener y extender

6. **Usability:** Clear semantic colors for states6. **Usabilidad:** Colores semánticos claros para estados

7. **Visual Balance:** 60-30-10 rule correctly applied7. **Balance Visual:** Regla 60-30-10 aplicada correctamente

## 🔄 Migration from Previous Palette## 🔄 Migración desde Paleta Anterior

If you're updating existing components:Si estás actualizando componentes existentes:

1. **Primary colors:** Classes remain the same, but now use Navy Blue1. **Primary colors:** Se mantienen las clases, pero ahora usan Navy Blue

2. **Accent:** Now brighter (Action Blue) for greater impact2. **Accent:** Ahora es más brillante (Action Blue) para mayor impacto

3. **New colors:** `warning` is available for specific use cases3. **Nuevos colores:** `warning` está disponible para casos de uso específicos

4. **Background:** Changed to off-white for greater visual softness4. **Background:** Cambió a off-white para mayor suavidad visual

Changes are automatic thanks to the CSS variable system. You only need to update specific components using hardcoded colors.Los cambios son automáticos gracias al sistema de variables CSS. Solo necesitas actualizar componentes específicos que usen colores hardcodeados.

---

**Last Updated:** October 2025 **Última actualización:** Octubre 2025

**Designed for:** Keysely Platform - Workspace Marketplace**Diseñado para:** Ofikai Platform - Marketplace de espacios de trabajo
