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
  overrideConfiguration?: SdkConfiguration
}

const defaultConfiguration: SdkConfiguration = {
  experimental_features: {
    enable_multi_frame_capture: false,
  },
}

const SdkConfigurationServiceContext = createContext<SdkConfiguration>(
  defaultConfiguration
)

export const SdkConfigurationServiceProvider = ({
  children,
  url,
  token,
  fallback,
  overrideConfiguration = {},
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
            overrideConfiguration
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

export default useSdkConfigurationService
