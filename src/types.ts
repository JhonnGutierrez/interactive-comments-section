export interface replyCommentTypes {
    id :number,
    parentId: number,
    content: string,
    createdAt: string,
    commentScore: number,
    profileImage: string,
    username: string,
    replyingTo?: string,
    currentUser?: string
    fromCurrentUser?: boolean, 
    storage?: useLocalStorageData,
}

export interface CRUD {
    createComment: (newCommentContent:string) => void;
    createReplyComment: (parameters: [id: number, usernameToReply: string], newCommentContent: string) => void
    editComment: (commentToEditId: number, newContent: string) => void;
    deleteComment:  (commentToDeleteId: number) => void;
    changeScore: (commentToEditId: number, newScore: number) => void;
}
// [ commentTypes[], currentUserType, CRUD ]
export type useLocalStorageData = {
    data: commentTypes[],
    currentUser: currentUserType,
    CRUD: CRUD
}

export interface commentTypes {
    id :number,
    content: string,
    createdAt: string,
    commentScore: number,
    profileImage: string,
    username: string,
    replyingTo?: string,
    currentUser?: string
    fromCurrentUser?: boolean, 
    replies: replyCommentTypes[],
    storage?: useLocalStorageData,
}

export interface inputTypes {
    currentUser: currentUserType,
    // action: CRUD["createComment"] | CRUD["createReplyComment"],
    action: Function,
    mode: "create" | "reply"
    parameters?: any[]
    setReplying?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface currentUserType {
    profileImage: string,
    username: string,
}