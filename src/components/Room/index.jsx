import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from '../Participant';
import styles from './styles.module.scss';
import Footer from '../Footer';
const Room = ({ roomName, token, handleLogout }) => {
  const [state, setState] = useState({
    room: null,
    participants: [],
  });
  useEffect(() => {
    const participantConnected = (participant) => {
      setState((prev) => ({ ...prev, participants: participant }));
    };
    const participantDisconnected = (participant) => {
      setState((prev) => ({
        ...prev,
        participants: prev.filter((p) => p !== participant),
      }));
    };
    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setState((prev) => ({ ...prev, room: room }));
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });
    return () => {
      // const [ercu, setErcu] = useState()
      // ercu    --> getter
      // setErcu --> setter
      // setErcu('esraa')
      // setErcu((prevState) => 'asdasd')
      setState((prev) => {
        const currentRoom = prev.room;
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return { ...prev, room: null };
        } else {
          return { ...prev, room: currentRoom };
        }
      });
    };
  }, [roomName, token]);
  const remoteParticipants = state?.participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));
  console.log(state);
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <img src="/roomIcon.svg" alt="room" />
        <div className={styles.title}>
          {state?.room?.localParticipant?.identity}
        </div>
        <div className={styles.subtitleWrapper}>
          <div className={styles.subtitle}>
            <img src="/people.svg" alt="people" />
            <div className={styles.blend}>Room Name: {roomName}</div>
          </div>
          <div className={styles.subtitle}>
            <img src="/plus.svg" alt="plus" className={styles.copy} />
            <div>Invited to call</div>
          </div>
        </div>
      </nav>
      {/*      
      <button onClick={handleLogout}>Log out</button> */}
      <div className="local-participant">
        {state.room ? (
          <Participant
            key={state.room.localParticipant.sid}
            participant={state.room.localParticipant}
            handleLogout={handleLogout}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
      <Footer />
    </div>
  );
};
export default Room;
