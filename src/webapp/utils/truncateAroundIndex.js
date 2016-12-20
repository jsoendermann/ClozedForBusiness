export default function truncateAroundIndex({ text, index, leaveBefore = 60, leaveAfter = 60, cutString = '' }) {
  const trimmedText = text.trim();

  let start = Math.max(0, index - leaveBefore);
  let end = Math.min(trimmedText.length - 1, index + leaveAfter);

  while (/\s/.test(trimmedText[start])) start += 1;
  while (/\s/.test(trimmedText[end])) end -= 1;

  let truncatedText = '';

  if (start > 0) {
    truncatedText += cutString;
  }

  truncatedText += trimmedText.slice(start, end);

  if (end < trimmedText.length - 1) {
    truncatedText += cutString;
  }

  let truncatedIndex = index - start;

  if (start > 0) {
    truncatedIndex += 1;
  }

  return {
    truncatedText,
    truncatedIndex,
  };
}
