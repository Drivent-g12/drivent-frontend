import useAsync from '../useAsync';

import * as authApi from '../../services/authApi';

export function useSignIn() {
  const {
    loading: signInLoading,
    error: signInError,
    act: signIn
  } = useAsync(authApi.signIn, false);

  return {
    signInLoading,
    signInError,
    signIn
  };
};

export function useSignInWithGithub() {
  const {
    loading: signInLoading,
    error: signInError,
    act: signInWithGithub
  } = useAsync(authApi.signInWithGithub, false);

  return {
    signInLoading,
    signInError,
    signInWithGithub
  };
};
