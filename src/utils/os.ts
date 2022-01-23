export function getPlatform(): 'Android' | 'iOS' | 'Web' | null {
  if (navigator.userAgent) {
    if (
      navigator.userAgent.indexOf('iPhone') > -1
      || navigator.userAgent.indexOf('iPad') > -1
      || navigator.userAgent.indexOf('iOS') > -1
    ) {
      return 'iOS';
    } else if (navigator.userAgent.indexOf('Android') > -1) {
      return 'Android';
    }
    return 'Web';
  }

  return null;
}
