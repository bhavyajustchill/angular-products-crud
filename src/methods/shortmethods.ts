export function gid(elementId: string): Element {
  return document.getElementById(elementId) as Element;
}

export function dqs(elementId: string): Element {
  return document.querySelector(elementId) as Element;
}

export function dqsa(elementId: string): NodeListOf<Element> {
  return document.querySelectorAll(elementId) as NodeListOf<Element>;
}
