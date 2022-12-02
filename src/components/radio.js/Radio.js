
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting, fetchHlsDownstreamUrl } from "./API";
import ReactPlayer from "react-player";

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div>
      <input
        type="text"
        className="input-metting"
        
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button className="btn" onClick={onClick}>Join</button>
      {" or "}
      <button className="btn" onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function HLSJoinScreen({ onDownstreamUrl }) {
  const [meetingId, setMeetingId] = useState(null);

  const handleOnClick = async (meetingId) => {
    const downstreamUrl = await fetchHlsDownstreamUrl({ meetingId });

    onDownstreamUrl(downstreamUrl);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button className="btn"
        onClick={() => {
          handleOnClick(meetingId);
        }}
      >
        Join
      </button>
    </div>
  );
}

function VideoComponent(props) {
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(
      props.participantId
    );
  
    const videoStream = useMemo(() => {
      if (webcamOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        return mediaStream;
      }
    }, [webcamStream, webcamOn]);
  
   
  
    return (
      <div key={props.participantId}>
        {micOn && micRef && <audio ref={micRef} autoPlay muted={isLocal} />}
        {webcamOn && (
          <ReactPlayer
            //
            playsinline // very very imp prop
            pip={false}
            light={false}
            controls={true}
            muted={true}
            playing={true}
            //
            url={videoStream}
            //
            height={"100px"}
            width={"100px"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        )}
      </div>
    );
  }
function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button className="btn" onClick={leave}>Leave</button>
      <button className="btn" onClick={toggleMic}>toggleMic</button>
      <button className="btn" onClick={toggleWebcam}>toggleWebcam</button>
    </div>
  );
}

function Container(props) {
  const { participants, join, isMeetingJoined, startHls } = useMeeting({
    onMeetingJoined: () => {
      startHls();
    },
    onHlsStarted: (downstreamUrl) => {},
  });

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {isMeetingJoined ? (
        <div>
          <Controls />
          {[...participants.keys()].map((participantId) => (
            <VideoComponent key={participantId} participantId={participantId} />
          ))}
        </div>
      ) : (
        <button className="btn" onClick={join}>Join</button>
      )}
    </div>
  );
}

function MeetingContainer() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Chintan",
      }}
      token={authToken}
    >
      <Container meetingId={meetingId} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

function HLSPlayer({ url, handleOnLeave }) {
  return (
    <>
      <button className="btn" onClick={handleOnLeave}>Leave</button>
      <ReactPlayer
        playing={true}
        playsinline
        height={"70%"}
        width={"60%"}
        url={url}
      />
    </>
  );
}

function HLSContainer() {
  const [downstreamUrl, setDownstreamUrl] = useState("");

  const isJoined = useMemo(() => !!downstreamUrl, [downstreamUrl]);

  return isJoined ? (
    <HLSPlayer
      url={downstreamUrl}
      handleOnLeave={() => {
        setDownstreamUrl("");
      }}
    />
  ) : (
    <HLSJoinScreen
      onDownstreamUrl={(_downstreamUrl) => {
        setDownstreamUrl(_downstreamUrl);
      }}
    />
  );
}

function Radio() {
  const [mode, setMode] = useState("host");

  const isHost = useMemo(() => mode === "host", [mode]);

  useEffect(() => {
    fetchHlsDownstreamUrl({ meetingId: "0g7p-kgnq-spd5" });
  }, []);

  return (
    <div className="body-wrapper">
      <button
      className="btn"
        onClick={() => {
          setMode((s) => {
            return s === "host" ? "viewer" : "host";
          });
        }}
      >
        {isHost ? "Join as a Viewer" : "Join as a Host"}
      </button>
      {isHost ? <MeetingContainer /> : <HLSContainer />}
    </div>
  );
}

export default Radio;
