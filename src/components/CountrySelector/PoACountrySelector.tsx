import { h } from 'preact'
import { localised } from '~locales'
import { trackComponent } from 'Tracker'

import type { CountryData } from '~types/commons'
import { CountrySelectionBase, DocumentProps, Props } from '.'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepComponentBaseProps } from '~types/routers'
import usePoASupportedCountries from '~contexts/usePoASupportedCountries'

export type PoaProps = {
  poaDocumentType: string
  poaDocumentCountry: CountryData
} & Props &
  WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

class CountrySelection extends CountrySelectionBase {
  hasChanges = (prevProps: Props): boolean | undefined => {
    return (
      prevProps.poaDocumentType &&
      this.props.poaDocumentType !== prevProps.poaDocumentType
    )
  }

  getDocumentProps = (): DocumentProps => {
    const { poaDocumentCountry, poaDocumentType } = this.props

    return {
      documentCountry: poaDocumentCountry,
      documentType: poaDocumentType,
    }
  }

  updateCountry = (selectedCountry: CountryData): void => {
    this.props.actions.setPoADocumentCountry(selectedCountry)
  }

  resetCountry = () => {
    this.props.actions.resetPoADocumentCountry()
  }

  getSupportedCountries = (): CountryData[] => {
    return this.props.countryList || []
  }
}

const PoACountrySelection = (props: Props) => {
  const poaCountries = usePoASupportedCountries()

  const countries: CountryData[] = poaCountries.map((country) => ({
    country_alpha2: country.country_alpha2,
    country_alpha3: country.country_alpha3,
    name: country.country,
  }))

  return <CountrySelection {...props} countryList={countries} />
}

export default trackComponent(
  localised(PoACountrySelection),
  'poa_country_select'
)
