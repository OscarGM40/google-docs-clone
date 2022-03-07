import type { NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'
import Image from 'next/image'
import { getSession, useSession } from 'next-auth/client'
import Login from '../components/Login'
import Modal from '@material-tailwind/react/Modal'
import ModalBody from '@material-tailwind/react/ModalBody'
import ModalFooter from '@material-tailwind/react/ModalFooter'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import firebase from 'firebase'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'
import DocumentRow from '../components/DocumentRow'

const Home: NextPage = () => {
  /* me dirá si la session esta empty o undefined o no.Si no lo esta tengo acceso al avatar,image,name,... */
  const [session] = useSession()
  /* fijate que éste es el lugar idóneo para redirigir,no quiero que procese nada más,si no hay session debo salir de aqui */
  if (!session) return <Login />

  /* si si hay sesión ya empiezo con la lógica */
  const [input, setInput] = useState('')
  const [showModal, setShowModal] = useState(false)


  let [snapshot] = useCollectionOnce(
    db
      .collection('UserDocs')
      .doc(session.user?.email!)
      .collection('docs')
      .orderBy('timestamp', 'desc')
  )
  

  const createDocument = () => {
    if (!input.trim()) return
    /* recuerda que en NoSQL la estructura es collection-document-collection-document */
    db.collection('UserDocs').doc(session.user?.email!).collection('docs').add({
      fileName: input,
      /* siempre usar la timestamp del server para universalizar */
      /* fijate que engorroso era en la v8 */
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then((data) => {
      window.location.reload()
      setInput('')
      setShowModal(false)
    })
  }

  /* fijate como define JSX y luego simplemente lo llama,sin necesidad de que lo retorne una función */
  const modal = (
    <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="w-full outline-none"
          placeholder="Enter name of document"
          onKeyDown={(e) => e.key === 'Enter' && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="blue"
          buttonType="link"
          onClick={() => setShowModal(false)}
          ripple="dark"
        >
          Cancel
        </Button>
        <Button color="blue" onClick={createDocument} ripple="light">
          Create
        </Button>
      </ModalFooter>
    </Modal>
  )

  return (
    <div className="">
      <Head>
        <title>Google Docs Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {modal}
      <section className="bg-[#f8f9fa] px-10 pb-10">
        <div className="mx-auto max-w-3xl ">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-lg text-gray-700">Start a new document</h2>
            <Button
              color="gray"
              buttonType="outline"
              rounded={true}
              iconOnly={true}
              ripple="dark"
              className="border-0"
            >
              <Icon name="more_vert" size="3xl" />
            </Button>
          </div>

          <div
            className="relative h-52 w-40 cursor-pointer border-2 hover:border-blue-700"
            onClick={() => setShowModal(true)}
          >
            <Image src="/images/GoogleBlank.png" layout="fill" />
            <p className="ml-2 mt-2 text-sm font-semibold text-gray-700">
              Blank
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white px-10 md:px-0">
        <div className="mx-auto max-w-3xl py-8 text-sm text-gray-700 ">
          <div className="flex items-center justify-between pb-5">
            <h2 className="flex-grow font-medium">My Documents</h2>
            <p className="mr-12">Date created</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>
          {snapshot?.docs.map((doc) => (
            <DocumentRow
              key={doc.id}
              id={doc.id}
              fileName={doc.data().fileName}
              date={doc.data().timestamp}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

export const getServerSideProps = async (ctx: NextPageContext) => {
  const session = await getSession(ctx)
  return {
    props: {
      session,
    },
  }
}
