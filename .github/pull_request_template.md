# Pull Request

## 📝 Description

<!-- Provide a clear and concise description of your changes -->

### What does this PR do?

<!-- Explain the purpose and context of this PR -->

### Why is this change needed?

<!-- Explain the problem this PR solves or the feature it adds -->

## 🔗 Related Issues

<!-- Link related issues using keywords like: Fixes #123, Closes #456, Related to #789 -->

- Fixes #
- Related to #

## 🏷️ Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update (no functional changes)
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update
- [ ] 🔧 Configuration change
- [ ] 🌐 Internationalization/Localization

## 🧪 Testing

### How has this been tested?

<!-- Describe the tests you ran and how to reproduce them -->

- [ ] Manual testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

### Test Configuration

- **Browser(s):** <!-- e.g., Chrome 120, Safari 17, Firefox 121 -->
- **Device(s):** <!-- e.g., Desktop, iPhone 14, iPad -->
- **OS:** <!-- e.g., macOS 14.0, Windows 11 -->

## ✅ Checklist

<!-- Mark completed items with an 'x' -->

### Code Quality

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have removed any console.logs and debugging code

### Testing & Validation

- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested on multiple browsers (if UI changes)
- [ ] I have tested on mobile devices (if applicable)

### Build & Lint

- [ ] `bun run lint` passes without errors
- [ ] `bun run format:check` passes without errors
- [ ] `bun run build` completes successfully
- [ ] TypeScript compilation has no errors

### Dependencies

- [ ] I have added/updated necessary dependencies in `package.json`
- [ ] I have updated `bun.lockb` (by running `bun install`)
- [ ] All dependencies are necessary and properly justified

### Documentation

- [ ] I have updated the README.md (if needed)
- [ ] I have updated relevant documentation in `src/docs/` (if needed)
- [ ] I have added/updated JSDoc comments for new functions/components
- [ ] I have updated API documentation (if applicable)

### Security & Performance

- [ ] My changes do not introduce security vulnerabilities
- [ ] I have considered performance implications
- [ ] Sensitive data is not exposed in logs or errors
- [ ] Environment variables are properly configured

### Database & Backend

- [ ] I have created/updated Supabase migrations (if needed)
- [ ] I have updated RLS policies (if needed)
- [ ] Database changes are backwards compatible or properly migrated
- [ ] I have tested with production-like data

## 📸 Screenshots/Videos

<!-- If your changes affect the UI, please provide screenshots or videos -->

### Before

<!-- Screenshot/video of the UI before your changes -->

### After

<!-- Screenshot/video of the UI after your changes -->

## 💥 Breaking Changes

<!-- If this PR introduces breaking changes, list them here with migration steps -->

- [ ] This PR introduces breaking changes

<details>
<summary>Breaking Changes Details</summary>

<!-- Describe the breaking changes and provide migration guide -->

### What breaks?

### Migration Guide

</details>

## 🚀 Deployment Notes

<!-- Any special deployment considerations? -->

- [ ] Requires environment variable updates
- [ ] Requires database migration
- [ ] Requires Contentful updates
- [ ] Requires Stripe configuration changes
- [ ] Requires cache invalidation

<details>
<summary>Deployment Instructions</summary>

<!-- Provide step-by-step deployment instructions if needed -->

</details>

## 📋 Additional Context

<!-- Add any other context, considerations, or notes about the PR here -->

### Dependencies

<!-- List any PRs or external dependencies this PR depends on -->

### Follow-up Tasks

<!-- List any follow-up tasks or future improvements -->

## 👥 Reviewers

<!-- Tag specific team members for review if needed -->

@<!-- mention reviewers -->

---

## 📚 Resources

- [Code Quality Guide](./src/docs/CODE_QUALITY_GUIDE.md)
- [Design System](./src/docs/DESIGN_SYSTEM.md)
- [Database Diagrams](./src/docs/DATABASE_DIAGRAMS.md)
