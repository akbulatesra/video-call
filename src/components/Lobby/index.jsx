import React from 'react';
import Button from '../Button';
import Footer from '../Footer';
import styles from './styles.module.scss';
const Lobby = ({
  state,
  handleUserNameChange,
  handleRoomNameChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <div className={styles.wrapperLeft}>
        <div className={styles.header}>
          Connect face-to-face, no matter where you are.
        </div>
        <input
          value={state.userName}
          placeholder="What's your name?"
          onChange={handleUserNameChange}
        />
        <input
          value={state.roomName}
          placeholder="Room Name"
          onChange={handleRoomNameChange}
        />
        <Button handleSubmit={handleSubmit} />
        <Footer />
      </div>
      <img src="/main.jpg" alt="girl" className={styles.wrapperRight} />
    </form>
  );
};

export default Lobby;
