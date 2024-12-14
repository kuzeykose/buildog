import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
const decideWrapper = (tagName: "bold" | "italic" | "a") => {
    switch (tagName) {
      case "bold":
        return "strong";
      case "italic":
        return "em";
      default:
        return tagName;
    }
  }
const Toolbar = ({ editorRef, setContent, selectedArea }: any) => {
 const applyStyle = (tagName: "bold" | "italic" | "a") => {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const wrapperTag = decideWrapper(tagName);

  // Handle links separately to prompt for the URL
  if (tagName === "a") {
    const url = prompt("Enter the URL:");
    if (!url) return;
  }

  const processNode = (node: Node, wrapperTag: string) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parentElement = node.parentNode as HTMLElement;
      if (parentElement && parentElement.tagName.toLowerCase() === wrapperTag) {
        // Remove the wrapper if already styled
        const rangeStart = range.startOffset;
        const rangeEnd = range.endOffset;
        const textContent = node.textContent!;

        // Split the text into three parts
        const before = textContent.slice(0, rangeStart);
        const middle = textContent.slice(rangeStart, rangeEnd);
        const after = textContent.slice(rangeEnd);

        // Replace the node with split parts
        const parent = parentElement.parentNode!;
        if (before) parent.insertBefore(document.createTextNode(before), parentElement);
        parent.insertBefore(document.createTextNode(middle), parentElement);
        if (after) parent.insertBefore(document.createTextNode(after), parentElement);
        parent.removeChild(parentElement);
      } else {
        // Add the wrapper if not already styled
        const wrapper = document.createElement(wrapperTag);
        wrapper.textContent = node.textContent;
        range.deleteContents();
        range.insertNode(wrapper);
      }
    }
  };

  // Walk through the selection and process each node
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;

  // If the range is within a single text node
  if (startContainer === endContainer) {
    processNode(startContainer, wrapperTag);
  } else {
    // Handle multi-node selections
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (range.intersectsNode(node)) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        },
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      processNode(node, wrapperTag);
    }
  }

  // Update the content in the editor
  if (editorRef.current) {
    setContent(editorRef.current.innerHTML);
  }
};
  return (
    <Card 
      className="p-1 flex gap-2 shadow-md rounded-md border border-gray-200" 
      style={{ position: "absolute", top: selectedArea?.y - 40, left: selectedArea?.x }}
    >
      <Button variant="ghost" onClick={() => applyStyle("bold")}>Bold</Button>
      <Button variant="ghost" onClick={() => applyStyle("italic")}>Italic</Button>
      <Button variant="ghost" onClick={() => applyStyle("a")}>Link</Button>
    </Card>
  );
};
export default Toolbar;
