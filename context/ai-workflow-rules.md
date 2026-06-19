# Development Workflow

## Approach

Build and improve this project incrementally. Context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent behaviour that is not defined here.

When starting a new session, read `progress-tracker.md` first to understand current state before making any changes.

## Scoping Rules

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.
- Complete the current unit before starting the next.

## When to Split Work

Split an implementation step if it touches:

- Both UI changes and API/data changes simultaneously (unless they are trivially coupled)
- Multiple unrelated features or routes
- Behaviour that is not yet clearly defined in the context files

If a change cannot be verified end-to-end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behaviour that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing entirely, add it as an open question in `progress-tracker.md` before continuing.

## Protected Foundation Components

Do not modify files in `components/ui/` (shadcn/ui) unless a task explicitly requires it.

Apply feature-specific styling and behaviour in feature-level components that wrap or compose the foundation components.

## Keeping Docs in Sync

Update the relevant context file whenever the implementation introduces a change to:

- System architecture or boundaries
- Data model (Supabase schema / migrations)
- Authentication or permission logic
- Code conventions or standards
- Feature scope (something added, changed, or removed)

`progress-tracker.md` must reflect the actual state of the implementation, not the intended state.

## Before Moving to the Next Unit

1. The current unit works end-to-end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. `progress-tracker.md` has been updated to reflect the completed work.
4. Any new open questions or architecture decisions have been recorded.
