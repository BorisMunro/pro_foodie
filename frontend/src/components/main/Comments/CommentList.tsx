import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDidMount, useModal } from "~/hooks";
import { setTargetComment } from "~/redux/action/helperActions";
import { IComment } from "~/types/types";
import { DeleteCommentModal } from "../Modals";
import CommentItem from "./CommentItem";

interface IProps {
    comments: IComment[];
    updateCommentCallback?: (comment: IComment) => void;
}

const CommentList: React.FC<IProps> = ({ comments, updateCommentCallback }) => {
    const didMount = useDidMount();
    const dispatch = useDispatch();
    const [replies, setReplies] = useState<IComment[]>(comments);
    const { isOpen, closeModal, openModal } = useModal();

    useEffect(() => {
        didMount && setReplies(comments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comments]);

    const deleteSuccessCallback = (comment: IComment) => {
        if (didMount) {
            updateCommentCallback && updateCommentCallback(comment); // For updating the base/parent comment
            dispatch(setTargetComment(null)); // else update the replies
            setReplies(oldComments => oldComments.filter((cmt) => cmt.id !== comment.id));
        }
    }

    return (
        <TransitionGroup component={null}>
            {replies.map(comment => (
                <CSSTransition
                    timeout={500}
                    classNames="fade"
                    key={comment.id}
                >
                    <CommentItem openDeleteModal={openModal} comment={comment} />
                </CSSTransition>
            ))}
            {/* ---- DELETE MODAL ---- */}
            <DeleteCommentModal
                isOpen={isOpen}
                closeModal={closeModal}
                deleteSuccessCallback={deleteSuccessCallback}
            />
        </TransitionGroup>
    );
};

export default CommentList;