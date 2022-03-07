import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Login from '../../components/Login'
import Icon from '@material-tailwind/react/Icon'
import Button from '@material-tailwind/react/Button'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import TextEditor from '../../components/TextEditor'
import { NextPageContext } from 'next'

const Doc = () => {
  const [session] = useSession()
  if (!session) return <Login /> //recuerda redirigir lo antes posible

  const router = useRouter()
  const { id } = router.query
  // console.log(id,'id')

  const [snapshot, loadingSnapshot] = useDocumentOnce(
    db
      .collection('UserDocs')
      .doc(session.user?.email!)
      .collection('docs')
      .doc(id as string)
  )

  if (!loadingSnapshot && !snapshot?.data()?.fileName) {
    router.replace('/')
  }

  return (
    <div>
      <header className="flex items-center justify-between p-3 pb-1">
        <span onClick={() => router.push('/')} className="cursor-pointer">
          <Icon name="description" size="5xl" color="blue" />
        </span>
        <div className="flex-grow px-2">
          <h2 className="">{snapshot?.data()?.fileName}</h2>
          <div className="-ml-1 flex h-8 items-center space-x-1 text-sm text-gray-600">
            <p className="option">File</p>
            <p className="option">Edit</p>
            <p className="option">View</p>
            <p className="option">Insert</p>
            <p className="option">Format</p>
            <p className="option">Tools</p>
          </div>
        </div>
        <Button
          color="lightBlue"
          buttonType="filled"
          size="regular"
          className="hidden h-10 md:inline-flex"
          rounded={false}
          block={false}
          iconOnly={false}
          ripple="ligth"
        >
          <Icon name="people" size="md" />
          {''}SHARE
        </Button>
        <img
          src={session.user?.image!}
          className="ml-2 h-10 w-10 cursor-pointer rounded-full"
          alt=""
        />
      </header>

      <TextEditor />
    </div>
  )
}
export default Doc

export async function getServerSideProps(ctx:NextPageContext){
  const session = await getSession(ctx);

  return {
    props:{
      session
    }
  }
}