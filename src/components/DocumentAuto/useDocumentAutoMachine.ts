import { useMachine } from '@xstate/react'
import { assign, createMachine } from 'xstate'

interface Context {
  retries: number
  timeout: boolean
}

const documentAutoMachine = createMachine<Context>(
  {
    id: 'fetch',
    initial: 'idle',
    context: {
      retries: 0,
      timeout: false,
    },

    states: {
      idle: {
        on: {
          START: 'auto',
        },
      },
      auto: {
        invoke: {
          src: () => (cb) => {
            const timeout = setTimeout(() => cb('MANUAL'), 30000)
            return () => {
              clearTimeout(timeout)
            }
          },
        },
        on: {
          MANUAL: 'manual',
          RESOLVE: 'success',
          REJECT: 'failure',
        },
      },
      manual: {
        on: {
          RESOLVE: 'success',
          REJECT: 'failure',
        },
      },
      capture: {},
      success: {
        type: 'final',
      },
      failure: {
        on: {
          RETRY: {
            target: 'auto',
            actions: assign({
              retries: (context, event) => context.retries + 1,
            }),
          },
        },
      },
    },
  },
  {
    guards: {
      goManual: (context, event) => {
        return context.retries > 3 || context.timeout
      },
    },
  }
)

export const useDocumentAutoMachine = () => {
  return useMachine(documentAutoMachine)
}
