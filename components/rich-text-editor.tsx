"use client"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { useMemo } from 'react'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <div className="h-40 bg-slate-100 animate-pulse rounded-md border" /> })

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  }), []);

  return (
    <div className="bg-white">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        placeholder={placeholder}
        className="h-64 pb-12"
      />
    </div>
  )
}
