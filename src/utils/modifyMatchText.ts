export function modifyMatchText(text: string, subString: string) {
  const subStringModified = subString.trim();

  const match = text.toLowerCase().indexOf(subStringModified.toLowerCase());

  if (~match) {
    const textSubstr = text.substring(match, subStringModified.length + match);
    return text.replace(textSubstr, "<b>" + textSubstr + "</b>");
  }

  return text;
}
