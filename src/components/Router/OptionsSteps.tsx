import { Fragment, h } from 'preact'
import { StepConfig } from '~types/steps'
import { NarrowSdkOptions } from '~types/commons'
import useUserConsent from '~contexts/useUserConsent'

type OptionsStepsProps = {
  children: (steps: StepConfig[]) => React.ReactNode
  options: NarrowSdkOptions
}
export const OptionsSteps = ({
  children,
  options: { steps },
}: OptionsStepsProps) => {
  const { enabled, consents } = useUserConsent()

  if (!enabled || consents.every(({ required }) => !required)) {
    return <Fragment>{children(steps)}</Fragment>
  }

  const userConsent: StepConfig = {
    type: 'userConsent',
    skip: consents.every((c) => !c.required || (c.required && c.granted)),
  }

  const welcomeIndex = steps.findIndex(({ type }) => type === 'welcome')
  const userConsentIndex = welcomeIndex === -1 ? 0 : welcomeIndex + 1

  return (
    <Fragment>
      {children([
        ...steps.slice(0, userConsentIndex),
        userConsent,
        ...steps.slice(userConsentIndex),
      ])}
    </Fragment>
  )
}
