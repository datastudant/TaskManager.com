import React, { useState, useEffect } from 'react';
import { ProgressBar, Card } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import styles from './TaskDashboard.module.css';

function TaskDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    submittedTasks: 0,
  });

  const totalSpring = useSpring({ val: dashboardData.totalTasks, from: { val: 0 }, config: { duration: 800 } });
  const pendingSpring = useSpring({ val: dashboardData.pendingTasks, from: { val: 0 }, config: { duration: 800 } });
  const submittedSpring = useSpring({ val: dashboardData.submittedTasks, from: { val: 0 }, config: { duration: 800 } });

  useEffect(() => {
    const fetchData = () => {
      const tasks = JSON.parse(localStorage.getItem("mockTasks")) || [];
      const total = tasks.length;
      const pending = tasks.filter(t => t.status === "pending").length;
      const submitted = tasks.filter(t => t.status === "submitted").length;

      setDashboardData({
        totalTasks: total,
        pendingTasks: pending,
        submittedTasks: submitted,
      });
    };
    fetchData();
  }, []);

  const pendingPercentage = Math.round((dashboardData.pendingTasks / dashboardData.totalTasks) * 100) || 0;
  const submittedPercentage = Math.round((dashboardData.submittedTasks / dashboardData.totalTasks) * 100) || 0;

  return (
    <div className={styles.dashboardGrid}>
      <Card className={styles.card}>
        <Card.Body>
          <Card.Title>Total Tasks</Card.Title>
          <animated.span className={styles.animatedCount}>
            {totalSpring.val.to((val) => Math.floor(val))}
          </animated.span>
        </Card.Body>
      </Card>

      <Card className={`${styles.card} ${styles.warningCard}`}>
        <Card.Body>
          <Card.Title>Pending Tasks</Card.Title>
          <animated.span className={styles.animatedCount}>
            {pendingSpring.val.to((val) => Math.floor(val))}
          </animated.span>
          <ProgressBar
            now={pendingPercentage}
            label={`${pendingPercentage}%`}
            variant="warning"
          />
        </Card.Body>
      </Card>

      <Card className={`${styles.card} ${styles.successCard}`}>
        <Card.Body>
          <Card.Title>Submitted Tasks</Card.Title>
          <animated.span className={styles.animatedCount}>
            {submittedSpring.val.to((val) => Math.floor(val))}
          </animated.span>
          <ProgressBar
            now={submittedPercentage}
            label={`${submittedPercentage}%`}
            variant="success"
          />
        </Card.Body>
      </Card>
    </div>
  );
}

export default TaskDashboard;
