import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { User, X } from 'lucide-react';

export function StudentNode({ 
  id, 
  student, 
  onClick,
  onRemove
}: { 
  id: string; 
  student?: any; 
  onClick: () => void;
  onRemove?: () => void;
}) {
  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging, transform } = useDraggable({
    id: `drag-${id}`,
    data: { id, student }
  });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `drop-${id}`,
    data: { id, student }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : undefined,
  } : undefined;

  return (
    <div 
      ref={setDroppableRef}
      className={clsx(
        "relative rounded-xl border-2 transition-colors p-2 h-24 flex flex-col items-center justify-center cursor-pointer select-none group",
        isOver && "border-indigo-500 bg-indigo-50",
        !isOver && student ? "border-slate-200 bg-white shadow-sm" : "border-dashed border-slate-300 bg-slate-50 hover:border-slate-400",
        isDragging && "opacity-50 ring-2 ring-indigo-500"
      )}
      onClick={!isDragging ? onClick : undefined}
    >
      {student && !isDragging && (
        <button 
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 p-1.5 bg-red-500 text-white border-2 border-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-50 flex items-center justify-center hover:bg-red-600 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          title="Tháo khỏi sơ đồ"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
      <div 
        ref={setDraggableRef} 
        style={style}
        {...listeners} 
        {...attributes}
        className="w-full h-full flex flex-col items-center justify-center p-1 pointer-events-auto"
      >
        {student ? (
          <>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 pointer-events-none">
              <User size={16} />
            </div>
            <span className="text-xs font-semibold text-center text-slate-800 line-clamp-1 pointer-events-none">
              {student.displayName || student.name}
            </span>
            {student.points !== undefined && (
              <span className={clsx("text-[10px] font-bold mt-1 pointer-events-none", student.points >= 0 ? "text-green-600" : "text-red-600")}>
                {student.points > 0 ? '+' : ''}{student.points} pts
              </span>
            )}
          </>
        ) : (
          <span className="text-slate-400 text-xs font-medium pointer-events-none">Bàn trống</span>
        )}
      </div>
    </div>
  );
}
