export default function isHanzi(str) {
  return /^[\u2F00-\u2FD5\u3400-\u9FBF]*$/.test(str);
}
