import * as ActionTypes from './ActionTypes';
// import { baseUrl } from '../shared/baseUrl';

const baseUrl = 'https://pure-caverns-82881.herokuapp.com/api/v54/';

export const fetchAccessToken = () =>
{
  return fetch("https://pure-caverns-82881.herokuapp.com/api/developers/v72/tokens", {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      "Accept": "*/*",
      "Connection": "keep-alive",
      "X-Developer-Key": "676abea9d9fd82ab26e027e1bccf0c1554346a62199efb01d19c0f5e3a205f44",
      "X-Developer-Secret": "54117eb3721ab2bb8f1fe4f21c01c6837d938a4c32dff1eb3982f1971ee3a6d1"
    },
  })
    .then(response =>
    {
      if (response.ok)
      {
        return response;
      } else
      {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error =>
      {
        throw error;
      })
    .then(response => response.json())
    .then(response =>
    {
      localStorage.setItem(
        "token", response.token
      );
      localStorage.setItem(
        "valid_before", response.valid_before
      );
    })
    .catch(error =>
    {
      console.log('post comments', error.message);
      alert('Your answer could not be verified\n' + error.message);
    });
}

export const checkToken = () =>
{
  if (!localStorage.getItem("token") || !localStorage.getItem("valid_before"))
  {
    fetchAccessToken();
  } else
  {
    var valid_till_date = new Date(localStorage.getItem("valid_before"));
    if (valid_till_date < new Date())
    {
      fetchAccessToken();
    }
  }
}

export const fetchQuizes = () => (dispatch) =>
{
  dispatch(quizesLoading(true));
  fetch(baseUrl + 'quizzes', {
    headers: {
      "Accept": "*/*",
      "Connection": "keep-alive",
      "X-Access-Token": localStorage.getItem("token")
    },
  })
    .then(response =>
    {
      if (response.ok)
      {
        return response;
      } else
      {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error =>
      {
        var errors = new Error(error.message);
        throw errors;
      })
    .then(response => response.json())
    .then(quizes =>
    {
      dispatch(addQuizes(quizes));
    })
    .catch(error => dispatch(quizesFailed(error.message)));
}

export const quizesLoading = () => ({
  type: ActionTypes.QUIZES_LOADING
});

export const quizesFailed = (errmess) => ({
  type: ActionTypes.QUIZES_FAILED,
  payload: errmess
});

export const addQuizes = (quizes) => ({
  type: ActionTypes.ADD_QUIZES,
  payload: quizes
});

export const fetchQuiz = (id) => (dispatch) =>
{

  dispatch(quizLoading(true));
  checkToken();
  return fetch(baseUrl + 'quizzes/' + id, {
    headers: {
      "Accept": "*/*",
      "Connection": "keep-alive",
      "X-Access-Token": localStorage.getItem("token")
    },
  })
    .then(response =>
    {
      if (response.ok)
      {
        return response;
      } else
      {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error =>
      {
        var errors = new Error(error.message);
        throw errors;
      })
    .then(response => response.json())
    .then(quize => dispatch(addQuiz(quize)))
    .catch(error => dispatch(quizFailed(error.message)));
}

export const quizLoading = () => ({
  type: ActionTypes.QUIZ_LOADING
});

export const quizFailed = (errmess) => ({
  type: ActionTypes.QUIZ_FAILED,
  payload: errmess
});

export const addQuiz = (quiz) => ({
  type: ActionTypes.ADD_QUIZ,
  payload: quiz
});

