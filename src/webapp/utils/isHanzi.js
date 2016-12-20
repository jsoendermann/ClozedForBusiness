export default function isHanzi(str) {
  return /^[\u3400-\u9FBF]*$/.test(str);
}
