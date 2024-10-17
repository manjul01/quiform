import React, { useEffect, useRef } from 'react';

function AutoResizeTextarea({ rows, ...props }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const resizeTextarea = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    resizeTextarea();
    textarea.addEventListener('input', resizeTextarea);

    return () => {
      textarea.removeEventListener('input', resizeTextarea);
    };
  }, []);

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      className="w-full min-h-1 py-1 px-1 outline-none border-2 leading-5 border-gray-500 rounded-md"
      {...props}
    ></textarea>
  );
}

export default AutoResizeTextarea;
