import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconMicrophone: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12"
          fill={sdkOptions?.customUI?.colorIcon || '#353FF4'}
        />
        <path
          d="M12 15c1.656 0 3-1.376 3-3.074V6.074C15 4.376 13.656 3 12 3S9 4.376 9 6.074v5.852C9 13.624 10.344 15 12 15"
          fill="#FEFEFE"
        />
        <path
          d="M16.277 12c0 2.594-1.914 4.695-4.277 4.695-2.363 0-4.277-2.101-4.277-4.695H6c0 3.281 2.189 5.994 5.05 6.494V22h1.9v-3.506C15.81 17.994 18 15.281 18 12h-1.723z"
          fill="#FEFEFE"
        />
      </g>
    </svg>
  )
}

export default IconMicrophone
