export const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim();

export const getTextContent = (element: Element | null | undefined): string =>
  normalizeText(element?.textContent ?? '');

export const findFirstElementByText = <T extends Element>(
  root: ParentNode,
  selector: string,
  matcher: (text: string, element: T) => boolean,
): T | null => {
  const elements = Array.from(root.querySelectorAll<T>(selector));

  for (const element of elements) {
    const text = getTextContent(element);
    if (matcher(text, element)) {
      return element;
    }
  }

  return null;
};
