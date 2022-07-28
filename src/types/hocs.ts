import type { ChallengePayload } from './api'
import type { DocumentSides } from './commons'
import type {
  SupportedLanguages,
  TranslatedTagParser,
  TranslateCallback,
} from './locales'
import type { RequestedVariant } from './steps'

export type WithChallengesProps = {
  challenges: ChallengePayload[]
  challengesId: string
}

export type WithLocalisedProps = {
  language?: SupportedLanguages
  parseTranslatedTags: TranslatedTagParser
  translate: TranslateCallback
  loading?: boolean
}

export type WithCameraDetectionProps = {
  hasCamera?: boolean | null
}

export type WithFailureHandlingProps = {
  onError?: (error: Error) => void
}

export type TrackScreenCallback = (
  screenNameHierarchy?: string | string[],
  properties?: Record<string, unknown>
) => void

export type TrackCallback = () => Record<string, unknown>

export type WithTrackingProps = {
  trackScreen: TrackScreenCallback
  trackPropertiesBeforeMount?: TrackCallback
}

export type WithCaptureVariantProps = {
  forceCrossDevice?: boolean
  isPoA?: boolean
  requestedVariant?: RequestedVariant
  side?: DocumentSides
}

export type WithPageIdProps = {
  pageId?: string
}

export type WithThemeProps = {
  back?: () => void
  disableNavigation?: boolean
}

export type WithPermissionsFlowProps = {
  hasGrantedPermission?: boolean
}

export type WithBlobPreviewProps = {
  blob: Blob
}

export type WithNavigationDisabledStateProps = {
  isNavigationDisabled?: boolean
}

export type WithNavigationDisabledActionProps = {
  setNavigationDisabled: (value: boolean) => void
}
