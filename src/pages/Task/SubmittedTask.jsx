import React, { useState, useEffect } from 'react';
import { Card, Pagination, Container, Row, Col } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import Spiner from '../../components/Spiner/Spiner';
import styles from './submittedtask.module.css';

const SubmittedTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  useEffect(() => {
    setLoading(true);
    const storedTasks = JSON.parse(localStorage.getItem("mockTasks")) || [];
    setAllTasks(storedTasks);
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = allTasks
      .filter(task => task.status?.toLowerCase() === statusFilter)
      .filter(task => {
        const search = searchTerm.toLowerCase();
        return (
          task.title?.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search) ||
          task.assignedTo?.toLowerCase().includes(search)
        );
      });
    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, allTasks]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value.toLowerCase());

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const submittedCount = allTasks.filter(t => t.status === "submitted").length;
  const pendingCount = allTasks.filter(t => t.status === "pending").length;

  return (
    <Container className={`mt-4 ${styles.submittedTaskPage}`}>
      <Card className={`shadow-sm border-0 ${styles.card}`}>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📄 Submitted Tasks</h5>
        </Card.Header>

        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col sm={4}>
              <h5 className="text-center mb-0">
                {statusFilter === "pending"
                  ? `Pending Tasks: ${pendingCount}`
                  : `Submitted Tasks: ${submittedCount}`}
              </h5>
            </Col>

            {loading && <Spiner />}

            <Col sm={4}>
              <div className={`input-group ${styles.formGroup}`}>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="form-control"
                />
                <span className="input-group-text bg-light">
                  <SearchIcon />
                </span>
              </div>
            </Col>

            <Col sm={4}>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="form-select"
              >
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
              </select>
            </Col>
          </Row>

          <Row xs={1} md={2} lg={3} className="g-4">
            {currentTasks.length === 0 ? (
              <p className="text-center text-muted">No {statusFilter} tasks found.</p>
            ) : (
              currentTasks.map((task) => (
                <Col key={task.id}>
                  <Card className={`h-100 shadow-sm ${styles.card}`}>
                    <Card.Body>
                      <Card.Title className="mb-3">
                        <strong>{task.title}</strong>
                      </Card.Title>
                      <Card.Text>Description: {task.description}</Card.Text>
                      <Card.Text>Assigned To: {task.assignedTo}</Card.Text>
                      <Card.Text>Status: 
                        <span className={`badge ms-2 ${task.status === "submitted" ? "bg-success" : "bg-warning text-dark"}`}>
                          {task.status}
                        </span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              {[...Array(Math.ceil(filteredTasks.length / tasksPerPage)).keys()].map((number) => (
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SubmittedTask;
