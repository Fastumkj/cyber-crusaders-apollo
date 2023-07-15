import React from "react";
import "./styles/Pagination.css";

const Paginate = ({ current, posts, total, paginate }) => {
  let starting = Math.max;
  let ending = Math.min;

  if (current <= 3) {
    starting = 1;
    ending = 5;
  } else if (current >= total - 2) {
    starting = total - 5;
    ending = total;
  } else {
    starting = current - 2;
    ending = current + 2;
  }

  const last = Math.ceil(total / posts);

  const pageNumbers = [];
  for (let i = starting; i <= ending && i <= last; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <ul className="pagination">
        <li onClick={() => paginate(current === 1 ? 1 : current - 1)}>
          previous
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
            className="page-number"
          >
            <div className={number === current ? "currentPage" : ""}>
              {number}
            </div>
          </li>
        ))}
        <li onClick={() => paginate(current === last ? last : current + 1)}>
          next
        </li>
      </ul>
    </div>
  );
};

export default Paginate;
