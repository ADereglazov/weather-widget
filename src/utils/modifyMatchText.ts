export default function modifyMatchText(text: string, subString: string) {
  const match = text.toLowerCase().indexOf(subString.toLowerCase());

  if (~match) {
    const textSubstr = text.substring(match, subString.length + match);
    return text.replace(textSubstr, "<b>" + textSubstr + "</b>");
  }

  return text;
}
