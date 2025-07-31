import React, { useEffect, useRef } from 'react';

interface ContextMenuItem {
  label: string;
  icon: string;
  onClick: () => void;
  className?: string;
}

interface ContextMenuProps {
  x: number;
  y: number;
  show: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, show, onClose, items }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="absolute z-50 w-56 bg-[#2D1654] border border-[#764ABC] rounded-md shadow-lg py-1"
    >
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`w-full flex items-center px-4 py-2 text-sm text-left text-gray-200 hover:bg-[#764ABC]/50 ${item.className || ''}`}
            >
              <i className={`fas ${item.icon} mr-3 w-4 text-center`}></i>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
