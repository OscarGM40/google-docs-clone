import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  { ssr: false }
  )
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const TextEditor = () => {
  const [session] = useSession()
  /* aun en js voy a necesitar iniciar el estado del editor con draft js ya que necesita una determinada estructura */
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const router = useRouter()
  const { id } = router.query

  /* de igual manera que se trae el event en un SyntethicEvent aqui me traeré el argumento editorState en cada cambio implicitamente.Es un objeto muy grande con muchas propiedades y eventos útiles,basicamente es el estado del editor. */
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)

    db.collection('UserDocs')
      .doc(session?.user?.email)
      .collection('docs')
      .doc(id)
      .set(
        {
          /* convertToRaw convierte a JSON Storable format */
          editorState: convertToRaw(editorState.getCurrentContent()),
        },
        { merge: true }
      )
  }

  const [snapshot] = useDocumentOnce(
    db.collection('UserDocs').doc(session?.user.email).collection('docs').doc(id)
  )

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(EditorState.createWithContent(convertFromRaw(snapshot?.data()?.editorState)))
    }
  }, [snapshot])

  return (
    <>
      <div className="min-h-screen bg-[#f8f9fa] pb-16">
        <Editor
          toolbarClassName="flex sticky top-0 !justify-center mx-auto"
          editorClassName="mt-5 bg-white shadow-lg max-w-4xl mx-auto mb-12 border p-10" //clases para estilos
          editorState={editorState} //getter para el estado
          onEditorStateChange={onEditorStateChange} //eventHandler
        />
      </div>
    </>
  )
}
export default TextEditor
