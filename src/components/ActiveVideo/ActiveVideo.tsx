import { ActiveVideoCapture, LivenessError, TrackingEvent } from '@onfido/active-video-capture'
import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { localised } from '~locales'
import type {
  WithLocalisedProps,
  WithPermissionsFlowProps,
  WithTrackingProps,
} from '~types/hocs'
import {
  CombinedActions,
  ActiveVideoCapture as ActiveVideoCapturePayload,
} from '~types/redux'
import type { StepComponentBaseProps } from '~types/routers'
import { addDeviceRelatedProperties } from '~utils'
import { randomId } from '~utils/string'
import withPermissionsFlow from 'components/CameraPermissions/withPermissionsFlow'
import FaceNotDetected from './FaceNotDetected'
import { trackComponent } from 'Tracker'

type Props = StepComponentBaseProps & {
  onUserMedia: () => void
} & WithLocalisedProps &
  WithPermissionsFlowProps &
  WithTrackingProps

const ActiveVideo: FunctionComponent<Props> = (props) => {
  const {
    nextStep,
    translate,
    actions,
    mobileFlow,
    hasGrantedPermission,
    onUserMedia,
    trackScreen,
  } = props
  const [error, setError] = useState<LivenessError | null>()
  const dispatch = useDispatch<Dispatch<CombinedActions>>()

  const onError = (error: LivenessError) => {
    setError(error)
  }

  const onSuccess = (event: { videoPayload: Blob }) => {
    const activeVideoCaptureData: ActiveVideoCapturePayload = {
      method: 'activeVideo',
      blob: event.videoPayload,
      id: randomId(),
      sdkMetadata: addDeviceRelatedProperties(
        { captureMethod: 'html5' },
        mobileFlow
      ),
    }

    dispatch(actions.createCapture(activeVideoCaptureData))

    nextStep()
  }

  const track = (event: TrackingEvent): void => {
    trackScreen(event)
  }

  if (error === LivenessError.FACE_DETECTION_TIMEOUT) {
    return (
      <FaceNotDetected restart={() => setError(null)} translate={translate} trackScreen={trackScreen}/>
    )
  } else if (error) {
    console.error(`Unsupported error: ${error}`)
  }

  // See: https://github.com/preactjs/preact/issues/2748
  return (
    <ActiveVideoCapture
      debug={true}
      translate={translate}
      track={() => {}}
      onError={onError}
      onSuccess={onSuccess}
      onUserMedia={onUserMedia}
      hasGrantedPermission={!!hasGrantedPermission}
      track={track}
    />
  )
}

export default trackComponent(localised(withPermissionsFlow(ActiveVideo)), 'face_liveness')
