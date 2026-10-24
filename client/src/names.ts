/** "Dr Samuel Reed" -> "Samuel", "Mrs Agnes Pryor" -> "Agnes". */
export function firstName(fullName: string): string {
  return fullName.replace(/^(Dr|Mr|Mrs|Miss) /, '').split(' ')[0] ?? fullName;
}
