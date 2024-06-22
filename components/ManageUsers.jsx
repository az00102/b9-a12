import { useState, useEffect } from 'react';
import useAxiosSecure from '../components/useAxiosSecure';
import Select from 'react-select';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader';

Modal.setAppElement('#root'); // Set the app element for accessibility reasons

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;

    axiosSecure.get('/api/users', { params })
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = (userId, role) => {
    setLoading(true);
    axiosSecure.patch(`/api/users/${userId}/request`, { role })
      .then(() => {
        setUsers(users.map(user => (user._id === userId ? { ...user, role, requestRole: null } : user)));
      })
      .catch(error => console.error('Error updating user role:', error))
      .finally(() => setLoading(false));
  };

  const handleRequestDecision = (decision) => {
    if (!selectedUser) return;
    setLoading(true);
    axiosSecure.patch(`/api/users/${selectedUser._id}/request`, { decision })
      .then(() => {
        if (decision === 'approved') {
          handleRoleChange(selectedUser._id, selectedUser.requestRole);
        } else {
          setUsers(users.map(user => (user._id === selectedUser._id ? { ...user, requestRole: null } : user)));
        }
        setModalIsOpen(false);
      })
      .catch(error => {
        console.error('Error processing request:', error);
        setModalIsOpen(false);
      })
      .finally(() => setLoading(false));
  };

  const openModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
    setActionType('');
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleRoleFilterChange = (selectedOption) => {
    setRoleFilter(selectedOption ? selectedOption.value : '');
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(31, 41, 55, 1)', // dark background color
      borderColor: 'rgba(107, 114, 128, 1)', // dark border color
      color: 'white',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(31, 41, 55, 1)', // dark background color for dropdown
      color: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(55, 65, 81, 1)' : 'rgba(31, 41, 55, 1)', // highlight selected option
      color: state.isSelected ? 'white' : 'white',
    }),
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 max-w-4xl mx-auto dark:bg-gray-900 dark:text-white bg-white text-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Users</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearch}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
        />
      </div>
      <div className="mb-4">
        <Select
          options={[
            { value: '', label: 'All' },
            { value: 'tourist', label: 'Tourist' },
            { value: 'tourguide', label: 'Tour Guide' },
            { value: 'admin', label: 'Admin' },
          ]}
          onChange={handleRoleFilterChange}
          isClearable
          className="w-full"
          styles={customStyles}
        />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#123abc"} loading={loading} size={50} />
          </div>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-2 px-4 border dark:border-gray-600">Name</th>
                <th className="py-2 px-4 border dark:border-gray-600">Email</th>
                <th className="py-2 px-4 border dark:border-gray-600">Role</th>
                <th className="py-2 px-4 border dark:border-gray-600">Actions</th>
                <th className="py-2 px-4 border dark:border-gray-600">Request</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user._id} className="text-center">
                  <td className="py-2 px-4 border dark:border-gray-600">{user.name}</td>
                  <td className="py-2 px-4 border dark:border-gray-600">{user.email}</td>
                  <td className="py-2 px-4 border dark:border-gray-600">{user.role}</td>
                  <td className="py-2 px-4 border dark:border-gray-600">
                    {user.role.toLowerCase() === 'admin' ? (
                      <span>Already Admin</span>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleRoleChange(user._id, 'admin')}
                          disabled={user.role.toLowerCase() === 'admin' || user.requestRole}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() => handleRoleChange(user._id, 'tourguide')}
                          disabled={user.role.toLowerCase() === 'tourguide' || user.requestRole}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                          Make Tour Guide
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 border dark:border-gray-600">
                    {user.requestRole ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openModal(user, 'approve')}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openModal(user, 'decline')}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span>No requests</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button
                  onClick={() => paginate(i + 1)}
                  className="page-link bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-3 py-1 rounded"
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
        className="flex justify-center items-center h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">{actionType === 'approve' ? 'Approve Request' : 'Decline Request'}</h2>
          <p>Are you sure you want to {actionType === 'approve' ? 'approve' : 'decline'} this request?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
            >
              No
            </button>
            <button
              onClick={() => handleRequestDecision(actionType === 'approve' ? 'approved' : 'declined')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
