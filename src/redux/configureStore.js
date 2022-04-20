import {createStore, combineReducers, applyMiddleware } from 'redux';
import { Quizes } from './quizes';
import { Quiz } from './quiz';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            quizes: Quizes,
            quiz: Quiz
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}