import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  MessageSquare,
  Send,
  UserPlus,
  Paperclip,
  FileCheck,
  RefreshCw,
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  X,
  FileText,
  Download,
  AlertCircle,
  Square,
  Play,
  Pause,
  Trash2,
  Image as ImageIcon,
  Lock
} from "lucide-react";
import { buildApiUrl, getAuthToken } from "../lib/api.js";

const authFetch = async (input, init = {}) => {
  const url = typeof input === "string" ? buildApiUrl(input) : input;
  const headers = new Headers(init.headers || {});
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, {
    ...init,
    headers,
    credentials: init.credentials || "include",
  });
};

export default function ConversationsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [activeConvData, setActiveConvData] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingActive, setLoadingActive] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
  const [recordingError, setRecordingError] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const [playingMsgId, setPlayingMsgId] = useState(null);
  const audioPlayerRef = useRef(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newDealStatus, setNewDealStatus] = useState("terms_agreed");
  const [agreedPrice, setAgreedPrice] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteRole, setInviteRole] = useState("exporter");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedInviteUserId, setSelectedInviteUserId] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [callState, setCallState] = useState("idle");
  const [callType, setCallType] = useState("voice");
  const [incomingCall, setIncomingCall] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callError, setCallError] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const callTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    authFetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) setCurrentUser(d.user);
    }).catch((e) => console.error(e));
  }, []);
  const initDealRooms = async () => {
    try {
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const targetUserId = params.get("targetUserId");
      const dealId = params.get("id");
      const newDeal = params.get("newDeal");
      const dealTitle = params.get("title");
      const res = await authFetch("/api/conversations");
      const data = await res.json();
      const list = data.conversations || [];
      setConversations(list);
      if (targetUserId) {
        const targetNum = Number(targetUserId);
        const existing = list.find(
          (c) => c.participants?.some((p) => p.userId === targetNum || p.id === targetNum)
        );
        if (existing) {
          setSelectedConvId(existing.id);
        } else {
          try {
            const roleForCounterparty = newDeal === "transport" ? "driver" : newDeal === "product" ? "exporter" : "importer";
            const roleForMe = newDeal === "transport" ? "importer" : currentUser?.role || "importer";
            const createRes = await authFetch("/api/conversations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: dealTitle ? `${newDeal === "transport" ? "Transport" : newDeal === "product" ? "Product" : "Demand"}: ${decodeURIComponent(dealTitle)}` : "Commercial Deal Room",
                targetUserId: targetNum,
                targetUserRole: roleForCounterparty,
                transportOfferId: newDeal === "transport" && dealId ? Number(dealId) : null,
                productId: newDeal === "product" && dealId ? Number(dealId) : null,
                demandId: newDeal === "demand" && dealId ? Number(dealId) : null,
                initialMessage: dealTitle ? `Hello! I would like to negotiate and book for: "${decodeURIComponent(dealTitle)}". Please share rates and available schedule.` : "Hello! I am interested in collaborating on this cross-border trade transaction."
              })
            });
            const createData = await createRes.json();
            if (createData.conversation) {
              setSelectedConvId(createData.conversation.id);
              const freshRes = await authFetch("/api/conversations");
              const freshData = await freshRes.json();
              setConversations(freshData.conversations || []);
            }
          } catch (err) {
            console.error("Error creating deal room:", err);
          }
        }
      } else if (list.length > 0 && !selectedConvId) {
        setSelectedConvId(list[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };
  useEffect(() => {
    initDealRooms();
  }, []);
  const loadActiveConversation = async (id) => {
    setLoadingActive(true);
    try {
      const res = await authFetch(`/api/conversations/${id}`);
      const data = await res.json();
      setActiveConvData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActive(false);
    }
  };
  useEffect(() => {
    if (selectedConvId) {
      loadActiveConversation(selectedConvId);
    }
  }, [selectedConvId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvData?.messages]);
  const handleMultipleAttachments = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 15MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            type: file.type.includes("pdf") ? "pdf" : "image",
            dataUrl: reader.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeAttachment = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const startVoiceRecording = async () => {
    setRecordingError("");
    audioChunksRef.current = [];
    setRecordedAudioBlob(null);
    setRecordedAudioUrl("");
    setRecordingSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedAudioBlob(audioBlob);
        const reader = new FileReader();
        reader.onload = () => {
          setRecordedAudioUrl(reader.result);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start(200);
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1e3);
    } catch (err) {
      console.error("Microphone access error:", err);
      setRecordingError("Microphone access denied. Please allow microphone access in browser settings.");
    }
  };
  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };
  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    setRecordedAudioBlob(null);
    setRecordedAudioUrl("");
    setRecordingSeconds(0);
    setRecordingError("");
  };
  const discardRecordedVoice = () => {
    setRecordedAudioBlob(null);
    setRecordedAudioUrl("");
    setRecordingSeconds(0);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConvId) return;
    const hasText = messageText.trim().length > 0;
    const hasAttachments = attachedFiles.length > 0;
    const hasVoiceNote = !!recordedAudioUrl;
    if (!hasText && !hasAttachments && !hasVoiceNote) return;
    setSending(true);
    try {
      const payload = {
        content: messageText.trim()
      };
      if (hasVoiceNote) {
        payload.attachmentType = "voice_note";
        payload.attachmentName = `Voice_Note_${Date.now()}.webm`;
        payload.attachmentUrl = recordedAudioUrl;
        payload.voiceDuration = recordingSeconds || 5;
        if (!payload.content) payload.content = `\u{1F3A4} Voice Note (${recordingSeconds || 5}s)`;
      } else if (hasAttachments) {
        payload.attachments = attachedFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          url: f.dataUrl
        }));
        payload.attachmentName = attachedFiles[0].name;
        payload.attachmentType = attachedFiles[0].type;
        payload.attachmentUrl = attachedFiles[0].dataUrl;
        if (!payload.content) {
          payload.content = `\u{1F4CE} Attached ${attachedFiles.length} trade document(s): ${attachedFiles.map((f) => f.name).join(", ")}`;
        }
      }
      const res = await authFetch(`/api/conversations/${selectedConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMessageText("");
        setAttachedFiles([]);
        discardRecordedVoice();
        loadActiveConversation(selectedConvId);
      }
    } catch (e2) {
      console.error(e2);
    } finally {
      setSending(false);
    }
  };
  const handleAttachProforma = async () => {
    if (!selectedConvId) return;
    try {
      await authFetch(`/api/conversations/${selectedConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "\u{1F4C4} Attached Proforma Commercial Invoice & WebOC Gatepass Checklist for corridor customs clearance.",
          attachmentName: "Proforma_Invoice_Corridor.pdf",
          attachmentType: "pdf",
          attachmentUrl: "/attachments/Proforma_Invoice_Corridor.pdf"
        })
      });
      loadActiveConversation(selectedConvId);
    } catch (e) {
      console.error(e);
    }
  };
  const handleUpdateStatus = async () => {
    if (!selectedConvId) return;
    try {
      await authFetch(`/api/conversations/${selectedConvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealStatus: newDealStatus,
          agreedPrice: agreedPrice || void 0
        })
      });
      setShowStatusModal(false);
      loadActiveConversation(selectedConvId);
      initDealRooms();
    } catch (e) {
      console.error(e);
    }
  };
  const fetchUsersForInvite = async (roleToFetch) => {
    setLoadingUsers(true);
    try {
      const res = await authFetch(`/api/users?role=${roleToFetch}`);
      const data = await res.json();
      const usersList = data.users || [];
      setAvailableUsers(usersList);
      if (usersList.length > 0) {
        setSelectedInviteUserId(usersList[0].id.toString());
      } else {
        setSelectedInviteUserId("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };
  useEffect(() => {
    if (showInviteModal) {
      fetchUsersForInvite(inviteRole);
    }
  }, [showInviteModal, inviteRole]);
  const handleInvitePartner = async () => {
    if (!selectedConvId || !selectedInviteUserId) return;
    try {
      await authFetch(`/api/conversations/${selectedConvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite_participant",
          newParticipantId: Number(selectedInviteUserId),
          newParticipantRole: inviteRole
        })
      });
      setShowInviteModal(false);
      await loadActiveConversation(selectedConvId);
      await initDealRooms();
    } catch (e) {
      console.error(e);
    }
  };
  const cleanupCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setCallState("idle");
    setIncomingCall(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    setCallError("");
  };
  const getIceServers = async () => {
    try {
      const res = await authFetch("/api/webrtc/ice-servers");
      if (res.ok) {
        const data = await res.json();
        if (data.iceServers && Array.isArray(data.iceServers)) {
          return data.iceServers;
        }
      }
    } catch (e) {
      console.warn("Falling back to default STUN servers:", e);
    }
    return [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ];
  };
  const startCall = async (type) => {
    if (!selectedConvId) return;
    setCallType(type);
    setCallState("calling");
    setCallError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video"
      });
      localStreamRef.current = stream;
      if (localVideoRef.current && type === "video") {
        localVideoRef.current.srcObject = stream;
      }
      const iceServers = await getIceServers();
      const pc = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = pc;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          authFetch(`/api/conversations/${selectedConvId}/call`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "candidate", candidate: event.candidate })
          }).catch(console.error);
        }
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await authFetch(`/api/conversations/${selectedConvId}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "initiate",
          callType: type,
          offerSdp: offer
        })
      });
    } catch (err) {
      console.error("Call initiation error:", err);
      setCallError(
        err.name === "NotAllowedError" ? "Microphone or camera permission was denied by browser." : `Device media error: ${err.message}`
      );
    }
  };
  const acceptCall = async () => {
    if (!selectedConvId || !incomingCall) return;
    const type = incomingCall.callType || "voice";
    setCallType(type);
    setCallState("connected");
    setIncomingCall(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video"
      });
      localStreamRef.current = stream;
      if (localVideoRef.current && type === "video") {
        localVideoRef.current.srcObject = stream;
      }
      const iceServers = await getIceServers();
      const pc = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = pc;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          authFetch(`/api/conversations/${selectedConvId}/call`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "candidate", candidate: event.candidate })
          }).catch(console.error);
        }
      };
      if (incomingCall.offerSdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offerSdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await authFetch(`/api/conversations/${selectedConvId}/call`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "answer",
            answerSdp: answer
          })
        });
      }
      callTimerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1e3);
    } catch (err) {
      console.error("Accept call error:", err);
      setCallError(`Media error: ${err.message}`);
    }
  };
  const rejectCall = async () => {
    if (!selectedConvId) return;
    await authFetch(`/api/conversations/${selectedConvId}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" })
    }).catch(console.error);
    setIncomingCall(null);
  };
  const endCall = async () => {
    if (!selectedConvId) return;
    await authFetch(`/api/conversations/${selectedConvId}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "end" })
    }).catch(console.error);
    cleanupCall();
    loadActiveConversation(selectedConvId);
  };
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => t.enabled = !t.enabled);
      setIsMuted(!isMuted);
    }
  };
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => t.enabled = !t.enabled);
      setIsCameraOff(!isCameraOff);
    }
  };
  useEffect(() => {
    if (!selectedConvId) return;
    const pollInterval = setInterval(async () => {
      try {
        const res = await authFetch(`/api/conversations/${selectedConvId}/call`);
        const data = await res.json();
        const session = data.call;
        if (!session) return;
        if (session.status === "ringing" && currentUser && session.callerId !== currentUser.id && callState === "idle" && !incomingCall) {
          setIncomingCall(session);
        }
        if (callState === "calling" && session.status === "connected" && session.answerSdp) {
          if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== "closed") {
            try {
              if (peerConnectionRef.current.currentRemoteDescription === null) {
                await peerConnectionRef.current.setRemoteDescription(
                  new RTCSessionDescription(session.answerSdp)
                );
              }
            } catch (err) {
              console.error(err);
            }
          }
          setCallState("connected");
          if (!callTimerRef.current) {
            callTimerRef.current = setInterval(() => {
              setCallDuration((d) => d + 1);
            }, 1e3);
          }
        }
        if ((callState === "calling" || callState === "connected") && (session.status === "ended" || session.status === "rejected")) {
          cleanupCall();
          loadActiveConversation(selectedConvId);
        }
      } catch (err) {
      }
    }, 2e3);
    return () => clearInterval(pollInterval);
  }, [selectedConvId, currentUser, callState, incomingCall]);
  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  if (!loadingList && !currentUser) {
    return <AppShell>
        <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[#142B4A]">
              Private Commercial Deal Rooms
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Deal room negotiations, bilateral trade contracts, document attachments, and WebRTC voice/video calls are strictly confidential and restricted to authorized transaction counterparties.
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 max-w-md mx-auto">
            <strong>Confidentiality Guarantee:</strong> Conversation history and counterparty details are never exposed to public internet visitors or unauthenticated explorers.
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
      to="/login"
      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
    >
              Sign In to Access Deals
            </Link>
            <Link
      to="/register"
      className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition"
    >
              Register as Trader
            </Link>
          </div>
        </div>
      </AppShell>;
  }
  return <AppShell>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col md:flex-row h-[800px]">
        {
    /* Left Panel: Conversation List */
  }
        <div className="w-full md:w-80 border-r border-[#E2E8F0] flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#142B4A]">Deal Rooms & Messages</h2>
              <p className="text-[11px] text-slate-500">Authorized bilateral & 3-way negotiations</p>
            </div>
            <button
    onClick={() => initDealRooms()}
    className="p-1 rounded hover:bg-slate-100 text-slate-500"
    title="Refresh messages"
  >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingList ? <div className="p-4 text-xs text-slate-400">Loading deal rooms...</div> : conversations.length > 0 ? conversations.map((conv) => {
    const isSelected = selectedConvId === conv.id;
    const participants = conv.participants || [];
    return <button
      key={conv.id}
      onClick={() => setSelectedConvId(conv.id)}
      className={`w-full text-left p-3.5 transition flex flex-col gap-1 ${isSelected ? "bg-blue-50/70 border-l-4 border-blue-600" : "hover:bg-slate-100/70"}`}
    >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#142B4A] line-clamp-1">
                        {conv.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="capitalize font-medium text-slate-700">
                        {participants.map((p) => p.fullName?.split(" ")[0] || "Trader").join(", ")}
                      </span>
                      {participants.length > 2 && <span className="bg-indigo-100 text-indigo-700 font-bold px-1 rounded text-[9px]">
                          3-WAY ROOM
                        </span>}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                      <StatusBadge status={conv.dealStatus} size="sm" />
                    </div>
                  </button>;
  }) : <div className="p-6 text-center text-xs text-slate-400">
                No active deal rooms found. Click "Get Offer / Book Vehicle" to start a transport deal!
              </div>}
          </div>
        </div>

        {
    /* Center Panel: Active Deal Chat & WebRTC Calling */
  }
        {selectedConvId && activeConvData ? <div className="flex-1 flex flex-col bg-white relative">
            {
    /* Header of Active Deal */
  }
            <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#142B4A]">
                    {activeConvData.conversation?.title}
                  </h3>
                  <StatusBadge status={activeConvData.conversation?.dealStatus} size="sm" />
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Authorized Participants:</span>
                  <div className="flex items-center gap-1 font-medium text-slate-700 flex-wrap">
                    {activeConvData.participants?.map((p) => <span key={p.id} className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {p.fullName} ({p.roleInDeal?.toUpperCase() || "TRADER"})
                      </span>)}
                  </div>
                </div>
              </div>

              {
    /* Deal Action Controls & Voice/Video Call Buttons */
  }
              <div className="flex items-center gap-2">
                {
    /* Voice Call Button */
  }
                <button
    type="button"
    onClick={() => startCall("voice")}
    disabled={callState !== "idle"}
    className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
    title="Start encrypted 1-to-1 WebRTC voice call"
  >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Voice Call
                </button>

                {
    /* Video Call Button */
  }
                <button
    type="button"
    onClick={() => startCall("video")}
    disabled={callState !== "idle"}
    className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
    title="Start 1-to-1 WebRTC video call with local/remote preview"
  >
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  Video Call
                </button>

                <button
    onClick={() => {
      setShowInviteModal(true);
      setInviteRole("exporter");
    }}
    className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
    title="Invite exporter, importer or transporter to this room"
  >
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite Partner
                </button>

                <button
    onClick={() => setShowStatusModal(true)}
    className="inline-flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
  >
                  Status
                </button>
              </div>
            </div>

            {
    /* Tripartite Workflow Progress Bar */
  }
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 overflow-x-auto">
              <span className={activeConvData.conversation?.dealStatus === "inquiry" ? "font-bold text-blue-700" : ""}>
                1. Inquiry
              </span>
              <span>→</span>
              <span className={activeConvData.conversation?.dealStatus === "terms_agreed" ? "font-bold text-blue-700" : ""}>
                2. Terms Agreed
              </span>
              <span>→</span>
              <span className={activeConvData.conversation?.dealStatus === "transporter_invited" ? "font-bold text-blue-700" : ""}>
                3. Transporter Added
              </span>
              <span>→</span>
              <span className={activeConvData.conversation?.dealStatus === "booked" ? "font-bold text-blue-700" : ""}>
                4. Vehicle Booked
              </span>
              <span>→</span>
              <span className={activeConvData.conversation?.dealStatus === "in_transit" ? "font-bold text-blue-700" : ""}>
                5. In Transit (GPS Active)
              </span>
            </div>

            {
    /* Incoming Call Notification Banner */
  }
            {incomingCall && <div className="p-3 bg-amber-500 text-white flex items-center justify-between animate-bounce shadow-md">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {incomingCall.callType === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  <span>
                    Incoming {incomingCall.callType === "video" ? "Video" : "Voice"} Call from{" "}
                    <strong>{incomingCall.callerName}</strong> ({incomingCall.callerRole})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
    onClick={acceptCall}
    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs"
  >
                    <Phone className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button
    onClick={rejectCall}
    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs"
  >
                    <PhoneOff className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              </div>}

            {
    /* Messages Feed with Sender-Distinguished Chat Bubbles */
  }
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
              {activeConvData.messages?.map((msg) => {
    const isSystem = msg.content.startsWith("\u{1F4CC}") || msg.content.startsWith("\u{1F504}") || msg.content.startsWith("\u{1F4DE}") || msg.content.startsWith("\u{1F4F9}");
    if (isSystem) {
      return <div key={msg.id} className="py-1 text-center">
                      <span className="inline-block bg-slate-200/80 text-slate-700 text-[11px] px-3.5 py-1 rounded-full border border-slate-300/50 shadow-2xs font-medium">
                        {msg.content}
                      </span>
                    </div>;
    }
    const isMe = msg.senderId === currentUser?.id;
    const participant = activeConvData.participants?.find(
      (p) => p.id === msg.senderId || p.userId === msg.senderId
    );
    const senderRole = (msg.senderRole || participant?.roleInDeal || participant?.role || msg.userRole || "Trader").toUpperCase();
    let parsedAttachments = [];
    if (msg.attachments) {
      try {
        parsedAttachments = JSON.parse(msg.attachments);
      } catch (e) {
        parsedAttachments = [];
      }
    }
    return <div
      key={msg.id}
      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
    >
                    {
      /* Header Label: Displays You vs Counterparty Name & Role */
    }
                    <div
      className={`flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}
    >
                      <span className={`font-bold ${isMe ? "text-blue-900" : "text-slate-800"}`}>
                        {isMe ? "You" : msg.senderName}
                      </span>

                      <span
      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${senderRole === "DRIVER" ? "bg-amber-100 text-amber-800 border border-amber-200" : senderRole === "IMPORTER" ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}
    >
                        {senderRole}
                      </span>

                      <span>•</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })}
                      </span>
                    </div>

                    {
      /* Chat Bubble: Distinct Styling for Sender vs Receiver */
    }
                    <div
      className={`max-w-xl text-xs leading-relaxed p-3.5 rounded-2xl shadow-xs ${isMe ? "bg-[#142B4A] text-white rounded-tr-xs" : "bg-white border border-slate-200 text-[#172B4D] rounded-tl-xs"}`}
    >
                      {
      /* Text Content */
    }
                      {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                      {
      /* Voice Note Audio Player */
    }
                      {(msg.attachmentType === "voice_note" || msg.voiceDuration) && msg.attachmentUrl && <div
      className={`mt-2 p-2.5 rounded-xl flex items-center gap-3 ${isMe ? "bg-white/10 border border-white/20" : "bg-slate-50 border border-slate-200"}`}
    >
                          <button
      type="button"
      onClick={() => {
        if (playingMsgId === msg.id && audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          setPlayingMsgId(null);
        } else {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }
          const audio = new Audio(msg.attachmentUrl);
          audioPlayerRef.current = audio;
          setPlayingMsgId(msg.id);
          audio.play();
          audio.onended = () => setPlayingMsgId(null);
        }
      }}
      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${isMe ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
    >
                            {playingMsgId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                              <span>🎤 Voice Message</span>
                              <span className="opacity-80">
                                {msg.voiceDuration ? `${Math.round(Number(msg.voiceDuration))}s` : "Audio"}
                              </span>
                            </div>

                            {
      /* Audio Waveform Graphic */
    }
                            <div className="flex items-center gap-0.5 h-3">
                              {[40, 70, 30, 90, 60, 80, 45, 100, 50, 75, 35, 85, 65, 95, 40].map(
      (h, i) => <div
        key={i}
        className={`flex-1 rounded-full transition-all ${isMe ? "bg-white/60" : "bg-blue-400"}`}
        style={{ height: `${h}%` }}
      />
    )}
                            </div>
                          </div>
                        </div>}

                      {
      /* Multiple Document Attachments */
    }
                      {parsedAttachments.length > 0 ? <div className="mt-2.5 space-y-2">
                          {parsedAttachments.map((att, idx) => <div
      key={idx}
      className={`p-2 rounded-lg flex items-center justify-between gap-2 text-xs ${isMe ? "bg-white/10 border border-white/20" : "bg-blue-50/70 border border-blue-200"}`}
    >
                              <div className="flex items-center gap-2 truncate">
                                {att.type === "pdf" ? <FileText className={`w-4 h-4 shrink-0 ${isMe ? "text-blue-300" : "text-blue-600"}`} /> : <ImageIcon className={`w-4 h-4 shrink-0 ${isMe ? "text-blue-300" : "text-blue-600"}`} />}
                                <div className="truncate">
                                  <div className="font-medium truncate">{att.name}</div>
                                  <div className="text-[10px] opacity-75">{att.size}</div>
                                </div>
                              </div>

                              <a
      href={att.dataUrl || `/attachments/${encodeURIComponent(att.name)}`}
      target="_blank"
      rel="noreferrer"
      download={att.name}
      className={`px-2 py-1 rounded text-[10px] font-semibold transition shrink-0 flex items-center gap-1 ${isMe ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}
    >
                                <Download className="w-3 h-3" />
                                Download
                              </a>
                            </div>)}
                        </div> : (
      /* Single Legacy Attachment Fallback */
      msg.attachmentName && msg.attachmentType !== "voice_note" && <div
        className={`mt-2.5 p-2 rounded-lg flex items-center justify-between gap-2 text-xs ${isMe ? "bg-white/10 border border-white/20" : "bg-blue-50/70 border border-blue-200"}`}
      >
                            <div className="flex items-center gap-2 truncate">
                              <FileCheck className={`w-4 h-4 shrink-0 ${isMe ? "text-blue-300" : "text-blue-600"}`} />
                              <span className="font-medium truncate">{msg.attachmentName}</span>
                            </div>

                            {msg.attachmentUrl && <a
        href={msg.attachmentUrl}
        target="_blank"
        rel="noreferrer"
        download={msg.attachmentName}
        className={`px-2 py-1 rounded text-[10px] font-semibold transition shrink-0 flex items-center gap-1 ${isMe ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}
      >
                                <Download className="w-3 h-3" />
                                Download
                              </a>}
                          </div>
    )}
                    </div>
                  </div>;
  })}
              <div ref={messagesEndRef} />
            </div>

            {
    /* Pending Attachments Tray */
  }
            {attachedFiles.length > 0 && <div className="px-3 py-2 bg-blue-50 border-t border-blue-200 flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-blue-900 shrink-0">
                  Attached ({attachedFiles.length}):
                </span>
                {attachedFiles.map((f, i) => <div
    key={i}
    className="inline-flex items-center gap-1.5 bg-white border border-blue-200 px-2 py-1 rounded-lg text-xs text-blue-950 shrink-0 shadow-2xs"
  >
                    {f.type === "pdf" ? <FileText className="w-3.5 h-3.5 text-blue-600" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="font-medium truncate max-w-[120px]">{f.name}</span>
                    <span className="text-[10px] text-slate-400">({f.size})</span>
                    <button
    type="button"
    onClick={() => removeAttachment(i)}
    className="text-slate-400 hover:text-rose-600 ml-1"
  >
                      <X className="w-3 h-3" />
                    </button>
                  </div>)}
              </div>}

            {
    /* Voice Recording Active Bar */
  }
            {isRecording && <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span>Recording Voice Note:</span>
                  <span className="font-mono text-sm">{formatTimer(recordingSeconds)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
    type="button"
    onClick={cancelVoiceRecording}
    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
  >
                    Cancel
                  </button>
                  <button
    type="button"
    onClick={stopVoiceRecording}
    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs"
  >
                    <Square className="w-3 h-3" /> Stop & Preview
                  </button>
                </div>
              </div>}

            {
    /* Recorded Voice Note Preview Tray */
  }
            {!isRecording && recordedAudioUrl && <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900 text-xs font-semibold">
                  <span>🎤 Voice Note Ready ({recordingSeconds}s)</span>
                  <audio src={recordedAudioUrl} controls className="h-8 w-48" />
                </div>
                <button
    type="button"
    onClick={discardRecordedVoice}
    className="text-slate-400 hover:text-rose-600 p-1"
    title="Discard voice recording"
  >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>}

            {
    /* Recording Error */
  }
            {recordingError && <div className="px-3 py-1.5 bg-rose-100 text-rose-800 text-xs border-t border-rose-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{recordingError}</span>
              </div>}

            {
    /* Composer Input Bar */
  }
            <div className="p-3 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {
    /* Hidden File Input for Multiple Device Attachments */
  }
                <input
    type="file"
    ref={fileInputRef}
    multiple
    accept=".pdf,.png,.jpg,.jpeg,.webp"
    className="hidden"
    onChange={handleMultipleAttachments}
  />

                {
    /* Multiple Device Attachment Trigger */
  }
                <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    title="Upload multiple trade documents (PDF, JPG, PNG) from your device"
    className="p-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition"
  >
                  <Paperclip className="w-4 h-4" />
                </button>

                {
    /* Voice Note Record Trigger */
  }
                <button
    type="button"
    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
    title="Record and send voice note"
    className={`p-2.5 rounded-lg border transition ${isRecording ? "bg-rose-600 text-white border-rose-600" : "text-slate-600 hover:text-rose-600 hover:bg-rose-50 border-slate-200"}`}
  >
                  <Mic className="w-4 h-4" />
                </button>

                {
    /* Proforma Quick Attachment */
  }
                <button
    type="button"
    onClick={handleAttachProforma}
    title="Attach Proforma Commercial Specification"
    className="p-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition hidden sm:inline-flex"
  >
                  <FileText className="w-4 h-4" />
                </button>

                <input
    type="text"
    placeholder="Type message, negotiate pricing, or confirm haulage..."
    value={messageText}
    onChange={(e) => setMessageText(e.target.value)}
    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />

                <button
    type="submit"
    disabled={sending || !messageText.trim() && attachedFiles.length === 0 && !recordedAudioUrl}
    className="inline-flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 rounded-lg disabled:opacity-50 transition"
  >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </form>
            </div>

            {
    /* ================= Active Call Overlay / Screen ================= */
  }
            {callState !== "idle" && <div className="absolute inset-0 bg-slate-900/95 z-40 flex flex-col justify-between p-6 text-white backdrop-blur-md">
                {
    /* Top Call Bar */
  }
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-sm">
                      {callType === "video" ? "\u{1F4F9} WebRTC Video Call" : "\u{1F4DE} Encrypted Voice Call"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                      {callState === "connected" ? formatTimer(callDuration) : "Ringing..."}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    Room: {activeConvData.conversation?.title}
                  </div>
                </div>

                {
    /* Error Banner if any */
  }
                {callError && <div className="p-3 bg-rose-500/80 border border-rose-400 rounded-lg text-xs flex items-center gap-2 text-white">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{callError}</span>
                  </div>}

                {
    /* Center Video / Audio Stream Display */
  }
                <div className="flex-1 my-4 flex items-center justify-center relative min-h-0">
                  {callType === "video" ? <div className="w-full h-full relative flex items-center justify-center bg-black/60 rounded-2xl overflow-hidden border border-slate-800">
                      {
    /* Remote Video Stream */
  }
                      <video
    ref={remoteVideoRef}
    autoPlay
    playsInline
    className="w-full h-full object-cover"
  />

                      {
    /* Local Video Stream PiP */
  }
                      <div className="absolute top-4 right-4 w-36 h-28 bg-slate-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                        <video
    ref={localVideoRef}
    autoPlay
    playsInline
    muted
    className="w-full h-full object-cover"
  />
                        <div className="absolute bottom-1 left-2 text-[10px] bg-black/60 px-1 rounded text-white font-medium">
                          You {isCameraOff ? "(Cam Off)" : ""}
                        </div>
                      </div>
                    </div> : (
    /* Voice Call Avatar Display */
    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-blue-600/30 border-4 border-blue-400 flex items-center justify-center mx-auto shadow-xl">
                        <Phone className="w-10 h-10 text-blue-300 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">1-to-1 Voice Deal Room</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {callState === "connected" ? "Live bilateral audio active" : "Calling partner..."}
                        </p>
                      </div>
                    </div>
  )}
                </div>

                {
    /* Bottom Call Controls */
  }
                <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-800">
                  {
    /* Mute Button */
  }
                  <button
    type="button"
    onClick={toggleMute}
    className={`p-3 rounded-full transition ${isMuted ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}
    title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {
    /* Camera Toggle Button (if video) */
  }
                  {callType === "video" && <button
    type="button"
    onClick={toggleCamera}
    className={`p-3 rounded-full transition ${isCameraOff ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}
    title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
  >
                      {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>}

                  {
    /* End Call Button */
  }
                  <button
    type="button"
    onClick={endCall}
    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg transition"
    title="End Call and Disconnect"
  >
                    <PhoneOff className="w-4 h-4" />
                    End Call
                  </button>
                </div>
              </div>}
          </div> : <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
            <div>
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Select a Deal Room</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Negotiate commercial terms, book transport haulage, and conduct voice/video calls.
              </p>
            </div>
          </div>}

        {
    /* Modal: Invite Exporter, Importer, or Driver */
  }
        {showInviteModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">
                  Invite Commercial Partner to Deal Room
                </h3>
                <button
    onClick={() => setShowInviteModal(false)}
    className="text-slate-400 hover:text-slate-600 text-sm"
  >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-500 my-2">
                All invited participants will be able to see conversation messages, review proforma invoices, and negotiate commercial milestones.
              </p>

              <div className="space-y-4 mt-3">
                {
    /* Step 1: Choose Role to Invite */
  }
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    1. Choose Partner Type to Invite:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
    type="button"
    onClick={() => setInviteRole("exporter")}
    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${inviteRole === "exporter" ? "bg-blue-600 text-white border-blue-600 shadow-2xs" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`}
  >
                      📦 Exporter
                    </button>
                    <button
    type="button"
    onClick={() => setInviteRole("importer")}
    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${inviteRole === "importer" ? "bg-blue-600 text-white border-blue-600 shadow-2xs" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`}
  >
                      🏢 Importer
                    </button>
                    <button
    type="button"
    onClick={() => setInviteRole("driver")}
    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${inviteRole === "driver" ? "bg-blue-600 text-white border-blue-600 shadow-2xs" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`}
  >
                      🚛 Driver
                    </button>
                  </div>
                </div>

                {
    /* Step 2: Dropdown of Users */
  }
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    2. Select {inviteRole.toUpperCase()} from Registered Directory:
                  </label>
                  {loadingUsers ? <div className="p-3 text-xs text-slate-400 bg-slate-50 rounded-lg">
                      Loading registered {inviteRole}s...
                    </div> : availableUsers.length > 0 ? <select
    value={selectedInviteUserId}
    onChange={(e) => setSelectedInviteUserId(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  >
                      {availableUsers.map((u) => <option key={u.id} value={u.id}>
                          {u.fullName} {u.businessName ? `\u2014 ${u.businessName}` : ""} ({u.city}, {u.country})
                        </option>)}
                    </select> : <div className="p-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                      No registered {inviteRole}s found currently in the database.
                    </div>}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900">
                  ℹ️ Once added, this partner will immediately have access to this deal room and see all past and future messages.
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
    onClick={() => setShowInviteModal(false)}
    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
  >
                  Cancel
                </button>
                <button
    onClick={handleInvitePartner}
    disabled={!selectedInviteUserId || loadingUsers}
    className="px-4 py-2 text-xs font-medium bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow-xs transition"
  >
                  Invite to Deal Room
                </button>
              </div>
            </div>
          </div>}

        {
    /* Modal: Update Deal Status */
  }
        {showStatusModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="font-bold text-base text-[#142B4A] mb-1">
                Update Commercial Deal Status
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Formally record agreed commercial milestones in the audit log.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Milestone Status</label>
                  <select
    value={newDealStatus}
    onChange={(e) => setNewDealStatus(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
  >
                    <option value="quotation_exchanged">Quotation Exchanged</option>
                    <option value="terms_agreed">Terms Agreed</option>
                    <option value="transporter_invited">Transporter Invited</option>
                    <option value="booked">Transport Booked</option>
                    <option value="in_transit">In Transit (Cross-Border)</option>
                    <option value="completed">Deal Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agreed Settlement Price (USD)</label>
                  <input
    type="number"
    placeholder="e.g. 610"
    value={agreedPrice}
    onChange={(e) => setAgreedPrice(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
    onClick={() => setShowStatusModal(false)}
    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
  >
                  Cancel
                </button>
                <button
    onClick={handleUpdateStatus}
    className="px-4 py-2 text-xs font-medium bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg shadow-xs transition"
  >
                  Confirm Status Update
                </button>
              </div>
            </div>
          </div>}
      </div>
    </AppShell>;
}
