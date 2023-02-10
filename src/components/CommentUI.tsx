import * as React from 'react';
import { useState } from 'react';
import ReplyIcon from '../assets/icons/ReplyIcon'
import MinusIcon from '../assets/icons/MinusIcon'
import PlusIcon from '../assets/icons/PlusIcon'
import DeleteIcon from '../assets/icons/DeleteIcon'
import EditIcon from '../assets/icons/EditIcon'
import type { commentTypes, replyCommentTypes } from '../types'
import Input from './Input';

const CommentUI = ({
    profileImage,
    username,
    createdAt,
    content,
    commentScore,
    replyingTo = '',
    fromCurrentUser = false,
    currentUser,
    storage,
    id,
    

}:commentTypes|replyCommentTypes) => {

    let [score, setScore] = useState(commentScore)
    let [replying, setReplying] = useState(false)
    let [editing, setEditing] = useState(false)

    React.useEffect(() => {
        if(storage){
            storage.CRUD.changeScore(id, score)
        }
    }, [score])

    const up = commentScore + 1
    const down = commentScore - 1

    function upScore () {
        if((score + 1) <= up) {
            setScore(prevScore => prevScore + 1)
        }
    }

    const downScore = () => {
        if(((score - 1) > 0) && ((score - 1) >= down)) {
            setScore(prevScore => prevScore - 1)
        }
    }

    const Reply = () => {
        return (
            <div className="comment__foot__reply">
                <button 
                    onClick={() => {
                        setReplying(!replying)
                    }}
                    className="comment__foot__reply__button">
                    <ReplyIcon />
                    Reply
                </button>
            </div>
        )
    }
    
    const Edit = () => {
        return (
            <div className="comment__foot__edit">
                <button 
                    // disabled={editing ? true : false}
                    onClick={() => {
                        if(storage) {
                            storage.CRUD.deleteComment(id)
                        } else {
                            console.error('storage is missing in comment component')
                        }
                    }}

                    className="comment__foot__edit__delete">
                    <DeleteIcon />
                    Delete
                </button>
                <button 
                    // disabled={editing ? true : false}
                    onClick={() => {
                        setEditing(!editing)
                    }}
                    className="comment__foot__edit__edit">
                    <EditIcon />
                    Edit
                </button>
            </div>
    
        )
    }

    return (
        <React.Fragment>
            <div className="comment">
                <div className="comment__head">
                    <img 
                        src={profileImage} 
                        alt="Profile image" 
                        className="comment__head__profile-img" />
                    <p className="comment__head__username">{username}</p>
                    {fromCurrentUser && <p className="comment__head__you">you</p>}
                    <p className="comment__head__created-at">{createdAt}</p>
                </div>
                <div className="comment__body">
                    <p className="comment__body__content">
                        {replyingTo && <span className="comment__body__content__replying-to">
                            @{replyingTo+' '} 
                        </span>}
                        {editing ? <div>
                                <textarea className="comment__body__content__editing" 
                                    onChange={(event) => {
                                        event.preventDefault();
                                        if(storage) {
                                            storage.CRUD.editComment(id, event.target.value)
                                        }
                                    }}
                                >
                                    {content}
                                </textarea> 
                            </div> : content}
                        {/* {content} */}
                    </p>
                </div>
                <div className="comment__foot">
                    <div className="comment__foot__score">
                        <button 
                            className="comment__foot__score__button"
                            onClick={() => {
                                upScore()
                            }}
                            >
                                <PlusIcon />
                            </button>
                        <p className="comment__foot__score__content">{score}</p>
                        <button 
                            className="comment__foot__score__button"
                            onClick={() => {
                                downScore()
                            }}
                            >
                                <MinusIcon />
                        </button>
                    </div>

                    { fromCurrentUser ? <Edit /> : <Reply />}

                    {/* buttons */}
                </div>
            </div>
        { (replying && storage) ? (<Input 
            setReplying={setReplying}
            action={storage.CRUD.createReplyComment}
            currentUser={storage.currentUser}
            parameters = {[id, username]}
            mode="reply"
            />) : false
        }    
        </React.Fragment>
    );
}

export default CommentUI;