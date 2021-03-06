import { store } from 'react-notifications-component';

export const noti = (type, message, title) => {
  store.addNotification({
    title,
    message,
    type,
    insert: 'top',
    container: 'top-center',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss: {
      duration: 2000,
      onScreen: false,
    },
  });
};

export const notiTypes = {
  SUCCESS: 'success',
  ERROR: 'danger',
};
