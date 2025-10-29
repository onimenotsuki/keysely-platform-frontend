# 🎨 Paleta de Colores de Keysely

Esta documentación describe la paleta de colores actualizada de Keysely siguiendo la regla 60-30-10 para lograr una interfaz coherente y profesional.

## 🎯 Colores Principales (extraídos del logo)

### Navy Blue — Color principal de marca

```text
HEX: #1A2B42
RGB: rgb(26, 43, 66)
HSL: 214 44% 18%
CSS Variable: --primary
Tailwind: bg-primary, text-primary, border-primary
```

Uso: encabezados, navegación, footer, elementos que transmiten solidez y confianza.

### Off-White — Fondo principal

```text
HEX: #F8F9FA
RGB: rgb(248, 249, 250)
HSL: 210 17% 98%
CSS Variable: --background
Tailwind: bg-background
```

Uso: fondo de página, secciones y áreas amplias.

### Action Blue — Acentos (acciones)

```text
HEX: #3B82F6
RGB: rgb(59, 130, 246)
HSL: 217 91% 60%
CSS Variable: --action
Tailwind: bg-action, text-action-foreground
```

Uso: botones CTA, enlaces activos, notificaciones, badges de estado.

## 📐 Regla 60-30-10

- 60% — Fondo (Off-White): base visual del layout
- 30% — Secundario (Navy Blue): navegación, encabezados, áreas importantes
- 10% — Acento (Action Blue): llamadas a la acción e interacciones clave

## 🌈 Paleta Completa (CSS Variables)

```css
:root {
  /* Principales */
  --primary: 214 44% 18%;
  --primary-foreground: 210 40% 98%;
  --background: 210 17% 98%;
  --foreground: 222 47% 11%;

  /* Acentos */
  --action: 217 91% 60%;
  --action-foreground: 210 40% 98%;

  /* UI */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 217 91% 60%;

  /* Estados */
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
}
```

### Modo Oscuro

```css
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --card: 222 47% 11%;
  --card-foreground: 210 40% 98%;
  --popover: 222 47% 11%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222 47% 11%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --accent: 217 33% 17%;
  --accent-foreground: 210 40% 98%;
  --border: 217 33% 17%;
  --input: 217 33% 17%;
  --ring: 217 91% 60%;
}
```

## ✅ Accesibilidad

- Navy Blue sobre Off-White: contraste AA/AAA
- Texto principal sobre fondo: contraste AAA
- Action Blue sobre blanco: contraste AA

## 🧩 Implementación en Tailwind

```typescript
// tailwind.config.ts (fragmento)
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  action: {
    DEFAULT: 'hsl(var(--action))',
    foreground: 'hsl(var(--action-foreground))',
  },
  // ...resto de colores
}
```

## 📱 Ejemplos de Uso

```tsx
// Navegación
<nav className="bg-primary text-primary-foreground">
  <a href="/" className="hover:text-action">Home</a>
</nav>

// Botón CTA
<button className="bg-action text-action-foreground hover:bg-action/90">
  Reservar ahora
</button>

// Tarjeta
<div className="bg-card border border-border rounded-xl shadow-sm">
  <h3 className="text-foreground font-semibold">Título</h3>
  <p className="text-muted">Descripción secundaria</p>
</div>
```

---

**Última actualización:** Octubre 2025  
**Versión:** 2.0.0
