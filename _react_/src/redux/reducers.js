import { SIGNIN, GETQUESTIONS, LOGINATTEMPT, REGISTERATTEMPT, CLEARMSG, INCQUESTION, AFTERTEST } from './actions';
import { combineReducers } from 'redux';

let initialState = {
  signedIn: false,
  currentUser: [],
  questions: [],
  loginAttempt: '',
  registerFail: '',
  currentQuestion: 0,
  onAir: false
}

export const reducerOne = (state = initialState, action = {}) => {
  switch (action.type) {
    case AFTERTEST:
      return {
        ...state,
        questions: [],
        loginAttempt: '',
        registerFail: '',
        currentQuestion: 0,
        onAir: true
      }
    case SIGNIN:
      return {
        ...state,
        signedIn: action.payload,
        currentUser: [],
        questions: [],
        loginAttempt: '',
        currentQuestion: 0
      }
    case GETQUESTIONS:
      return {
        ...state,
        questions: action.payload,
        loginAttempt: '',
        currentQuestion: 0
      }
    case LOGINATTEMPT:
      if (action.payload.length === 0) {
        return {
          ...state,
          signedIn: false,
          loginAttempt: 'Login error! Try again or register'
        }
      }
      else {
        return {
          ...state,
          signedIn: true,
          currentUser: action.payload,
          loginAttempt: '',
          onAir: true
        }
      }
    case REGISTERATTEMPT:
      if (action.payload.length === 0) {
        return {
          ...state,
          signedIn: false,
          registerFail: 'Error! User already registered!'
        }
      }
      else {
        return {
          ...state,
          signedIn: true,
          currentUser: [action.payload],
          onAir: true,
        }
      }
    case CLEARMSG:
      return {
        ...state,
        loginAttempt: '',
        registerOk: '',
        registerFail: ''
      }
    case INCQUESTION:
      if (state.questions.length - state.currentQuestion > 1) {
      return {
        ...state,
        currentQuestion: state.currentQuestion - (-1),
      }
    }
    else {
      return {
        ...state,
        onAir: false,
      }
    }
    default:
      return {
        ...state
      }
  }
}

export const reducer = combineReducers({
  reducerOne
})
