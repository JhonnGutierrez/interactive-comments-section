import { useState } from "react";
import { comments, currentUser } from "../data";
import type { commentTypes, replyCommentTypes, useLocalStorageData } from "../types";

const createID = (): number => {
    return Math.floor(Math.random() * 999999999);
}

// uncomment down for reset the comments
// localStorage.setItem('comment-data', JSON.stringify(comments))


function useLocalStorageData(key:string) {
    const localStorage = window.localStorage

    //initialize data
    const isEmpty = localStorage.getItem(key) 
    let commentsData: commentTypes[] 
    if ( isEmpty === null ) {
        localStorage.setItem(key, JSON.stringify(comments))
        
        commentsData = isEmpty ? JSON.parse(isEmpty) : []
    } else commentsData = JSON.parse(isEmpty)

    const [data, setData] = useState(commentsData)

    // Save data Function
    const saveData = () => {
        localStorage.setItem(key, JSON.stringify(commentsData))
        setData(commentsData)
        location.reload()
    }

    interface searchedCommentType {
        searchedComment: commentTypes|replyCommentTypes,
        isAReply: boolean,
        index: number,
        parentIndex?: number
    }

    // search comment function
    function searchComment (commentToSearchId:number):searchedCommentType|undefined {
        const allReplies:replyCommentTypes[] = []
        commentsData.forEach((comment) => {
            if(comment.replies) {
                allReplies.push(...comment.replies)
            }
        })
        const dataFlat: (commentTypes|replyCommentTypes)[] = [...commentsData, ...allReplies]
        let commentExist: boolean = (() => {
            const i = dataFlat.findIndex((comment) => comment.id === commentToSearchId)
            return (i === -1) ? false : true
        })()

        let returnObject:searchedCommentType

        try {
            if( commentExist ) {
                const commentIndex = commentsData.findIndex((comment) => comment.id === commentToSearchId)

                if(commentIndex !== -1) {
                    returnObject = {
                        searchedComment: commentsData[commentIndex] as commentTypes,
                        isAReply: false,
                        index: commentIndex,
                    }
                    
                    return returnObject
                } else {
                    
                    const ParentIndex = commentsData.findIndex((comment) => {
                        return comment.replies.some((reply) => reply.id === commentToSearchId)
                    })
                    
                    
                    const ReplyIndex = commentsData[ParentIndex].replies.findIndex((reply) => reply.id === commentToSearchId)
                    
                    
                    returnObject = {
                        searchedComment: commentsData[ParentIndex].replies[ReplyIndex] as replyCommentTypes,
                        isAReply: true,
                        index: ReplyIndex,
                        parentIndex: ParentIndex,
                    }
                    
                    return returnObject
                }
                
            } else throw new Error("Comment to search doesn't exist")
        } catch (error) {
            console.error(error)
        }

    }

    //create new comment
    const createComment = (newCommentContent:string): void => {
        if (newCommentContent.length > 0) {
            const newComment:commentTypes = {
                id: createID(),
                content: newCommentContent,
                createdAt: 'seconds ago',
                commentScore: 0,
                profileImage: currentUser.profileImage,
                username: currentUser.username,
                fromCurrentUser: true, 
                replies: [],
            }
            // newComment.id = createID()
            commentsData.push(newComment)
        }
        saveData()
    }

    // delete comment
    const deleteComment = (commentToDeleteId:number) => {
        const commentToDelete = searchComment(commentToDeleteId)
        
        if( commentToDelete ) {
            const { isAReply, index, parentIndex } = commentToDelete
            
            console.log(isAReply)
            
            if (isAReply && (typeof parentIndex !== "undefined")) {
                commentsData[parentIndex].replies.splice(index, 1)
                
            } else {
                console.log("parent")
                commentsData.splice(index, 1)
                
            }
        }
        saveData()
        
        //show error in screen...
    }

    const createReplyComment = (parameters: [id: number, usernameToReply: string], newCommentContent: string) => {
        if(newCommentContent.length > 0){
            const commentToReply = searchComment(parameters[0])
            
            if (commentToReply) {
                const {searchedComment, isAReply, parentIndex} = commentToReply
                console.log(searchedComment.username)

                const newComment:replyCommentTypes = {
                    id: createID(),
                    parentId: searchedComment.id,
                    content: newCommentContent,
                    createdAt: "seconds ago",
                    commentScore: 0,
                    profileImage: currentUser.profileImage,
                    username: currentUser.username,
                    replyingTo: parameters[1],
                    fromCurrentUser: true, 
                }

                if(!isAReply) {
                    searchedComment.replies.push(newComment)
                } else {
                    if(parentIndex) {
                        const parent = commentsData[parentIndex]
                        if(parent) {
                            parent.replies.push(newComment)
                        }
                    }

                }
            }
        }

        saveData()
    }

    const editComment = (commentToEditId:number, newContent: string) => {
        const commentToEdit = searchComment(commentToEditId)

        if(commentToEdit) {
            commentToEdit.searchedComment.content = newContent;
        } else console.error("comment to edit don't exist")

        saveData()
    }

    const changeScore = (commentToEditId:number, newScore: number) => {
        const commentToEdit = searchComment(commentToEditId)

        if(commentToEdit) {
            commentToEdit.searchedComment.commentScore = newScore;
        } else console.error("comment to change score don't exist")

        localStorage.setItem(key, JSON.stringify(commentsData))
        setData(commentsData)
    }

    const CRUD = {
        createComment, 
        createReplyComment,
        editComment,
        deleteComment,
        changeScore,
    }

    const returnData: useLocalStorageData = {
        data, 
        currentUser,
        CRUD
    }

    return returnData;
  }

  export default useLocalStorageData