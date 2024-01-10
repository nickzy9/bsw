import {combineReducers} from 'redux';
import usersReducer from './UsersSlice';
import photosReducer from './PhotosSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  photos: photosReducer,
});

export default rootReducer;
