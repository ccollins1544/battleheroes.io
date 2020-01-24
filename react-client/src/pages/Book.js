import React from "react";
import format from "date-fns/format";

const Book = ({ id, title, description }) => {
  return (
    <div className="w-full lg:w-1/2 mt-4 bg-white rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
        <p className="text-gray-700 text-base">
          {/* Published: {format(new Date(date), "PPP")} */}
        </p>
      </div>
      <div className="px-6 py-4">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          
        </span>
      </div>
    </div>
  );
};
export default Book;