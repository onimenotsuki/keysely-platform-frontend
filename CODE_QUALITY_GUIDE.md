# Code Quality Setup - Usage Guide

This project now has complete code quality tools configured including formatting, linting, and conventional commits.

## 🚀 Quick Start

### Available Commands

```bash
# Format all code files
bun run format

# Check if files are formatted correctly (without changing them)
bun run format:check

# Run ESLint to check for code issues
bun run lint

# Create a conventional commit (use this instead of git commit)
bun run commit

# Initialize Husky (already done, but available if needed)
bun run prepare
```

## 📋 Development Workflow

### 1. Making Changes

- Make your code changes as usual
- Stage your files with `git add`

### 2. Before Committing

The pre-commit hooks will automatically:

- Run ESLint on staged `.js`, `.jsx`, `.ts`, `.tsx` files
- Format code with Prettier
- Fix any auto-fixable issues

If there are linting errors that can't be auto-fixed, the commit will be blocked until you fix them.

### 3. Committing Changes

Instead of `git commit`, use:

```bash
bun run commit
```

This will guide you through creating a conventional commit with the proper format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 4. Manual Formatting (if needed)

```bash
# Format all files
bun run format

# Check formatting without changing files
bun run format:check
```

## ⚙️ Configuration Files Created

- **`.prettierrc`** - Prettier formatting rules
- **`.prettierignore`** - Files to exclude from formatting
- **`commitlint.config.js`** - Commit message linting rules
- **`.husky/pre-commit`** - Pre-commit hook for linting and formatting
- **`.husky/commit-msg`** - Commit message validation hook
- **`package.json`** - Updated with new scripts and configuration

## 🔧 What Was Installed

### Dependencies Added

- `prettier` - Code formatter
- `husky` - Git hooks manager
- `commitizen` - Interactive commit tool
- `@commitlint/cli` - Commit message linter
- `@commitlint/config-conventional` - Conventional commit rules
- `cz-conventional-changelog` - Commitizen adapter
- `lint-staged` - Run commands on staged files

## 🚦 Pre-commit Hooks

When you try to commit, the following will happen automatically:

1. **Staged TypeScript/JavaScript files** will be:
   - Linted with ESLint (with auto-fix)
   - Formatted with Prettier

2. **Staged JSON/CSS/Markdown files** will be:
   - Formatted with Prettier

3. **Commit messages** will be validated against conventional commit format

If any step fails, the commit will be blocked and you'll need to fix the issues.

## 📝 Conventional Commit Examples

```bash
feat: add user authentication system
fix: resolve payment processing bug
docs: update API documentation
style: format code according to prettier rules
refactor: reorganize component structure
test: add unit tests for booking system
chore: update dependencies
```

## 🛠️ Troubleshooting

### If pre-commit hooks don't run:

```bash
# Re-initialize Husky
bun run prepare
chmod +x .husky/*
```

### If you need to skip hooks (not recommended):

```bash
git commit --no-verify -m "emergency commit"
```

### If you get Prettier conflicts:

```bash
# Format everything
bun run format
git add .
git commit
```

## 🎯 Benefits

- **Consistent Code Style**: Prettier ensures all code follows the same formatting
- **Code Quality**: ESLint catches potential bugs and enforces best practices
- **Conventional Commits**: Clear, structured commit messages for better project history
- **Automated Workflow**: Pre-commit hooks catch issues before they reach the repository
- **Team Collaboration**: Everyone follows the same standards automatically

The setup is now complete and ready to use! 🎉
