import { getSdkConfiguration } from '~utils/onfidoApi'
import { useContext, useEffect, useState } from 'preact/compat'
import { h, ComponentChildren, createContext, Fragment } from 'preact'
import { SdkConfiguration } from '~types/api'
import deepmerge from 'deepmerge'

type SdkConfigurationServiceProviderProps = {
  children: ComponentChildren
  url?: string
  token?: string
  fallback?: ComponentChildren
  overrideConfiguration?: Partial<SdkConfiguration>
}

const defaultConfiguration: SdkConfiguration = {
  experimental_features: {
    enable_multi_frame_capture: false,
    motion_experiment: {
      enabled: false,
    },
  },
  sdk_features: {
    enable_require_applicant_consents: true,
    disable_cross_device_sms: true,
  },
  document_capture: {
    max_total_retries: 1,
  },
}

export const SdkConfigurationServiceContext = createContext<SdkConfiguration>(
  defaultConfiguration
)

export const SdkConfigurationServiceProvider = ({
  children,
  url,
  token,
  fallback,
  overrideConfiguration,
}: SdkConfigurationServiceProviderProps) => {
  const [configuration, setConfiguration] = useState<
    SdkConfiguration | undefined
  >(undefined)

  useEffect(() => {
    if (!url || !token) {
      return
    }
    getSdkConfiguration(url, token)
      .then((apiConfiguration) =>
        setConfiguration(
          deepmerge(
            deepmerge(defaultConfiguration, apiConfiguration),
            // TODO: Cleanup the overrideConfigurationState and add it to the mock server
            process.env.NODE_ENV === 'production' || !overrideConfiguration
              ? {}
              : overrideConfiguration
          )
        )
      )
      .catch(() => setConfiguration(defaultConfiguration))
  }, [url, token, overrideConfiguration])

  if (!configuration) {
    return <Fragment>{fallback}</Fragment>
  }

  return (
    <SdkConfigurationServiceContext.Provider value={configuration}>
      {children}
    </SdkConfigurationServiceContext.Provider>
  )
}

const useSdkConfigurationService = () => {
  return useContext(SdkConfigurationServiceContext)
}

export const withSdkConfigurationService = (Comp) => (props, children) => {
  return (
    <SdkConfigurationServiceContext.Consumer>
      {(sdkConfiguration) => {
        return (
          <Comp {...props} sdkConfiguration={sdkConfiguration}>
            {children}
          </Comp>
        )
      }}
    </SdkConfigurationServiceContext.Consumer>
  )
}

export default useSdkConfigurationService
