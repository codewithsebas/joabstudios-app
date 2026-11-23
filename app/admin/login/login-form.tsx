'use client'

import { useActionState } from 'react'
import { AdminButton } from '@/components/admin/ui/button'
import { Alert } from '@/components/admin/ui/alert'
import { Field, Input } from '@/components/admin/ui/field'
import { PasswordInput } from '@/components/admin/ui/password-input'
import { signIn, type LoginState } from '../auth-actions'

const initialState: LoginState = { error: null, email: '' }

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initialState)

  return (
    <form action={action} className="mt-7 space-y-4">
      <Field label="Correo" htmlFor="email">
        <Input
          // Remonta el campo tras un intento fallido para conservar el correo escrito.
          key={state.email}
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="tucorreo@ejemplo.com"
          defaultValue={state.email}
          required
          aria-invalid={Boolean(state.error) || undefined}
        />
      </Field>
      <Field label="Contraseña" htmlFor="password">
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          required
          autoFocus={Boolean(state.error)}
          aria-invalid={Boolean(state.error) || undefined}
        />
      </Field>

      {state.error ? <Alert tone="danger" title={state.error} /> : null}

      <AdminButton type="submit" size="lg" loading={pending} className="mt-2 w-full">
        {pending ? 'Entrando…' : 'Entrar'}
      </AdminButton>
    </form>
  )
}
