import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Spinner from '../../components/utils/Spinners';
import styles from './task.module.css';

const CreateTask = ({ refreshTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !assignedTo) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // ✅ MOCKED task object
      const mockTask = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        description,
        assignedTo,
        status: "submitted", // ✅ THIS IS THE KEY
        createdAt: new Date().toISOString()
      };

      toast.success("Mock task created!");

      if (refreshTasks) {
        refreshTasks(mockTask); // ✅ Add to local task list
      }

      // Reset form
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setError("");
      handleClose();
    } catch (error) {
      console.error("Error creating mock task:", error.message);
      toast.error("An error occurred while creating the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.taskForm}>
      <Button variant="primary" onClick={handleShow} disabled={loading}>
        {loading ? <Spinner /> : "Create Task"}
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="assignedTo" className="form-label">Assigned To Employee Email</label>
              <input
                type="text"
                className="form-control"
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateTask;
