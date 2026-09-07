# Repository workflow rules

## Git worktree workflow (always follow this)

Never work directly on the `dev` branch's own checkout, and never merge into
`dev` from an unrelated or stale branch state. Instead, for every piece of
work that needs to land on `dev`:

1. **Pull** the latest `dev` branch (`git fetch origin dev`).
2. **Create a git worktree** off `dev` (e.g. `git worktree add ../<repo>-worktrees/dev dev`)
   and do the merge there — not in whatever branch/checkout you happened to
   be working in.
3. **Merge** the finished work into `dev` inside that worktree
   (`git merge --no-ff <feature-branch>`), verify it builds, then push
   `dev`.
4. **Delete the worktree only after the merge has been pushed successfully.**
   If the merge fails, has conflicts you can't resolve, or the push fails,
   leave the worktree in place until it's resolved — don't delete work you
   might still need.

This keeps `dev` merges reproducible and isolated from whatever else is
happening in the main checkout, and guarantees a worktree is never thrown
away before its merge is confirmed on the remote.
