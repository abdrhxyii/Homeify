import { notification } from 'antd';

export const showSuccessNotification = (message: string) => {
    notification.success({
        message: 'Success',
        description: message,
        placement: 'topRight',
        duration: 3,
    });
};

export const showErrorNotification = (message: string) => {
    notification.error({
        message: 'Error',
        description: message,
        placement: 'topRight',
        duration: 3,
    });
};
