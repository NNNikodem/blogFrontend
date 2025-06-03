import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import YouTube from "@tiptap/extension-youtube";
import MenuBar from "./MenuBar.jsx";

const TipTapEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      CodeBlock,
      YouTube.configure({
        HTMLAttributes: {
          class: "youtube-video",
        },
        controls: true,
        nocookie: true,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
      console.log("Editor content updated:", editor.getHTML());
    },
  });

  return (
    <div className="tiptap-editor-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  );
};

export default TipTapEditor;
