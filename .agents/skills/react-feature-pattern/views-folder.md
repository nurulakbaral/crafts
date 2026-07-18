# Views Folder

A guide for structuring component-based architecture in React.js with a clean, consistent flow.

## Conventions

### Naming Conventions

- File names for components should start with the feature or domain name using a dash separator. For example, given a `user` domain: write `user.tsx` for the main component, or `user-table.tsx` if the user has a table.

  > **Notes**
  > 
  > If a file name becomes too long, shorten it — don't force the naming convention.
  >
  > **Example**: A blog domain that includes user-related features.
  >
  > ```shell
  > components/
  >   ├── blog.tsx
  >   ├── blog-table.tsx
  >   ├── user-table.tsx
  >   └── user-actions.tsx
  > ```
- The component names follow PascalCase — `User` and `UserTable` respectively — and their prop types are named `TUserProps` and `TUserTableProps` respectively.


### Component and Types

```tsx
// Native HTML component
import * as React from 'react'

type TComponentNameProps = {} & React.HTMLProps<HTMLDivElement>

export function ComponentName({ ...props }: TComponentNameProps) {
  return (
    <div {...props}>{/* ... */}</div>
  )
}

// Using a UI component library (Mantine UI)
import * as React from 'react'
import { Box, type BoxProps, type ElementProps } from '@mantine/core'

type TComponentNameProps = {} & ElementProps<'div', keyof BoxProps> & BoxProps

export function ComponentName({ ...props }: TComponentNameProps) {
  return (
    <Box component="div" {...props}>{/* ... */}</Box>
  )
}

// Using a UI component library (Ant Design)
import * as React from 'react'
import { Button, type ButtonProps } from 'antd'

type TComponentNameProps = {} & ButtonProps

export function ComponentName({ ...props }: TComponentNameProps) {
  return (
    <Button {...props}>{/* ... */}</Button>
  )
}
```

**Guidelines:**

- Types should not be exported by default — only export types when they are used outside the module.
- Prefer `type` over `interface` for type definitions.
- Always extend the component's type with the parent component's props. When using a UI component library, extend with the library's props accordingly.
- Type names should start with `T` and end with the `Props` suffix, e.g. `TComponentNameProps`.
- Always use named export function declarations over function expressions.
- Always add `import * as React from 'react'` at the top of the file.
- Pass props to parent components using spread destructuring.
- Always refer to the official docs of whichever UI component library you are using.

## Main Render Component

For example: `user.tsx`

```tsx
// ==========================================================================================
// @Miscellaneous
// ==========================================================================================

// Hooks, validators, and local constants that belong to this file's context.
// Everything here is a candidate for future refactoring to a shared location.

const Variables = {
  dataColumn: [] as string[],
}

type TUseScrollOptions = {
  initial: number
}

function useScroll(options: TUseScrollOptions) {
  const states = React.useState(options.initial)
  return states
}

function validateUserPayload(data: unknown): boolean {
  return !!data
}

// ------------------------------------------------------------------------------------------
// User Form
// ------------------------------------------------------------------------------------------

type TUserFormProps = {
  form?: TUserForm
}

function UserForm({ form, ...props }: TUserFormProps) {
  return (
    <section {...props}>
      {/* ... */}
    </section>
  )
}

// ------------------------------------------------------------------------------------------
// User Table
// ------------------------------------------------------------------------------------------

type TUserTableProps = {
  data?: TUserList[]
  isLoading?: boolean
}

function UserTable({ data, isLoading, ...props }: TUserTableProps) {
  return (
    <section {...props}>
      {/* ... */}
    </section>
  )
}

// ------------------------------------------------------------------------------------------
// @Main — User
// ------------------------------------------------------------------------------------------

// Single export. Handles:
//   1. Dependency injection (services)
//   2. Data transformation (utilities, helpers, etc)
//   3. State and/or props distribution (passes shaped data down to sub-components)

function transformSpecificForUser() { /** ... */ }

type TUserProps = {
  className?: string
}

export function User({ ...props }: TUserProps) {
  const request = useRequest()
  const { form, rows } = transformSpecificForUser(request.data)

  return (
    <div {...props}>
      <UserForm form={form} />
      <UserTable data={rows} isLoading={request.isLoading} />
    </div>
  )
}
```

**Section rules:**
 
| Section | Purpose | Rules |
|---|---|---|
| `@Miscellaneous` | Temporary / refactorable helpers | Hooks, validators, local constants that belong to this file's context. Prefix with `@`. Everything here is a refactoring candidate. |
| Sub-components | Private child components | Pure function — given the same props, a sub-component must always render the same output. Avoid side effects. |
| `@Main — <Name>` | Public entry point | Handles DI, props distribution, and data transformation. Must be the last section and the only `export`. Prefix with `@Main —`. |


**When to Split a Sub-component into Its Own File:**
 
Extract a sub-component to `<kebab-name>.tsx` when **any** of these is true:
 
- The sub-component block exceeds **~200–300 lines**
- It is **reused** in more than one feature
- It has **its own sub-components** (nested children)

When you split, the new file follows this same skill — it gets its own `@Miscellaneous`,
sub-component blocks, and `@Main` section. Import it into the parent file and remove the
inline block.
