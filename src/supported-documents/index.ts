/* eslint-disable @typescript-eslint/no-var-requires */
const supportedDrivingLicences = require('./supported-docs-driving_licence.json')
const supportedNationalIDCards = require('./supported-docs-national_identity_card.json')
const supportedResidencePermit = require('./supported-docs-residence_permit.json')

import type { CountryData, documentSelectionType } from '~types/commons'
import type { DocumentTypes } from '~types/steps'

type SourceData = {
  country_alpha2: string
  country_alpha3: string
  country: string
}

type FlagShapes = 'rectangle' | 'square'

const FLAGS_FOLDER_BY_SHAPE: Record<FlagShapes, string> = {
  rectangle: '4x3',
  square: '1x1',
}

export const getCountryFlagSrc = (
  countryCode: string,
  flagShape: FlagShapes
): string =>
  `${process.env.COUNTRY_FLAGS_SRC}${
    FLAGS_FOLDER_BY_SHAPE[flagShape]
  }/${countryCode.toLowerCase()}.svg`

export const getCountryDataForDocumentType = (
  countryCode: Optional<string>,
  documentType: Optional<DocumentTypes>
): Optional<CountryData> => {
  // Consistent with API, which accepts a 3-letter ISO country code for issuing_country param value
  if (countryCode && countryCode.length === 3) {
    const supportedCountriesList = getSupportedCountriesForDocument()
    const country = supportedCountriesList.find(
      (countryData) => countryData.country_alpha3 === countryCode
    )
    return country
  }
  return null
}

export const getSupportedCountriesForDocument = (
  filterList?: documentSelectionType[]
): CountryData[] => {
  const allSupportedSocumentTypes = supportedDrivingLicences
    .concat(supportedNationalIDCards)
    .concat(supportedResidencePermit)

  return filterList
    ? getCountriesList(allSupportedSocumentTypes).filter((el) => {
        return filterList.some((f) => {
          return f.issuing_country === el.country_alpha3
        })
      })
    : getCountriesList(allSupportedSocumentTypes)
}

const getCountriesList = (supportedDocsData: { sourceData: SourceData }[]) => {
  const countriesList: CountryData[] = supportedDocsData.map((docData) => {
    const { sourceData } = docData
    return {
      country_alpha2: sourceData.country_alpha2,
      country_alpha3: sourceData.country_alpha3,
      name: sourceData.country,
    }
  })

  const uniqueCountriesList = [
    ...new Map(
      countriesList.map((country) => [country.country_alpha3, country])
    ).values(),
  ]

  return uniqueCountriesList.sort((a, b) => a.name.localeCompare(b.name))
}
