import React, { useState } from 'react';
import './profile.css';
import UserDetails from './profileHelper/UserDetails';
import TierProgress from './profileHelper/TierProgress';
import Tasks from './profileHelper/Tasks';
import GoldenDogBone from './profileHelper/GoldenDogBone';

const Profile = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      description: 'Make Your First Transaction on Loyalty Points Page',
      reward: '10 Treats',
      status: 'not-claimable',
      points: 10,
    },
    {
      id: 2,
      description: "Sign up for FETCH's Digital Credit Card on Cards Page",
      reward: '30 Treats',
      status: 'not-claimable',
      points: 30,
    },
    {
      id: 3,
      description: 'Collect All Golden Bone Easter Eggs on our Website!',
      reward: '10 Treats',
      status: 'not-claimable',
      points: 10,
    },
    {
      id: 4,
      description: 'Refer a Friend to Join FETCH Banking',
      reward: '25 Treats',
      status: 'not-claimable',
      points: 25,
    },
    {
      id: 5,
      description: 'Make an appointment with FETCH to evaluate your finances',
      reward: '25 Treats',
      status: 'not-claimable',
      points: 25,
    },
    {
      id: 6,
      description: 'Make 5 Transactions within a Month',
      reward: '50 Treats',
      status: 'not-claimable',
      points: 50,
    },
    {
      id: 7,
      description: 'Follow FETCH Banking on Social Media',
      reward: '10 Treats',
      status: 'not-claimable',
      points: 10,
    },
    {
      id: 8,
      description: 'Leave a Google Review on FETCH Services',
      reward: '50 Treats',
      status: 'not-claimable',
      points: 50,
    },
    {
      id: 9,
      description: 'Participate in a FETCH Customer Satisfaction Survey',
      reward: '20 Treats',
      status: 'not-claimable',
      points: 20,
    },
    {
      id: 10,
      description: 'Watch an Educational Video on FETCH Platform',
      reward: '10 Treats',
      status: 'not-claimable',
      points: 10,
    },
    {
      id: 11,
      description: 'Sign up for FETCH 360 Car Insurance',
      reward: '100 Treats',
      status: 'not-claimable',
      points: 100,
    },
    {
      id: 12,
      description: 'Use our One-Click Holiday to book a trip!',
      reward: '200 Treats',
      status: 'not-claimable',
      points: 200,
    },
  ]);

  const [goldenBones, setGoldenBones] = useState(0);

  const makeClaimable = () => {
    setTasks(tasks.map(task =>
      task.status === 'not-claimable' ? { ...task, status: 'claimable' } : task
    ));
  };

  const handleClaim = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'done' } : task
    ));
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-top">
          <UserDetails goldenBones={goldenBones} />
          <TierProgress tasks={tasks} setGoldenBones={setGoldenBones} goldenBones={goldenBones} />
        </div>
        <GoldenDogBone goldenBones={goldenBones} />
        <Tasks tasks={tasks} handleClaim={handleClaim} makeClaimable={makeClaimable} />
      </div>
    </div>
  );
};

export default Profile;
