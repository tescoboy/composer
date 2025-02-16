'use client';

import { useState, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/react';
import { updatePlay } from '@/services/plays';
import { createClient } from '@/lib/auth-client';
import { toast } from '@/components/ui/use-toast';
import { Bold, Italic, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayReviewContentProps {
  playId: number;
  initialContent: string;
}

export default function PlayReviewContent({ playId, initialContent }: PlayReviewContentProps) {
  const supabase = createClient();
  const [session, setSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: false,
  });

  const toggleEdit = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to edit reviews",
        variant: "destructive",
      });
      return;
    }
    
    setIsEditing(!isEditing);
    if (editor) {
      editor.setEditable(!editor.isEditable);
    }
  };

  const handleSave = async () => {
    if (!editor || !session) return;

    try {
      setIsSaving(true);
      const content = editor.getHTML();
      await updatePlay(playId, { synopsis: content });
      
      setIsEditing(false);
      editor.setEditable(false);
      
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
    } catch (error) {
      console.error('Failed to save review:', error);
      toast({
        title: "Error",
        description: "Failed to save review",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white">
          Review
        </h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={toggleEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={toggleEdit}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mb-4 flex gap-2 border-b pb-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
              editor.isActive('bold') && "bg-gray-100 dark:bg-gray-700"
            )}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
              editor.isActive('italic') && "bg-gray-100 dark:bg-gray-700"
            )}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
              editor.isActive('heading', { level: 2 }) && "bg-gray-100 dark:bg-gray-700"
            )}
          >
            <Heading2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert max-w-none"
      />
    </div>
  );
} 