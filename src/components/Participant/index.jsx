import styles from './styles.module.scss';
import { useState, useEffect, useRef } from 'react';

const Participant = ({ participant, handleLogout }) => {
  const [state, setState] = useState({
    videoTracks: [],
    audioTracks: [],
  });
  const videoRef = useRef();
  const audioRef = useRef();
  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  useEffect(() => {
    const trackSubscribed = (track) => {
      if (track.kind === 'video') {
        setState((prev) => ({ ...prev, videoTracks: track }));
      } else {
        setState((prev) => ({ ...prev, audioTracks: track }));
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === 'video') {
        setState((prev) => ({
          ...prev,
          videoTracks: (videoTracks) => videoTracks.filter((v) => v !== track),
        }));
      } else {
        setState((prev) => ({
          ...prev,
          audioTracks: (audioTracks) => audioTracks.filter((v) => v !== track),
        }));
      }
    };
    setState((prev) => ({
      ...prev,
      videoTracks: trackpubsToTracks(participant.videoTracks),
    }));
    setState((prev) => ({
      ...prev,
      audioTracks: trackpubsToTracks(participant.audioTracks),
    }));

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setState({ videoTracks: [], audioTracks: [] });
      participant.removeAllListeners();
    };
  }, [participant]);
  useEffect(() => {
    const videoTrack = state.videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [state.videoTracks]);
  useEffect(() => {
    const audioTrack = state.audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(videoRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [state.audioTracks]);
  return (
    <div className={styles.wrapper}>
      <div>
        <video ref={videoRef} autoPlay={true} className={styles.video} />
        <div className={styles.footerWrapper}>
          <div className={styles.buttonWrapper}>
            <img src="/kamera.svg" alt="camera" />
            <div className={styles.button} onClick={handleLogout}>
              End Meeting
            </div>
            <img src="/mikrofon.svg" alt="mic" />
          </div>

          <div className={styles.participant}>{participant.identity}</div>
        </div>
      </div>

      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );
};
export default Participant;
