import React from "react";

interface TableProps {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
  className?: string;
}

export default function ProductTable({ headers, rows, className }: TableProps) {
  return (
    <table className={`w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ${className || ''}`}>
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="px-6 py-3 text-center">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={
            `odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 text-center`
          }>
            {row.map((cell, j) => (
              <td key={j} className="px-6 py-4">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
