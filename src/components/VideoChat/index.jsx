import React, { useState, useCallback } from 'react';
import Lobby from '../Lobby';
import Room from '../Room';
const VideoChat = () => {
  const [state, setState] = useState({
    userName: '',
    roomName: '',
    token: null,
  });

  const handleUserNameChange = useCallback((e) => {
    setState((prev) => ({ ...prev, userName: e.target.value }));
  }, []);

  const handleRoomNameChange = useCallback((e) => {
    setState((prev) => ({ ...prev, roomName: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const data = await fetch('/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: state.userName,
          room: state.roomName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
      setState((prev) => ({ ...prev, token: data.token }));
    },
    [state.userName, state.roomName]
  );
  console.log(state.token);
  const handleLogout = useCallback((e) => {
    setState((prev) => ({ ...prev, token: e.target.value }));
  }, []);
  let render;
  if (state.token) {
    render = (
      <Room
        roomName={state.roomName}
        token={state.token}
        handleLogout={handleLogout}
      />
    );
  } else {
    render = (
      <Lobby
        handleUserNameChange={handleUserNameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
        state={state}
      />
    );
  }
  return render;
};
export default VideoChat;
