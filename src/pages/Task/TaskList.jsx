import React, { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from '../../components/Dashboard/AdminDashboard/Dasboard.module.css';
import taskStyles from './task.module.css';
import Spiner from '../../components/Spiner/Spiner';
import EditTaskForm from './EditTaskForm';
import CreateTask from './CreateTask';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { FaSort } from "react-icons/fa6";
import SearchIcon from "@mui/icons-material/Search";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const tasksPerPage = 9;

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("mockTasks")) || [];
    setTasks(savedTasks);
  }, []);

  const saveToLocalStorage = (updatedTasks) => {
    localStorage.setItem("mockTasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter((task) => task.id !== taskId);
    setTasks(updated);
    saveToLocalStorage(updated);
    toast.success("Task deleted (mock)");
  };

  const handleShowEditModal = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleHideEditModal = () => {
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedData) => {
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? { ...task, ...updatedData } : task
    );
    setTasks(updatedTasks);
    saveToLocalStorage(updatedTasks);
    toast.success("Task updated (mock)");
    handleHideEditModal();
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSort = () =>
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });

  const refreshTasks = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveToLocalStorage(updatedTasks);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const reversedTasks = sortedTasks.slice().reverse();
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = reversedTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className={`container ${taskStyles.taskListContainer}`}>
      <div className={`card mb-2 ${styles.userTable} ${taskStyles.card}`}>
        <div className="card-header bg-primary text-white">
          <i className="fas fa-table me-1"></i> Tasks Data
        </div>
        <div className="mt-4 mb-1 d-flex justify-content-around flex-wrap gap-2">
          <div className="mb-3 col-sm-auto">
            <CreateTask refreshTasks={refreshTasks} />
          </div>
          <div className="mb-3 col-sm-auto">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control"
              />
              <span className="input-group-text">
                <SearchIcon />
              </span>
            </div>
          </div>
          <div className="mb-3 col-sm-auto">
            <FaSort onClick={handleSort} className={`ms-2 ${styles.sortIcon}`} />
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {loading && <Spiner />}
            <Table className={`table table-striped ${taskStyles.taskTable}`}>
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.length > 0 ? currentTasks.map((task, index) => (
                  <tr key={task.id} className={taskStyles.rowHover}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.assignedTo}</td>
                    <td>
                      <span
                        className={`badge ${
                          task.status === "submitted"
                            ? "bg-success"
                            : task.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {task.status || "unknown"}
                      </span>
                    </td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => deleteTask(task.id)}>
                        <DeleteOutlineIcon />
                      </Button>{" "}
                      <Button variant="primary" size="sm" onClick={() => handleShowEditModal(task)}>
                        <CreateIcon />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center">No tasks found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              {[...Array(Math.ceil(reversedTasks.length / tasksPerPage)).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>

      <Modal show={showEditModal} onHide={handleHideEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTask ? "Edit Task" : "Create Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask ? (
            <EditTaskForm task={selectedTask} onUpdate={handleUpdateTask} />
          ) : (
            <CreateTask refreshTasks={refreshTasks} />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskList;