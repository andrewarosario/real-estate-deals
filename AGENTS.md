# Repository instructions

## Git conventions

- Always use Conventional Commits for every commit.
- Format commit messages as `<type>(<optional-scope>): <imperative summary>`.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`.
- Review the staged changes before committing.
- Never create a non-conventional commit message.

Examples:

- `feat(deals): add purchase price filtering`
- `fix(auth): preserve the login session`
- `docs: document local development`
- `chore: update Angular dependencies`

## Testing

- Use Jest with `jest-preset-angular` for unit tests.
- Do not reintroduce Jasmine or Karma.
- Keep application coverage at 100% for statements, functions, and lines, and at least 90% for branches.
