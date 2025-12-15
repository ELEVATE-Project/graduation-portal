// Mock for react-native-image-picker on web
export const launchCamera = () => {
    console.warn('launchCamera is not supported on web');
    return Promise.resolve({ didCancel: true });
};

export const launchImageLibrary = () => {
    console.warn('launchImageLibrary is not supported on web');
    return Promise.resolve({ didCancel: true });
};
