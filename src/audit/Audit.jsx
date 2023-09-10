import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "_store";

export { Audit };

function Audit() {
  const users = useSelector((x) => x.users.list);
  const dispatch = useDispatch();

  const [userList, setUserList] = useState([]);
  const [colSort, setColSort] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [dateTimeFormat, setDateTimeFormat] = useState("12hr");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // useEffect section
  useEffect(() => {
    if (users && users.value) {
      const sortedUsers = [...users.value];
      setUserList(sortedUsers);
    }
  }, [users]);

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  // date formate change date/time format from 12hr to 24hr
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: dateTimeFormat === "12hr" ? "numeric" : "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: dateTimeFormat === "12hr",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  // Handle for date and time
  const handleDateTimeFormatChange = (event) => {
    setDateTimeFormat(event.target.value);
  };

  // Sorting for the table for First Name, Last Name and User Name
  const sorting = (col) => {
    const sortedUsers = [...userList];
    const order = colSort[col];
    if (order === "ASC") {
      sortedUsers.sort((a, b) =>
        a[col].toLowerCase().localeCompare(b[col].toLowerCase())
      );
    } else {
      sortedUsers.sort((a, b) =>
        b[col].toLowerCase().localeCompare(a[col].toLowerCase())
      );
    }
    setColSort((prev) => {
      return { ...prev, [col]: order === "ASC" ? "DSC" : "ASC" };
    });
    setUserList(sortedUsers);
  };

  //  Search Filter for table
  const filterUsers = () => {
    const filteredUsers = userList.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredUsers.slice(startIndex, endIndex);
  };

  // Handle Change for search
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  // Pagination Section
  const totalPages = Math.ceil(userList.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          style={{ marginRight: "10px" }}
          key={i}
          className={i === currentPage ? "active" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Auditor Page</h1>
        {/* search input section */}
        <div
          style={{ width: "40%", padding: "13px" }}
          className="search-container"
        >
          <input
            style={{ width: "100%", height: "40px", borderRadius: "10px" }}
            type="text"
            placeholder="Search by First & last name or username"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        {/* Dropdown Date and time format from 12hr to 24hr  */}
        <div style={{ padding: "13px" }} className="format-select">
          <label style={{ marginRight: "5px" }} htmlFor="dateTimeFormat">
            Date/Time Format:
          </label>
          <select
            id="dateTimeFormat"
            value={dateTimeFormat}
            onChange={handleDateTimeFormatChange}
          >
            <option value="12hr">12hr</option>
            <option value="24hr">24hr</option>
          </select>
        </div>
      </div>
      {/* Table section */}
      <table className="table table-striped">
        <thead>
          <tr>
            {/* sorting implementated here */}
            <th onClick={() => sorting("firstName")} style={{ width: "30%" }}>
              First Name ↑↓
            </th>
            <th onClick={() => sorting("lastName")} style={{ width: "30%" }}>
              Last Name ↑↓
            </th>
            <th onClick={() => sorting("username")} style={{ width: "30%" }}>
              Username ↑↓
            </th>
            <th style={{ width: "30%" }}>Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers()?.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{formatDate(user.createdDate)}</td>
            </tr>
          ))}
          {users?.loading && (
            <tr>
              <td colSpan="4" className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination section */}
      <div style={{ width: "100%" }} className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span style={{ margin: "5px" }}>{renderPaginationButtons()}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
