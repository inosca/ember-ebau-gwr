export function setRoot(Class, root) {
  return class extends Class {
    constructor(xmlOrObject) {
      super(xmlOrObject, root);
    }
  };
}
export function setTemplate(Class, template) {
  return class extends Class {
    static template = template;
  };
}
