import { h } from 'preact'
import { connect } from 'react-redux'

import { buildCaptureStateKey } from '~utils/redux'
import { appendToTracking } from '../../Tracker'
import { localised } from '~locales'
import Confirm, { ConfirmProps } from './Confirm'
import { RootState } from '~types/redux'
import useSdkConfigurationService from '~contexts/useSdkConfigurationService'

const mapStateToProps = (
  { captures, globals: { isFullScreen, imageQualityRetries } }: RootState,
  { method, side }: ConfirmProps
) => ({
  capture: captures[buildCaptureStateKey({ method, side })],
  isFullScreen,
  imageQualityRetries,
})

const WrappedConfirm = (props: ConfirmProps) => {
  const sdkConfiguration = useSdkConfigurationService()

  return (
    <Confirm
      {...props}
      trackPropertiesBeforeMount={() => {
        console.log('trackBeforeMount')
        return {
          documentType: props.documentType,
          countryCode: props.idDocumentIssuingCountry?.country_alpha2,
          attemptCount: props.imageQualityRetries,
          maxRetryCount: sdkConfiguration.document_capture.max_total_retries,
          warningOrigin: 'iqs',
          // todo: add warning like so: document_warning: { blur: "warning", barcode: "warning, face: "warning"}
        }
      }}
    />
  )
}

console.log('appendToTracking0')
const TrackedConfirmComponent = appendToTracking(WrappedConfirm, 'confirmation')
console.log('appendToTracking1')
// @ts-ignore
const MapConfirm = connect(mapStateToProps)(localised(TrackedConfirmComponent))

const PoAFrontWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="poa" side="front" />
)

const DocumentFrontWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="document" side="front" />
)

const DocumentBackWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="document" side="back" />
)

const BaseFaceConfirm = (props: ConfirmProps) => (
  <MapConfirm {...props} method="face" />
)

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfirm = appendToTracking(DocumentBackWrapper, 'back')
const SelfieConfirm = appendToTracking(BaseFaceConfirm, 'selfie')
const FaceVideoConfirm = appendToTracking(BaseFaceConfirm, 'face_video')
const PoAConfirm = appendToTracking(PoAFrontWrapper, 'poa')

export {
  DocumentFrontConfirm,
  DocumentBackConfirm,
  SelfieConfirm,
  FaceVideoConfirm,
  PoAConfirm,
}
