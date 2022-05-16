import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import StorageService from 'app/services/storage';
import { ACCESS_TOKEN, UserInfo } from 'shared/const/user-info.const';
import { RootState } from 'store';

interface User {
  info: UserInfo;
}

const initialState: User = {
  info: {
    email: '',
    id: '',
    phoneNumber: '',
    role: '',
    sex: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state: User, action: PayloadAction<User>) => {
      state.info = action.payload.info;
    },
    logout: (state: User) => {
      state.info = initialState.info;
      StorageService.setSession(ACCESS_TOKEN, '');
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.info;
export default userSlice.reducer;
