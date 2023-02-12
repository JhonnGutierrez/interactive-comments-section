import * as React from 'react';
import { inputTypes } from 'src/types';

const Input = ({
    currentUser,
    action,
    mode,
    parameters,
    setReplying,
}:inputTypes) => {
    let [content, setContent] = React.useState('')

    const handle = () => {
        switch (mode) {
            case "create":
                action(content)
                setTimeout(() => {
                    console.log("input")
                    window.scroll({top: document.body.scrollHeight, behavior:"smooth"})
                }, 100);
                break;
            case "reply":
                action(parameters, content)
                break;
        }
        setContent('')
    }
    return (
        <div className={`input ${mode}`}
        >
            <form 
                className="input__form" 
                >
                <textarea 
                    onKeyDown={(event) => {
                        if(event.code === "Enter" && !event.shiftKey) {
                            event.preventDefault()
                            handle()
                        }
                    }}
                    autoFocus={true}
                    className="input__form__text" 
                    placeholder='Add a comment...' 
                    autoComplete='off' 
                    required
                    value={content}
                    onChange={(event) => {
                        event.preventDefault();
                        setContent(event.target.value)
                    }}
                />
                <div className="input__form__foot">
                    <img className="input__form__foot__image" src={currentUser.profileImage} alt="" />
                    <button 
                        className="input__form__foot__button" 
                        onClick={(event) => {
                            event.preventDefault();
                            handle()
                        }}
                        // {
                        //     "id": 0,
                        //     "content": content,
                        //     "createdAt": "seconds ago",
                        //     "commentScore": Math.floor(Math.random() * 20),
                        //     "profileImage": currentUser.profileImage,
                        //     "username": currentUser.username,
                        //     "replies": []
                        // }
                    >send</button>
                </div>
            </form>
        </div>
    );
}

export default Input;