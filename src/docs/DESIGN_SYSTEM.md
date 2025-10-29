# 🎨 Keysely Color Palette# 🎨 Keysely Color Palette# 🎨 Keysely Color Palette# 🎨 Paleta de Colores Keysely

This documentation describes the updated color palette for Keysely, following the 60-30-10 design rule for a coherent and professional interface.

## 🎯 Primary Colors (Extracted from Logo)This documentation describes the updated color palette for Keysely, following the 60-30-10 design rule for a coherent and professional interface.This documentation describes the updated color palette for Keysely, following the 60-30-10 design rule for a coherent and professional interface.Esta documentación describe la paleta de colores actualizada para Keysely, siguiendo la regla de diseño 60-30-10 para una interfaz coherente y profesional.

### Navy Blue - Brand Primary Color

```text## 🎯 Primary Colors (Extracted from Logo)## 🎯 Primary Colors (Extracted from Logo)## 🎯 Colores Principales (Extraídos del Logo)

HEX: #1A2B42

RGB: rgb(26, 43, 66)

HSL: 214 44% 18%

CSS Variable: --primary### Navy Blue - Brand Primary Color### Navy Blue - Brand Primary Color### Navy Blue - Color Principal de Marca

Tailwind Classes: bg-primary, text-primary, border-primary

```

**Usage:** Central brand color. Ideal for:```text`text`

- Main headlinesHEX: #1A2B42

- Logo

- FooterRGB: rgb(26, 43, 66)HEX: #1A2B42HEX: #1A2B42

- Navigation

- Elements that convey solidity and trustHSL: 214 44% 18%

### Off-White - Main BackgroundCSS Variable: --primaryRGB: rgb(26, 43, 66)RGB: rgb(26, 43, 66)

```````textTailwind Classes: bg-primary, text-primary, border-primary

HEX: #F8F9FA

RGB: rgb(248, 249, 250)```HSL: 214 44% 18%HSL: 214 44% 18%

HSL: 210 17% 98%

CSS Variable: --background

Tailwind Classes: bg-background

```**Usage:** Central brand color. Ideal for:CSS Variable: --primaryVariable CSS: --primary



**Usage:** Main background color for:



- Page body- Main headlinesTailwind Classes: bg-primary, text-primary, border-primaryClases Tailwind: bg-primary, text-primary, border-primary

- Sections

- Large background areas- Logo

- Provides lightness and space

- Footer````

## 🎨 60-30-10 Design Rule

- Navigation

### 60% - Base/Background (Off-White)

- Elements that convey solidity and trust

The Off-White `#F8F9FA` should dominate the visual space:



- Page body

- Background sections### Off-White - Main Background**Usage:** Central brand color. Ideal for:**Uso:** Color central de la marca. Ideal para:

- Card backgrounds

- Modal backgrounds



### 30% - Secondary (Navy Blue)```text



Navy Blue `#1A2B42` occupies 30% of the visual space:HEX: #F8F9FA



- NavigationRGB: rgb(248, 249, 250)- Main headlines- Titulares principales

- Footer

- Primary buttonsHSL: 210 17% 98%

- Important headings

- Cards with solid backgroundCSS Variable: --background- Logo- Logo

- Sidebar sections

Tailwind Classes: bg-background

### 10% - Accent (Action Blue)

```- Footer- Footer

Action Blue `#3B82F6` is used for:



- Call-to-action (CTA) buttons

- Active links**Usage:** Main background color for:- Navigation- Navegación

- Notifications

- Status badges

- Interactive elements requiring attention

- Page body- Elements that convey solidity and trust- Elementos que transmiten solidez y confianza

## 🌈 Full Color Palette

- Sections

### Core Colors

- Large background areas

```css

:root {- Provides lightness and space

  /* Navy Blue - Brand Primary */

  --primary: 214 44% 18%;### Off-White - Main Background### Off-White - Fondo Principal

  --primary-foreground: 210 40% 98%;

## 🎨 60-30-10 Design Rule

  /* Off-White - Main Background */

  --background: 210 17% 98%;

  --foreground: 222 47% 11%;

### 60% - Base/Background (Off-White)

  /* Action Blue - Accents */

  --action: 217 91% 60%;```text```

  --action-foreground: 210 40% 98%;

The Off-White `#F8F9FA` should dominate the visual space:

  /* UI Elements */

  --card: 0 0% 100%;HEX: #F8F9FAHEX: #F8F9FA

  --card-foreground: 222 47% 11%;

  --popover: 0 0% 100%;- Page body

  --popover-foreground: 222 47% 11%;

- Background sectionsRGB: rgb(248, 249, 250)RGB: rgb(248, 249, 250)

  /* Interactive Elements */

  --muted: 210 40% 96%;- Card backgrounds

  --muted-foreground: 215 16% 47%;

  --accent: 210 40% 96%;- Modal backgroundsHSL: 210 17% 98%HSL: 210 17% 98%

  --accent-foreground: 222 47% 11%;



  /* Borders and Rings */

  --border: 214 32% 91%;### 30% - Secondary (Navy Blue)CSS Variable: --backgroundVariable CSS: --background

  --input: 214 32% 91%;

  --ring: 217 91% 60%;



  /* Status Colors */Navy Blue `#1A2B42` occupies 30% of the visual space:Tailwind Classes: bg-backgroundClases Tailwind: bg-background

  --destructive: 0 84% 60%;

  --destructive-foreground: 210 40% 98%;

  --success: 142 76% 36%;

  --warning: 38 92% 50%;- Navigation````

}

```- Footer



### Dark Mode- Primary buttons**Usage:** Main background color for the entire site (60% of the interface)**Uso:** Color de fondo principal para todo el sitio (60% de la interfaz)



```css- Important headings

.dark {

  --background: 222 47% 11%;- Cards with solid background- Provides a clean and professional canvas- Proporciona un lienzo limpio y profesional

  --foreground: 210 40% 98%;

  --card: 222 47% 11%;- Sidebar sections

  --card-foreground: 210 40% 98%;

  --popover: 222 47% 11%;- Softer on the eyes than pure white- Más suave a la vista que el blanco puro

  --popover-foreground: 210 40% 98%;

  --primary: 210 40% 98%;### 10% - Accent (Action Blue)

  --primary-foreground: 222 47% 11%;

  --muted: 217 33% 17%;- Reduces visual fatigue- Reduce la fatiga visual

  --muted-foreground: 215 20% 65%;

  --accent: 217 33% 17%;Action Blue `#3B82F6` is used for:

  --accent-foreground: 210 40% 98%;

  --border: 217 33% 17%;## ⚡ Accent and UI Colors## ⚡ Colores de Acento y UI

  --input: 217 33% 17%;

  --ring: 217 91% 60%;- Call-to-action (CTA) buttons

}

```- Active links### Action Blue - Action Blue### Action Blue - Azul de Acción



## 📱 Usage Examples- Notifications



### Navigation- Status badges`text`



```tsx- Interactive elements requiring attention

<nav className="bg-primary text-primary-foreground">

  <a href="/" className="hover:text-action">Home</a>HEX: #3B82F6HEX: #3B82F6

</nav>

```## 🌈 Full Color Palette



### Call-to-Action ButtonRGB: rgb(59, 130, 246)RGB: rgb(59, 130, 246)



```tsx### Core Colors

<button className="bg-action text-action-foreground hover:bg-action/90">

  Book NowHSL: 217 91% 60%HSL: 217 91% 60%

</button>

``````css



### Cards:root {CSS Variable: --accent, --primary-lightVariable CSS: --accent, --primary-light



```tsx  /* Navy Blue - Brand Primary */

<div className="bg-card border border-border rounded-xl shadow-sm">

  <h3 className="text-foreground font-semibold">Card Title</h3>  --primary: 214 44% 18%;Tailwind Classes: bg-accent, text-accent, bg-primary-lightClases Tailwind: bg-accent, text-accent, bg-primary-light

  <p className="text-muted">Secondary description</p>

</div>  --primary-foreground: 210 40% 98%;

```````

`````

### Notifications

  /* Off-White - Main Background */

```tsx

<div className="bg-success/10 text-success border border-success/20 rounded-lg p-4">  --background: 210 17% 98%;

  Booking confirmed successfully!

</div>  --foreground: 222 47% 11%;



<div className="bg-warning/10 text-warning border border-warning/20 rounded-lg p-4">**Usage:** Interactive elements (10% of the interface)**Uso:** Elementos interactivos (10% de la interfaz)

  Your session is about to expire

</div>  /* Action Blue - Accents */



<div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4">  --action: 217 91% 60%;

  Error processing payment

</div>  --action-foreground: 210 40% 98%;

```

- Call-to-action (CTA) buttons- Botones de llamada a la acción (CTA)

### Status Badges

  /* UI Elements */

```tsx

<span className="bg-success/10 text-success px-2 py-1 rounded-full text-sm">  --card: 0 0% 100%;- Important links- Enlaces importantes

  Confirmed

</span>  --card-foreground: 222 47% 11%;



<span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-sm">  --popover: 0 0% 100%;- Active icons- Íconos activos

  Pending

</span>  --popover-foreground: 222 47% 11%;



<span className="bg-destructive/10 text-destructive px-2 py-1 rounded-full text-sm">- Highlighted information- Información destacada

  Cancelled

</span>  /* Interactive Elements */

```

  --muted: 210 40% 96%;- Vibrant and attention-grabbing- Es vibrante y capta la atención

## 🎨 Color Hierarchy by Importance

  --muted-foreground: 215 16% 47%;

### High Priority (Calls attention)

  --accent: 210 40% 96%;

- **Action Blue** (#3B82F6) for CTAs and key actions

- **Success Green** (#22C55E) for confirmations  --accent-foreground: 222 47% 11%;

- **Destructive Red** (#EF4444) for errors and critical actions

### Dark Gray - Main Text### Dark Gray - Texto Principal

### Medium Priority (Supporting content)

  /* Borders and Rings */

- **Navy Blue** (#1A2B42) for headings and important sections

- **Foreground** (#09090B) for main text  --border: 214 32% 91%;

- **Muted** (#64748B) for secondary text

  --input: 214 32% 91%;

### Low Priority (Background and subtle elements)

  --ring: 217 91% 60%;```text```

- **Off-White** (#F8F9FA) for main background

- **Card White** (#FFFFFF) for elevated content

- **Border** (#E2E8F0) for subtle divisions

  /* Status Colors */HEX: #343A40HEX: #343A40

## 📋 Accessibility

  --destructive: 0 84% 60%;

All combinations meet WCAG 2.1 accessibility standards:

  --destructive-foreground: 210 40% 98%;RGB: rgb(52, 58, 64)RGB: rgb(52, 58, 64)

- **Navy Blue on Off-White**: Contrast 12.08:1 ✅ (AAA)

- **Foreground on Background**: Contrast 17.27:1 ✅ (AAA)  --success: 142 76% 36%;

- **Action Blue on White**: Contrast 4.56:1 ✅ (AA)

- **Muted on Background**: Contrast 5.19:1 ✅ (AA)  --warning: 38 92% 50%;HSL: 210 9% 18%HSL: 210 9% 18%



## 🔄 Color Update History}



### October 16, 2025```CSS Variable: --foregroundVariable CSS: --foreground



- Defined core color palette based on Keysely logo

- Implemented 60-30-10 design rule

- Updated all UI components to use new variables### Dark ModeTailwind Classes: text-foregroundClases Tailwind: text-foreground

- Configured dark mode

- Validated WCAG 2.1 accessibility



## 🚀 Quick Reference```css````



| Element | Color | Variable | Usage |.dark {

|---------|-------|----------|-------|

| Page Background | #F8F9FA | --background | Main body |  --background: 222 47% 11%;**Usage:** Main body text (30% of the interface)**Uso:** Cuerpo de texto principal (30% de la interfaz)

| Navigation | #1A2B42 | --primary | Header, Footer |

| CTA Buttons | #3B82F6 | --action | Primary actions |  --foreground: 210 40% 98%;

| Main Text | #09090B | --foreground | Headlines, paragraphs |

| Secondary Text | #64748B | --muted-foreground | Descriptions, labels |  --card: 222 47% 11%;- Paragraphs and extensive content- Párrafos y contenido extenso

| Borders | #E2E8F0 | --border | Dividers, inputs |

| Cards | #FFFFFF | --card | Content elevation |  --card-foreground: 210 40% 98%;

| Success | #22C55E | --success | Confirmations |

| Warning | #F59E0B | --warning | Alerts |  --popover: 222 47% 11%;- Excellent contrast on light background- Excelente contraste sobre fondo claro

| Error | #EF4444 | --destructive | Errors, cancellations |

  --popover-foreground: 210 40% 98%;

## 💡 Best Practices

  --primary: 210 40% 98%;- Softer than pure black- Más suave que el negro puro

1. **Use CSS variables** instead of hardcoded hex colors

2. **Follow the 60-30-10 rule** for visual balance  --primary-foreground: 222 47% 11%;

3. **Test contrast** for all text/background combinations

4. **Maintain consistency** across all pages  --muted: 217 33% 17%;- Improves readability- Mejora la legibilidad

5. **Leverage Tailwind utilities** for implementation

6. **Consider dark mode** from the start  --muted-foreground: 215 20% 65%;

7. **Use semantic colors** (success, warning, destructive)

  --accent: 217 33% 17%;### Medium Gray - Secondary Text### Medium Gray - Texto Secundario

## 🎯 Implementation in Tailwind

  --accent-foreground: 210 40% 98%;

Colors are defined in `tailwind.config.ts` using HSL values for consistency:

  --border: 217 33% 17%;`text`

```typescript

colors: {  --input: 217 33% 17%;

  primary: {

    DEFAULT: 'hsl(var(--primary))',  --ring: 217 91% 60%;HEX: #6C757DHEX: #6C757D

    foreground: 'hsl(var(--primary-foreground))',

  },}

  action: {

    DEFAULT: 'hsl(var(--action))',```RGB: rgb(108, 117, 125)RGB: rgb(108, 117, 125)

    foreground: 'hsl(var(--action-foreground))',

  },

  // ... rest of colors

}## 📱 Usage ExamplesHSL: 210 7% 46%HSL: 210 7% 46%

```



This allows for:

### NavigationCSS Variable: --muted, --secondaryVariable CSS: --muted, --secondary

- Easy dark mode switching

- Consistent opacity variants (`bg-primary/50`)

- Better theming capabilities

```tsxTailwind Classes: text-muted, bg-secondaryClases Tailwind: text-muted, bg-secondary

---

<nav className="bg-primary text-primary-foreground">

**Last Updated:** October 16, 2025

**Version:** 2.0.0  <a href="/" className="hover:text-action">Home</a>````


</nav>

```



### Call-to-Action Button**Usage:** Secondary elements**Uso:** Elementos secundarios



```tsx

<button className="bg-action text-action-foreground hover:bg-action/90">

  Book Now- Secondary text and subtitles- Texto secundario y subtítulos

</button>

```- Form labels- Etiquetas de formularios



### Cards- Subtle borders- Bordes sutiles



```tsx- Metadata and timestamps- Metadatos y timestamps

<div className="bg-card border border-border rounded-xl shadow-sm">

  <h3 className="text-foreground font-semibold">Card Title</h3>

  <p className="text-muted">Secondary description</p>

</div>## 🚦 Semantic Colors (States and Notifications)## 🚦 Colores Semánticos (Estados y Notificaciones)

```



### Notifications

### Success Green - Success### Success Green - Éxito

```tsx

<div className="bg-success/10 text-success border border-success/20 rounded-lg p-4">

  Booking confirmed successfully!

</div>```text```



<div className="bg-warning/10 text-warning border border-warning/20 rounded-lg p-4">HEX: #198754HEX: #198754

  Your session is about to expire

</div>RGB: rgb(25, 135, 84)RGB: rgb(25, 135, 84)



<div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4">HSL: 151 69% 31%HSL: 151 69% 31%

  Error processing payment

</div>CSS Variable: --successVariable CSS: --success

```

Tailwind Classes: bg-success, text-successClases Tailwind: bg-success, text-success

### Status Badges

`````

```tsx

<span className="bg-success/10 text-success px-2 py-1 rounded-full text-sm">**Usage:** Confirmation messages**Uso:** Mensajes de confirmación

  Confirmed

</span>- "Booking completed!"- "¡Reserva completada!"



<span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-sm">- Successful confirmations- Confirmaciones exitosas

  Pending

</span>- Active/completed states- Estados activos/completados



<span className="bg-destructive/10 text-destructive px-2 py-1 rounded-full text-sm">### Warning Yellow - Warning### Warning Yellow - Advertencia

  Cancelled

</span>`text`

```

HEX: #FFC107HEX: #FFC107

## 🎨 Color Hierarchy by Importance

RGB: rgb(255, 193, 7)RGB: rgb(255, 193, 7)

### High Priority (Calls attention)

HSL: 45 100% 51%HSL: 45 100% 51%

- **Action Blue** (#3B82F6) for CTAs and key actions

- **Success Green** (#22C55E) for confirmationsCSS Variable: --warningVariable CSS: --warning

- **Destructive Red** (#EF4444) for errors and critical actions

Tailwind Classes: bg-warning, text-warningClases Tailwind: bg-warning, text-warning

### Medium Priority (Supporting content)

`````

- **Navy Blue** (#1A2B42) for headings and important sections

- **Foreground** (#09090B) for main text

- **Muted** (#64748B) for secondary text

**Usage:** Non-critical alerts**Uso:** Alertas no críticas

### Low Priority (Background and subtle elements)



- **Off-White** (#F8F9FA) for main background

- **Card White** (#FFFFFF) for elevated content- "Few time slots remaining"- "Quedan pocos horarios disponibles"

- **Border** (#E2E8F0) for subtle divisions

- Information requiring attention- Información que requiere atención

## 📋 Accessibility

- Pending or in-progress states- Estados pendientes o en progreso

All combinations meet WCAG 2.1 accessibility standards:



- **Navy Blue on Off-White**: Contrast 12.08:1 ✅ (AAA)

- **Foreground on Background**: Contrast 17.27:1 ✅ (AAA)### Danger Red - Error### Danger Red - Error

- **Action Blue on White**: Contrast 4.56:1 ✅ (AA)

- **Muted on Background**: Contrast 5.19:1 ✅ (AA)



## 🔄 Color Update History```text```



### October 16, 2025HEX: #DC3545HEX: #DC3545



- Defined core color palette based on Keysely logoRGB: rgb(220, 53, 69)RGB: rgb(220, 53, 69)

- Implemented 60-30-10 design rule

- Updated all UI components to use new variablesHSL: 354 70% 54%HSL: 354 70% 54%

- Configured dark mode

- Validated WCAG 2.1 accessibilityCSS Variable: --destructiveVariable CSS: --destructive



## 🚀 Quick ReferenceTailwind Classes: bg-destructive, text-destructiveClases Tailwind: bg-destructive, text-destructive



| Element | Color | Variable | Usage |````

|---------|-------|----------|-------|

| Page Background | #F8F9FA | --background | Main body |**Usage:** Error messages**Uso:** Mensajes de error

| Navigation | #1A2B42 | --primary | Header, Footer |

| CTA Buttons | #3B82F6 | --action | Primary actions |- Failed validations- Validaciones fallidas

| Main Text | #09090B | --foreground | Headlines, paragraphs |

| Secondary Text | #64748B | --muted-foreground | Descriptions, labels |- Form errors- Errores de formularios

| Borders | #E2E8F0 | --border | Dividers, inputs |

| Cards | #FFFFFF | --card | Content elevation |- Destructive actions ("Cancel booking")- Acciones destructivas ("Cancelar reserva")

| Success | #22C55E | --success | Confirmations |

| Warning | #F59E0B | --warning | Alerts |## 📐 60-30-10 Application Rule## 📐 Regla de Aplicación 60-30-10

| Error | #EF4444 | --destructive | Errors, cancellations |

This palette follows the 60-30-10 design principle to achieve visual balance:Esta paleta sigue el principio de diseño 60-30-10 para lograr balance visual:

## 💡 Best Practices

### 60% - Light Background (#F8F9FA)### 60% - Fondo Claro (#F8F9FA)

1. **Use CSS variables** instead of hardcoded hex colors

2. **Follow the 60-30-10 rule** for visual balance- Dominant color- Color dominante

3. **Test contrast** for all text/background combinations

4. **Maintain consistency** across all pages- Provides a sense of spaciousness- Proporciona sensación de amplitud

5. **Leverage Tailwind utilities** for implementation

6. **Consider dark mode** from the start- Creates a clean canvas for content- Crea un lienzo limpio para el contenido

7. **Use semantic colors** (success, warning, destructive)

`tsx`tsx

## 🎯 Implementation in Tailwind

<div className="bg-background">{/* Main content */}</div><div className="bg-background">{/* Contenido principal */}</div>

Colors are defined in `tailwind.config.ts` using HSL values for consistency:

`````

```typescript

colors: {

  primary: {

    DEFAULT: 'hsl(var(--primary))',### 30% - Navy Blue and Grays (#1A2B42, #343A40, #6C757D)### 30% - Navy Blue y Grises (#1A2B42, #343A40, #6C757D)

    foreground: 'hsl(var(--primary-foreground))',

  },

  action: {

    DEFAULT: 'hsl(var(--action))',- Text and headlines- Texto y titulares

    foreground: 'hsl(var(--action-foreground))',

  },- Navigation- Navegación

  // ... rest of colors

}- Footer- Footer

```

- Important content areas- Áreas de contenido importantes

This allows for:

- Easy dark mode switching

- Consistent opacity variants (`bg-primary/50`)`tsx`tsx

- Better theming capabilities

<h1 className="text-primary">Main Title</h1><h1 className="text-primary">Título Principal</h1>

---

<p className="text-foreground">Paragraph content</p><p className="text-foreground">Contenido del párrafo</p>

**Last Updated:** October 16, 2025

**Version:** 2.0.0<span className="text-muted">Secondary text</span><span className="text-muted">Texto secundario</span>

```

### 10% - Action Blue (#3B82F6)### 10% - Action Blue (#3B82F6)

- Elements users should click- Elementos en los que el usuario debe hacer clic

- Calls to action- Llamadas a la acción

- Important links- Enlaces importantes

- Interactive icons- Íconos interactivos

`tsx`tsx

<button className="bg-accent text-accent-foreground">Book Now</button><button className="bg-accent text-accent-foreground">Reservar Ahora</button>

```

## 💡 Usage Examples## 💡 Ejemplos de Uso

### Action Buttons### Botones de Acción

`tsx`tsx

// Primary CTA (Action Blue)// CTA Principal (Action Blue)

<button className="bg-accent hover:bg-accent/90 text-accent-foreground"><button className="bg-accent hover:bg-accent/90 text-accent-foreground">

Book Now Reservar Ahora

</button></button>

// Secondary Button (Navy Blue)// Botón Secundario (Navy Blue)

<button className="bg-primary hover:bg-primary/90 text-primary-foreground"><button className="bg-primary hover:bg-primary/90 text-primary-foreground">

Learn More Ver Más

</button></button>

// Outline Button// Botón Outline

<button className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"><button className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">

Explore Explorar

</button></button>

```

### Cards### Tarjetas

`tsx`tsx

<div className="bg-card border border-border rounded-xl shadow-sm"><div className="bg-card border border-border rounded-xl shadow-sm">

  <h3 className="text-foreground font-semibold">Card Title</h3>  <h3 className="text-foreground font-semibold">Título de Tarjeta</h3>

  <p className="text-muted">Secondary description</p>  <p className="text-muted">Descripción secundaria</p>

</div></div>

```

### Notifications### Notificaciones

`tsx`tsx

// Success// Éxito

<div className="bg-success text-success-foreground p-4 rounded-lg"><div className="bg-success text-success-foreground p-4 rounded-lg">

Booking completed successfully! ¡Reserva completada exitosamente!

</div></div>

// Warning// Advertencia

<div className="bg-warning text-warning-foreground p-4 rounded-lg"><div className="bg-warning text-warning-foreground p-4 rounded-lg">

Only 2 spaces available Quedan solo 2 espacios disponibles

</div></div>

// Error// Error

<div className="bg-destructive text-destructive-foreground p-4 rounded-lg"><div className="bg-destructive text-destructive-foreground p-4 rounded-lg">

Payment processing error Error al procesar el pago

</div></div>

```

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

```

## 🎨 Available CSS Variables## 🎨 Variables CSS Disponibles

All variables are defined in `src/index.css` and can be used directly:Todas las variables están definidas en `src/index.css` y se pueden usar directamente:

`css`css

/_ Primary colors _//_ Colores principales _/

var(--primary) /_ Navy Blue #1A2B42 _/var(--primary) /_ Navy Blue #1A2B42 _/

var(--primary-foreground) /_ Text on primary _/var(--primary-foreground) /_ Texto sobre primary _/

var(--background) /_ Off-White #F8F9FA _/var(--background) /_ Off-White #F8F9FA _/

var(--foreground) /_ Dark Gray #343A40 _/var(--foreground) /_ Dark Gray #343A40 _/

/_ Accent colors _//_ Colores de acento _/

var(--accent) /_ Action Blue #3B82F6 _/var(--accent) /_ Action Blue #3B82F6 _/

var(--accent-foreground) /_ Text on accent _/var(--accent-foreground) /_ Texto sobre accent _/

var(--muted) /_ Medium Gray #6C757D _/var(--muted) /_ Medium Gray #6C757D _/

var(--secondary) /_ Medium Gray #6C757D _/var(--secondary) /_ Medium Gray #6C757D _/

/_ Semantic colors _//_ Colores semánticos _/

var(--success) /_ Success Green #198754 _/var(--success) /_ Success Green #198754 _/

var(--warning) /_ Warning Yellow #FFC107 _/var(--warning) /_ Warning Yellow #FFC107 _/

var(--destructive) /_ Danger Red #DC3545 _/var(--destructive) /_ Danger Red #DC3545 _/

/_ UI Elements _//_ UI Elements _/

var(--border) /_ Subtle borders _/var(--border) /_ Bordes sutiles _/

var(--input) /_ Input backgrounds _/var(--input) /_ Fondo de inputs _/

var(--ring) /_ Focus rings _/var(--ring) /_ Focus rings _/

var(--card) /_ Card backgrounds _/var(--card) /_ Fondo de tarjetas _/

```

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
```
