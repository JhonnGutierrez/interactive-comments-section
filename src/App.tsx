import useLocalStorageData from './hooks/useLocalStorageData'
import Comment from './components/Comment'
import Input from './components/Input'
import { commentTypes } from './types'
import { useEffect } from 'react';

// import { currentUser, comments } from './data'

// console.log(currentUser)


function App() {
  const {data, currentUser, CRUD} = useLocalStorageData('comment-data') 

  useEffect(() => {
    window.scroll({top: document.body.scrollHeight, behavior: "auto"})
  }, [data])

  return (
    <div className="app">
      {data.map((comment:commentTypes, i) => {
      return (
        <Comment 
          key={comment.id+i}
          id={comment.id}
          profileImage={comment.profileImage}
          username={comment.username}
          createdAt={comment.createdAt}
          content={comment.content}
          commentScore={comment.commentScore}
          replies={comment.replies}
          currentUser={currentUser.username}
          storage={{data, currentUser, CRUD}}
        />
      )
    })}
      <Input 
        mode='create'
        action={CRUD.createComment}
        currentUser={currentUser}
      />
    </div>
  )
}

export default App
