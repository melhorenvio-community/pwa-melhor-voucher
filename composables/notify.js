import { meToast } from '@melhorenvio/unbox';

export function notify () {
  return meToast.show(...arguments);
};

/**
 * Navigate to route and after that shows a toast notification.
 * @param {Object} notification
 * @param {RouteLocationRaw | undefined | null} to
 * @param {NavigateToOptions} options
 * @returns {Promise<void | NavigationFailure> | RouteLocationRaw}
 */
export function notifyAfterNavigate (notification, to, options) {
  const route = useRoute();
  const stop = watch(() => route.fullPath, () => {
    notify(notification);
    stop();
  });
  return navigateTo(to, options);
}