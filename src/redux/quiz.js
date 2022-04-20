import * as ActionTypes from './ActionTypes';

export const Quiz = (state = {
        isLoading: true,
        errMess: null,
        quiz: []
    }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_QUIZ:
            return { ...state, isLoading: false, errMess: null, quiz: action.payload };

        case ActionTypes.QUIZ_LOADING:
            return { ...state, isLoading: true, errMess: null, quiz: [] }

        case ActionTypes.QUIZ_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};