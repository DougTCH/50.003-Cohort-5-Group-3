import React from 'react';

const Tasks = () => {
  return (
    <div className="tasks">
      <h3>Earn More Points with Tasks</h3>
      <ul>
        <li>
          <span>Make Your First Transaction on Loyalty Points Page</span>
          <span className="task-reward">Reward: 10 Treats</span>
          <span className="task-status done">Done</span>
        </li>
        <li>
          <span>Sign up for FETCH's Digital Credit Card on Cards Page</span>
          <span className="task-reward">Reward: 10 Treats</span>
          <button className="claim-button">CLAIM</button>
        </li>
        <li>
          <span>Collect All Golden Bone Easter Eggs on our Website!</span>
          <span className="task-reward">Reward: 10 Treats</span>
          <button className="claim-button" disabled>CLAIM</button>
        </li>
      </ul>
    </div>
  );
};

export default Tasks;
