import Image from 'next/image'
import Button from '@material-tailwind/react/Button'
import { signIn } from 'next-auth/client'

type Props = {}

const Login = (props: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Image
        src="/images/GoogleDocsImg.png"
        width={300}
        height={350}
        objectFit="contain"
      />
      <Button
        className="-ml-3 w-48"
        color="blue"
        buttonType="filled"
        ripple="light"
        onClick={signIn}
      >
        Login
      </Button>
    </div>
  )
}
export default Login
