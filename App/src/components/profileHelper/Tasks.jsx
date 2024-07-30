import React from 'react';
import doneImage from '../../assets/UI_ASSETS/UI_GREEN_CHECK.svg';

const Tasks = ({ tasks, handleClaim, makeClaimable }) => {
  return (
    <div className="tasks">
      <h3>Earn More Points with Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.description}</span>
            <span className="task-reward">Reward: {task.reward}</span>
            {task.status === 'done' ? (
              <span className="task-status done">
                <img src={doneImage} alt="Done" style={{ width: '20px', marginRight: '8px' }} />
                Done
              </span>
            ) : task.status === 'claimable' ? (
              <button 
                className="claim-button"
                onClick={() => handleClaim(task.id)}
              >
                CLAIM
              </button>
            ) : (
              <button 
                className="claim-button"
                disabled
              >
                CLAIM
              </button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={makeClaimable}>
        Make All Tasks Claimable
      </button>
    </div>
  );
};

export default Tasks;
