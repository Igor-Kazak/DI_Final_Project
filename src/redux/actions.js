export const SIGNIN = 'SIGNIN';
export const GETQUESTIONS = 'GETQUESTIONS';
export const LOGINATTEMPT = 'LOGINATTEMPT';
export const REGISTERATTEMPT = 'REGISTERATTEMPT';
export const CLEARMSG = 'CLEARMSG';
export const INCQUESTION = 'INCQUESTION';
export const ONAIR = 'ONAIR';
export const AFTERTEST = 'AFTERTEST';

export const handleSignIn = (value) => {
  return {
    type: SIGNIN,
    payload: value
  }
}

export const getAsyncQuestions = (value) => (dispatch) => {
  fetch('https://ppltest.herokuapp.com/getQuestions', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ typeOfTest: value, quantity: 20 })
  })
    .then(res => res.json())
    .then(data => {
      dispatch(
        {
          type: GETQUESTIONS,
          payload: data
        });
    })
    .catch(e => {
      console.log(e);
    });
}

export const userAsyncLogin = (user) => (dispatch) => {
  fetch('https://ppltest.herokuapp.com/login', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(data => {
      dispatch(
        {
          type: LOGINATTEMPT,
          payload: data
        });
    })
    .catch(e => {
      console.log(e);
    });
}

export const userAsyncRegister = (newUser) => (dispatch) => {
  fetch('https://ppltest.herokuapp.com/register', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })
    .then(res => res.json())
    .then(data => {
      dispatch(
        {
          type: REGISTERATTEMPT,
          payload: data
        });
    })
    .catch(e => {
      console.log(e);
    });
}

export const handleClearMsg = () => {
  return {
    type: CLEARMSG,
    payload: ''
  }
}

export const incrementQuestion = () => {
  return {
    type: INCQUESTION,
    payload: ''
  }
}

export const userAsyncAnswer = (ticket) => (dispatch) => {
  fetch('https://ppltest.herokuapp.com/sendAnswer', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket)
  })
  .then(res => res.json())
  .then(data => {
    //console.log(data.message);
  })
    .catch(e => {
      console.log(e);
    });
}

export const handleAfterTest = () => {
  return {
    type: AFTERTEST,
    payload: ''
  }
}