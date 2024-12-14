 import React, { useState, useRef, useEffect } from "react";
 import Toolbar from "./Toolbar";

//  const RichTextEditor: React.FC = () => {
//    const [selectedArea, setSelectedArea] = useState<{ x: number; y: number } | null>(null);
//    const [content, setContent] = useState<string>("");
//    const editorRef = useRef<HTMLDivElement | null>(null);

//    useEffect(() => {
//      if (editorRef.current && !editorRef.current.innerHTML) {
//        editorRef.current.innerHTML = content;
//      }
//    }, []);

//    const handleInput = () => {
//      if (editorRef.current) {
//        setContent(editorRef.current.innerHTML);
//      }
//    };

//    const saveContentAsJSON = () => {
//      const contentAsJSON = JSON.stringify({ content });
//      console.log(contentAsJSON);
//    };

//    const handleSelect = () => {
//      const selection = window.getSelection();
//      if (!selection || selection.rangeCount === 0) {
//        setSelectedArea(null);
//        return;
//      }
//      const range = selection.getRangeAt(0);

//      // Get the first node in the selection
//      const startContainer = range.startContainer;

//      // Create a new range that only includes the start of the selection
//      const startRange = document.createRange();
//      startRange.setStart(startContainer, range.startOffset);
//      startRange.setEnd(startContainer, range.startOffset);

//      // Get the bounding rectangle for the start of the selection
//      const rect = startRange.getBoundingClientRect();

//      const toolbarWidth = 220;
//      const padding = 10;

//      let x = rect.x;
//      let y = rect.y - padding;

//      // Adjust x-coordinate to prevent toolbar overflow
//      if (x + toolbarWidth > window.innerWidth - padding) {
//        x = window.innerWidth - toolbarWidth - padding;
//      }

//      // Ensure the toolbar doesn't overflow on the left
//      if (x < padding) {
//        x = padding;
//      }

//      // Ensure the toolbar doesn't overflow on the top
//      if (y < padding) {
//        y = padding;
//      }

    
//      if (x && y) {
//        setSelectedArea({ x, y });
//      }
//    };

//    return (
//      <div>
//        {selectedArea && (
//          <Toolbar editorRef={editorRef} setContent={setContent} selectedArea={selectedArea} />
//        )}
//        <div
//          ref={editorRef}
//          contentEditable
//          onInput={handleInput}
//          onSelect={handleSelect}
//          className="border border-gray-300 min-h-[200px] p-4"
//        >test test test</div>
//        <button onClick={saveContentAsJSON}>Save as JSON</button>
//      </div>
//    );
//  };

//  export default RichTextEditor;

//  import React, { useRef } from 'react';

 const RichTextEditor = () => {
   const editorRef = useRef<HTMLDivElement>(null);

   const getSelectionRange = () => {
     const selection = window.getSelection();
     if (!selection || selection.rangeCount === 0) {
       return null;
     }
     return selection.getRangeAt(0);
   };

   // Function to remove unnecessary nested tags
   const normalizeTags = (tagName: string) => {
     if (editorRef.current) {
       const editorContent = editorRef.current.innerHTML;
       const tagRegex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 'gi');
       // Replace nested tags with only the required ones
       editorRef.current.innerHTML = editorContent.replace(tagRegex, (match, p1) => {
         return `<${tagName}>${p1}</${tagName}>`;
       });
     }
   };

   // Apply the tag to the selected text
   const applyTag = (tagName: keyof HTMLElementTagNameMap) => {
     const range = getSelectionRange();
     if (!range) return;

     // Extract the selected content
     const selectedText = range.extractContents();

     // Create the desired tag
     const tag = document.createElement(tagName);
     tag.appendChild(selectedText);

     // Insert the formatted content back into the range
     range.insertNode(tag);

     // Clean up any unnecessary nested tags
     normalizeTags(tagName);

     // Clear the selection
     window.getSelection()?.removeAllRanges();
   };

   // Toggle the tag: apply or remove the tag depending on the current state
   const toggleTag = (tagName: keyof HTMLElementTagNameMap) => {
     const range = getSelectionRange();
     if (!range) return;

     const selection = window.getSelection();
     if (!selection) return;

     const parentElement = range.commonAncestorContainer.parentNode as HTMLElement;

     // If the parent element is the tag we want to toggle, we remove it
     if (parentElement && parentElement.tagName.toLowerCase() === tagName) {
       const textNode = document.createTextNode(parentElement.textContent || '');
       parentElement.parentNode?.replaceChild(textNode, parentElement);
     } else {
       // Otherwise, apply the tag
       applyTag(tagName);
     }
   };

   const saveContent = () => {
     if (editorRef.current) {
       const content = editorRef.current.innerHTML;
       console.log('Saved Content:', content); // Save this to a backend or localStorage
     }
   };

   const restoreContent = (content: string) => {
     if (editorRef.current) {
       editorRef.current.innerHTML = content;
     }
   };

   return (
     <div className="editor-container">
       <div className="toolbar">
         <button onClick={() => toggleTag('b')}>Bold</button>
         <button onClick={() => toggleTag('i')}>Italic</button>
         <button onClick={() => saveContent()}>Save</button>
         <button
           onClick={() =>
             restoreContent('<b>Bold</b> and <i>Italic</i> text')
           }
         >
           Restore
         </button>
       </div>
       <div
         ref={editorRef}
         className="editor"
         contentEditable
         suppressContentEditableWarning
       >
         Start typing...
       </div>
     </div>
   );
 };

 export default RichTextEditor;

//import React, { useRef } from 'react';

//const RichTextEditor = () => {
  //const editorRef = useRef<HTMLDivElement>(null);

  //const getSelectionRange = () => {
    //const selection = window.getSelection();
    //if (!selection || selection.rangeCount === 0) {
      //return null;
    //}
    //return selection.getRangeAt(0);
  //};

  //// Function to remove tags but keep their inner content
  //const removeTag = (tagName: string) => {
    //if (editorRef.current) {
      //const editorContent = editorRef.current.innerHTML;

      //// Create a RegExp to match the start and end tags of the given tag
      //const tagRegex = new RegExp(`(<${tagName}[^>]*>)(.*?)(<\/${tagName}>)`, 'gi');

      //// Replace matched tags with their inner content only
      //editorRef.current.innerHTML = editorContent.replace(tagRegex, (match, startTag, content, endTag) => {
        //return content; // Keep only the inner content, removing the <tag> itself
      //});
    //}
  //};

  //// Function to normalize the tags by ensuring no nested tags for the same type
  //const normalizeTags = (tagName: string) => {
    //if (editorRef.current) {
      //const editorContent = editorRef.current.innerHTML;
      //const tagRegex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 'gi');
      //// Replace nested tags with only the required ones
      //editorRef.current.innerHTML = editorContent.replace(tagRegex, (match, p1) => {
        //return `<${tagName}>${p1}</${tagName}>`;
      //});
    //}
  //};

  //// Apply the tag to the selected text
  //const applyTag = (tagName: keyof HTMLElementTagNameMap) => {
    //const range = getSelectionRange();
    //if (!range) return;

    //// Extract the selected content
    //const selectedText = range.extractContents();

    //// Create the desired tag
    //const tag = document.createElement(tagName);
    //tag.appendChild(selectedText);

    //// Insert the formatted content back into the range
    //range.insertNode(tag);

    //// Clean up any unnecessary nested tags
    //normalizeTags(tagName);

    //// Clear the selection
    //window.getSelection()?.removeAllRanges();
  //};

  //// Toggle the tag: apply or remove the tag depending on the current state
  //const toggleTag = (tagName: keyof HTMLElementTagNameMap) => {
    //const range = getSelectionRange();
    //if (!range) return;

    //const selection = window.getSelection();
    //if (!selection) return;

    //const parentElement = range.commonAncestorContainer.parentNode as HTMLElement;

    //// If the parent element is the tag we want to toggle, we remove it
    //if (parentElement && parentElement.tagName.toLowerCase() === tagName) {
      //const textNode = document.createTextNode(parentElement.textContent || '');
      //parentElement.parentNode?.replaceChild(textNode, parentElement);
    //} else {
      //// Otherwise, apply the tag
      //applyTag(tagName);
    //}
  //};

  //// Function to remove all bold and italic tags (or others)
  //const removeBoldItalic = () => {
    //if (editorRef.current) {
      //// Remove both <b> and <i> tags, but keep their content
      //removeTag('b');
      //removeTag('i');
    //}
  //};

  //const saveContent = () => {
    //if (editorRef.current) {
      //const content = editorRef.current.innerHTML;
      //console.log('Saved Content:', content); // Save this to a backend or localStorage
    //}
  //};

  //const restoreContent = (content: string) => {
    //if (editorRef.current) {
      //editorRef.current.innerHTML = content;
    //}
  //};

  //return (
    //<div className="editor-container">
      //<div className="toolbar">
        //<button onClick={() => toggleTag('b')}>Bold</button>
        //<button onClick={() => toggleTag('i')}>Italic</button>
        //<button onClick={() => saveContent()}>Save</button>
        //<button
          //onClick={() =>
            //restoreContent('<b>Bold</b> and <i>Italic</i> text')
          //}
        //>
          //Restore
        //</button>
        //<button onClick={removeBoldItalic}>Remove Bold & Italic</button>
      //</div>
      //<div
        //ref={editorRef}
        //className="editor"
        //contentEditable
        //suppressContentEditableWarning
      //>
        //Start typing...
      //</div>
    //</div>
  //);
//};

//export default RichTextEditor;
