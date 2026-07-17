"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Unlink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/40">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-muted text-foreground")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-muted text-foreground")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1 self-center" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={cn("h-8 w-8 p-0", editor.isActive('bulletList') && "bg-muted text-foreground")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={cn("h-8 w-8 p-0", editor.isActive('orderedList') && "bg-muted text-foreground")}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1 self-center" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); setLink(); }}
        className={cn("h-8 w-8 p-0", editor.isActive('link') && "bg-muted text-foreground")}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      {editor.isActive('link') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); }}
          className="h-8 w-8 p-0"
        >
          <Unlink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export function RichTextEditor({ value, onChange, placeholder, maxLength = 2000, className }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:float-left before:text-muted-foreground before:pointer-events-none before:h-0',
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[150px] p-4 outline-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Re-sync value if it changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!mounted) return null;

  const characters = editor?.storage.characterCount.characters() || 0;
  const words = editor?.storage.characterCount.words() || 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className={cn("border rounded-md overflow-hidden flex flex-col bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
      
      <div className="bg-muted/30 p-2 text-xs text-muted-foreground flex justify-between items-center border-t">
        <div className="flex gap-4">
          <span>{words} {words === 1 ? 'word' : 'words'}</span>
          <span>~{readingTime} min read</span>
        </div>
        <div className={cn(characters >= maxLength ? 'text-destructive font-medium' : '')}>
          {characters} / {maxLength}
        </div>
      </div>
    </div>
  );
}
