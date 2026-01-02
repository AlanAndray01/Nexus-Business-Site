import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  // Phone, PhoneOff, Mic, 
  MicOff, 
  // Video, 
  VideoOff, 
  // Monitor, MonitorOff, 
  Users, MessageSquare, Settings } from 'lucide-react';
import { CallState, CallAction, Participant } from '../../types/video';
import { useAuth } from '../../context/AuthContext';
import ParticipantGrid from '../../components/video/ParticipantGrid';
import VideoControls from '../../components/video/VideoControls';

const initialState: CallState = {
  callId: '',
  isActive: false,
  startTime: null,
  duration: 0,
  participants: [],
  localSettings: {
    audioEnabled: true,
    videoEnabled: true,
    screenSharing: false,
  },
  isConnecting: false,
  error: null,
};

function callReducer(state: CallState, action: CallAction): CallState {
  switch (action.type) {
    case 'START_CALL':
      return {
        ...state,
        callId: action.payload.callId,
        isActive: true,
        startTime: new Date(),
        isConnecting: false,
      };
    case 'END_CALL':
      return {
        ...initialState,
      };
    case 'TOGGLE_AUDIO':
      return {
        ...state,
        localSettings: {
          ...state.localSettings,
          audioEnabled: !state.localSettings.audioEnabled,
        },
      };
    case 'TOGGLE_VIDEO':
      return {
        ...state,
        localSettings: {
          ...state.localSettings,
          videoEnabled: !state.localSettings.videoEnabled,
        },
      };
    case 'TOGGLE_SCREEN_SHARE':
      return {
        ...state,
        localSettings: {
          ...state.localSettings,
          screenSharing: !state.localSettings.screenSharing,
        },
      };
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };
    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
      };
    case 'UPDATE_DURATION':
      return {
        ...state,
        duration: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isConnecting: false,
      };
    default:
      return state;
  }
}

const VideoCallPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(callReducer, initialState);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    // Simulate starting call
    if (user && meetingId) {
      setTimeout(() => {
        dispatch({ type: 'START_CALL', payload: { callId: meetingId } });
        
        // Add mock participants
        const mockParticipants: Participant[] = [
          {
            id: user.id,
            name: user.name,
            role: user.role,
            avatarUrl: user.avatarUrl,
            isAudioEnabled: true,
            isVideoEnabled: true,
            isScreenSharing: false,
          },
          {
            id: 'remote-1',
            name: 'Sarah Investor',
            role: 'investor',
            isAudioEnabled: true,
            isVideoEnabled: true,
            isScreenSharing: false,
          },
        ];
        
        mockParticipants.forEach((participant) => {
          dispatch({ type: 'ADD_PARTICIPANT', payload: participant });
        });
      }, 1000);
    }
  }, [user, meetingId]);

  // Update call duration
  useEffect(() => {
    if (state.isActive && state.startTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - state.startTime!.getTime()) / 1000);
        dispatch({ type: 'UPDATE_DURATION', payload: duration });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.isActive, state.startTime]);

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    dispatch({ type: 'END_CALL' });
    navigate(-1);
  };

  const handleToggleAudio = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  const handleToggleVideo = () => {
    dispatch({ type: 'TOGGLE_VIDEO' });
  };

  const handleToggleScreenShare = () => {
    dispatch({ type: 'TOGGLE_SCREEN_SHARE' });
  };

  if (!state.isActive && !state.isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-white font-semibold">Meeting: {meetingId}</h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">{formatDuration(state.duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <ParticipantGrid 
          participants={state.participants}
          isScreenSharing={state.localSettings.screenSharing}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-6 py-4">
        <VideoControls
          audioEnabled={state.localSettings.audioEnabled}
          videoEnabled={state.localSettings.videoEnabled}
          screenSharing={state.localSettings.screenSharing}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onToggleScreenShare={handleToggleScreenShare}
          onEndCall={handleEndCall}
        />
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-lg z-50 border-l border-gray-700">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-semibold">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="p-4 text-gray-400 text-center">
            Chat feature coming soon...
          </div>
        </div>
      )}

      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-lg z-50 border-l border-gray-700">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-semibold">Participants ({state.participants.length})</h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-2">
            {state.participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {participant.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{participant.name}</p>
                  <p className="text-gray-400 text-xs">{participant.role}</p>
                </div>
                <div className="flex space-x-1">
                  {!participant.isAudioEnabled && (
                    <MicOff className="w-4 h-4 text-red-500" />
                  )}
                  {!participant.isVideoEnabled && (
                    <VideoOff className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;