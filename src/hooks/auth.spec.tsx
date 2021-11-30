import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { startAsync } from 'expo-auth-session';
import fetchMock from 'jest-fetch-mock';

import { AuthProvider, useAuth } from './auth';

jest.mock('expo-auth-session');

fetchMock.enableMocks();

describe('Auth Hook', () => {
    it('should be able to sign in with an existing Google account', async () => {

        const googleMocked = mocked(startAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'success',
            params: {
                access_token: 'any_token',
            }
        });

        const userTest = {
            id: 'any_id',
            email: 'diego@email.com',
            name: 'Diego',
            photo: 'any_photo.png'
        };

        fetchMock.mockResponseOnce(JSON.stringify(userTest));

        const { result, unmount } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user.email).toBe(userTest.email);
    });

    it('user should not connect if cancel authentication with Google', async () => {
        const googleMocked = mocked(startAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'cancel'
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        console.log('user should not connect if cancel authentication with Google');
        console.log('before useEffect', result.current.user);
        await act(() => result.current.signInWithGoogle());
        console.log('after useEffect', result.current.user);

        expect(result.current.user).not.toHaveProperty('id');
    });
});