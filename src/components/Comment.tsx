import CommentUI from "./CommentUI";
import type { commentTypes, replyCommentTypes } from '../types'

const Comment = ({
    profileImage,
    username,
    createdAt,
    content,
    commentScore,
    replyingTo = '',
    fromCurrentUser = false,
    currentUser,
    replies,
    id,
    storage

}:commentTypes) => {
    const haveReplies = () => {
        if(replies){
            if(replies.length > 0){
                return true
            } else return false
        } else false
    }
    return (
        <div>
            <CommentUI 
                id={id}
                profileImage={profileImage}
                username={username}
                createdAt={createdAt}
                content={content}
                commentScore={commentScore}
                replies={replies}
                replyingTo={replyingTo}
                currentUser={currentUser}
                fromCurrentUser={(username === currentUser)}
                storage={storage}
            />
            {haveReplies() &&
                <div className="comment__replies">
                    {replies?.map((reply, i) => {
                        return (
                            <Comment 
                                id={reply.id}
                                key={id+i}
                                profileImage={reply.profileImage}
                                username={reply.username}
                                createdAt={reply.createdAt}
                                content={reply.content}
                                commentScore={reply.commentScore}
                                replyingTo={reply.replyingTo}
                                currentUser={currentUser}
                                replies={[]}
                                fromCurrentUser={(reply.username === currentUser)}
                                storage={storage}
                            />
                        )
                    })}
                </div>
            }
        </ div>
    );
}

export default Comment;