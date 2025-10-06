import { ReactNode } from 'react';

type TableProps = {
  headers: (string | ReactNode)[];
  children: ReactNode;
  className?: string;
};

export default function Table({ headers, children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto scrollbar-thin scrollbar-thumb-[#563EB7] scrollbar-track-[#1a1333] ${className}`}>
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-[#563EB7]/20">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#563EB7]/10">
          {children}
        </tbody>
      </table>
    </div>
  );
}

type TableRowProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function TableRow({ children, onClick, className = '' }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-[#1a1333] transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableCell({ children, className = '' }: TableCellProps) {
  return (
    <td className={`px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-300 ${className}`}>
      {children}
    </td>
  );
}

