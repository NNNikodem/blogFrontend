import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './MenuBar.jsx'; // Assuming you have a MenuBar component for toolbar actions

const TipTapEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
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