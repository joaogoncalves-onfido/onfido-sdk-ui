import { h, FunctionComponent } from 'preact'
import { TranslateCallback } from '@onfido/active-video-capture'
import { Button } from '../Button'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { Wrapper } from '../Wrapper'
import { CameraIcon } from '../assets/CameraIcon'
import { BaseScreen } from '../BaseScreen'
import { localised } from '~locales'

interface Props {
  nextStep: () => void
  translate: TranslateCallback
}

const RecordingComplete: FunctionComponent<Props> = ({
  nextStep,
  translate,
}: Props) => {
  return (
    <BaseScreen>
      <Wrapper>
        <Header
          title={translate('avc_confirmation.title')}
          subtitle={translate('avc_confirmation.subtitle')}
        >
          <CameraIcon />
        </Header>
      </Wrapper>

      <Footer>
        <Button onClick={() => nextStep()}>
          {translate('avc_confirmation.button_primary_upload')}
        </Button>
      </Footer>
    </BaseScreen>
  )
}

export default localised(RecordingComplete)
