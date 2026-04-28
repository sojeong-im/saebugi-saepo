import { useState, useRef, useEffect } from 'react';
import type { Cut } from '../data';

interface CutItemProps {
  cut: Cut;
}

export default function CutItem({ cut }: CutItemProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(cut.videoUrl || null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setIsRecording(true);

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("카메라 접근 에러:", err);
      alert("카메라 및 마이크 권한이 필요합니다.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const resetVideo = () => {
    setVideoUrl(null);
  };

  useEffect(() => {
    if (isRecording && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isRecording, stream]);

  return (
    <div className="cut-item">
      <div className="cut-video-wrapper">
        {videoUrl ? (
          <>
            <video src={videoUrl} controls className="cut-thumbnail" />
            <button className="reset-btn" onClick={resetVideo}>X</button>
          </>
        ) : isRecording ? (
          <div className="recording-container">
            <video ref={videoRef} autoPlay muted className="cut-thumbnail recording-video" />
            <div className="recording-indicator"></div>
            <button className="record-btn stop" onClick={stopRecording}>정지</button>
          </div>
        ) : (
          <div className="empty-cut">
            <button className="record-btn" onClick={startRecording}>
              🎥 촬영
            </button>
          </div>
        )}
      </div>
      <p className="cut-title">{cut.title}</p>
    </div>
  );
}
