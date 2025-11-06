# Guía de Uso: Configuración de Calidad de Código

Este proyecto cuenta con herramientas completas de calidad de código: formateo, linting y commits convencionales.

## 🚀 Inicio Rápido

### Comandos Disponibles

```bash
# Formatear todos los archivos
bun run format

# Verificar formateo sin modificar archivos
bun run format:check

# Ejecutar ESLint para encontrar problemas
bun run lint

# Crear un commit convencional (usar en lugar de git commit)
bun run commit

# Inicializar Husky (ya configurado; usar solo si es necesario)
bun run prepare
```

## 📋 Flujo de Desarrollo

### 1. Realiza Cambios

- Haz tus cambios de código como de costumbre
- Agrega archivos al stage con `git add`

### 2. Antes de Hacer Commit

Los hooks de pre-commit ejecutarán automáticamente:

- ESLint sobre archivos `.js`, `.jsx`, `.ts`, `.tsx`
- Formateo con Prettier
- Corrección de issues auto-fixables

Si hay errores que no pueden corregirse automáticamente, el commit será bloqueado hasta que los soluciones.

### 3. Hacer Commits

En lugar de `git commit`, utiliza:

```bash
bun run commit
```

Formatos soportados (Conventional Commits):

- `feat:` nueva funcionalidad
- `fix:` corrección de errores
- `docs:` documentación
- `style:` formateo (sin cambios de lógica)
- `refactor:` refactorización
- `test:` pruebas
- `chore:` tareas de mantenimiento

### 4. Formateo Manual (si es necesario)

```bash
# Formatear todos los archivos
bun run format

# Verificar formateo sin cambiar archivos
bun run format:check
```

## ⚙️ Archivos de Configuración

- `.prettierrc` — Reglas de formateo de Prettier
- `.prettierignore` — Exclusiones de Prettier
- `commitlint.config.js` — Reglas para validar mensajes de commit
- `.husky/pre-commit` — Hook de pre-commit para linting y formateo
- `.husky/commit-msg` — Hook para validar mensajes de commit
- `package.json` — Scripts y configuración

## 🔧 Dependencias Instaladas

### Herramientas

- `prettier` — Formateador de código
- `husky` — Gestor de Git hooks
- `commitizen` — Asistente interactivo para commits
- `@commitlint/cli` — Linter de mensajes de commit
- `@commitlint/config-conventional` — Reglas de Conventional Commits
- `cz-conventional-changelog` — Adaptador para Commitizen
- `lint-staged` — Ejecuta comandos sobre archivos staged

## 🚦 Hooks de Pre-commit

Al intentar hacer commit, ocurrirá lo siguiente:

1. Archivos TypeScript/JavaScript staged:
   - Se lintéan con ESLint (con auto-fix)
   - Se formatean con Prettier
2. Archivos JSON/CSS/Markdown staged:
   - Se formatean con Prettier
3. Mensajes de commit:
   - Se validan contra el formato convencional

Si alguna verificación falla, el commit se bloquea hasta resolver los problemas.

## 📝 Ejemplos de Commits Convencionales

```bash
feat: add user authentication system
fix: resolve payment processing bug
docs: update API documentation
style: format code according to prettier rules
refactor: reorganize component structure
test: add unit tests for booking system
chore: update dependencies
```

## 🛠️ Solución de Problemas

### Si los hooks no corren

```bash
bun run prepare
chmod +x .husky/*
```

### Si necesitas saltarte los hooks (no recomendado)

```bash
git commit --no-verify -m "emergency commit"
```

### Conflictos con Prettier

```bash
bun run format
git add .
git commit
```

## 🎯 Beneficios

- **Estilo consistente**: Prettier asegura formateo uniforme
- **Calidad de código**: ESLint detecta bugs y aplica buenas prácticas
- **Commits convencionales**: Historial claro y estructurado
- **Automatización**: Hooks evitan que problemas lleguen al repo
- **Colaboración**: Todo el equipo sigue los mismos estándares

¡La configuración está lista para usar! 🎉
