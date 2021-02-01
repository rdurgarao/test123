import { call, put, takeLatest } from "redux-saga/effects";

import * as UsersService from "../services/users";

export const actionTypes = {
  FETCH_USERS: `users/FETCH_USERS`,
  FETCH_USERS_SUCCESS: `users/FETCH_USERS_SUCCESS`,
  FETCH_USERS_FAILURE: `users/FETCH_USERS_FAILURE`,
};

export function fetchUsers() {
  return {
    type: actionTypes.FETCH_USERS,
  };
}

export function fetchUsersSuccess(users) {
  return {
    type: actionTypes.FETCH_USERS_SUCCESS,
    payload: users,
  };
}

export function fetchUsersFailure(error) {
  return {
    type: actionTypes.FETCH_USERS_FAILURE,
    payload: error,
    error: true,
  };
}

const initialState = {
  isFetching: false,
  users: [],
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_USERS:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: action.payload,
      };
    case actionTypes.FETCH_USERS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
}

function* fetchUsersSagaWorker() {
  try {
    const users = yield call(UsersService.getUsers);
    yield put(fetchUsersSuccess(users));
  } catch (e) {
    yield put(fetchUsersFailure(e));
  }
}

export function* usersSagaWatcher() {
  yield takeLatest(actionTypes.FETCH_USERS, fetchUsersSagaWorker);
}

export function usersSelector(state) {
  return state.users.users;
}
