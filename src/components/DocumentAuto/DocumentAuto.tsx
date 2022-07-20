import { h } from 'preact'
import { DocumentTypes } from '~types/steps'
import {
  HandleDocMultiFrameCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import { DocumentSides } from '~types/commons'
import { WithTrackingProps } from '~types/hocs'
import VideoCapture, { VideoOverlayProps } from '../VideoCapture'
import { DocumentOverlay } from '../Overlay'
import { useRef } from 'preact/compat'

import Webcam from 'react-webcam-onfido'
import { useDocumentAutoMachine } from './useDocumentAutoMachine'
export type DocumentAutoProps = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  onCapture: HandleDocMultiFrameCaptureProp
  side: DocumentSides
} & WithTrackingProps

export const DocumentAuto = ({
  cameraClassName,
  documentType,
  trackScreen,
  renderFallback,
  onCapture,
  side,
}: DocumentAutoProps) => {
  const webcamRef = useRef<Webcam | undefined>(undefined)
  const [current, send] = useDocumentAutoMachine()
  const renderVideoOverlay = (videoOverlayProps: VideoOverlayProps) => {
    return (
      <DocumentOverlay
        header={<div> {current.matches('inactive') ? 'Off' : 'On'}</div>}
        footer={<div onClick={() => send('START')}>Footer</div>}
      />
    )
  }

  return (
    <VideoCapture
      cameraClassName={cameraClassName}
      facing="environment"
      method="document"
      onRecordingStart={() => {}}
      onRedo={() => {}}
      onVideoCapture={() => {}}
      renderFallback={renderFallback}
      renderVideoOverlay={renderVideoOverlay}
      trackScreen={trackScreen}
      webcamRef={webcamRef}
    />
  )
}
