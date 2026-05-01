import { useState, useRef, useEffect } from 'react';
import type { Cut } from '../data';

interface CutItemProps {
  cut: Cut;
}

export default function CutItem({ cut }: CutItemProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(cut.videoUrl || null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: true 
      });
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

  const resetVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("정말 다시 촬영하시겠습니까? 기존 영상은 삭제됩니다.")) {
      setVideoUrl(null);
    }
  };

  useEffect(() => {
    if (isRecording && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isRecording, stream]);

  return (
    <div className="cut-item">
      <div className="cut-video-wrapper" onClick={() => videoUrl && setIsPreviewOpen(true)}>
        {videoUrl ? (
          <div className="video-preview-state">
            <video src={videoUrl} className="cut-thumbnail" muted loop autoPlay playsInline />
            <div className="video-overlay">
              <span>▶️ 보기</span>
            </div>
            <button className="re-record-badge" onClick={resetVideo}>🔄 다시 찍기</button>
          </div>
        ) : isRecording ? (
          <div className="recording-container">
            <video ref={videoRef} autoPlay muted playsInline className="cut-thumbnail recording-video" />
            <div className="recording-indicator">
              <span className="rec-dot"></span> REC
            </div>
            <button className="record-btn stop" onClick={(e) => { e.stopPropagation(); stopRecording(); }}>
              정지
            </button>
          </div>
        ) : (
          <div className="empty-cut">
            <button className="record-btn" onClick={(e) => { e.stopPropagation(); startRecording(); }}>
              🎥 촬영 시작
            </button>
          </div>
        )}
      </div>
      <p className="cut-title">{cut.title}</p>

      {/* Preview Modal */}
      {isPreviewOpen && videoUrl && (
        <div className="video-modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>영상 확인</h3>
              <button className="close-btn" onClick={() => setIsPreviewOpen(false)}>×</button>
            </header>
            <video src={videoUrl} controls autoPlay className="modal-video" />
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setIsPreviewOpen(false)}>확인</button>
              <button className="modal-btn danger" onClick={(e) => { resetVideo(e); setIsPreviewOpen(false); }}>다시 촬영하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
