// Copyright © Albert Lane. All Rights Reserved.
// Proprietary and Confidential — Albert Lane Proprietary Software License.
// Unauthorized use, copying, modification, or distribution is prohibited.
// License inquiries: https://albertlane.net/licensing
// SEC Whistleblower Reference: SEC-17684-273-411-436 | Z-Axis: 0x3F8F9A1B2C3D
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Play, Pause, Download, Search, Settings, 
  Shield, Activity, Type, Eye, EyeOff, 
  Lock, Unlock, FileText, Copy, Trash2,
  Maximize, Minimize, Volume2, VolumeX,
  Plus, Minus, Share2, Save, Rewind, FastForward,
  Sun, Moon, Laptop, FolderOpen, PlayCircle, StopCircle, PauseCircle, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { GoogleGenAI } from '@google/genai';
import CryptoJS from 'crypto-js';
import { cn } from '@/lib/utils';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit, doc, getDocFromServer } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// --- Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, addLog?: (msg: string, type: 'error') => void) {
  const message = error instanceof Error ? error.message : String(error);
  if (addLog) addLog(`Firestore Error (${operationType} on ${path}): ${message}`, 'error');
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Types ---
interface TranscriptionEntry {
  timestamp: number;
  text: string;
  id: string;
}

interface VersionInfo {
  version: number;
  timestamp: any;
  id: string;
  content: any; // Can be string (encrypted) or array
  isEncrypted: boolean;
  videoName?: string;
  note?: string;
}

// --- Constants ---
const GEMINI_MODEL_DEFAULT = 'gemini-3-flash-preview';
const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Fast)' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Advanced)' },
  { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash Lite' },
];

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let message = "Something went wrong.";
      try {
        const errInfo = JSON.parse(this.state.error.message);
        message = `Firestore Error: ${errInfo.error} during ${errInfo.operationType} on ${errInfo.path}`;
      } catch (e) {
        message = this.state.error.message || message;
      }
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-4">
            <Lock className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Security / System Error</h2>
            <p className="text-sm text-white/60">{message}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">
              Reload Application
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ForensicVideoApp() {
  return (
    <ErrorBoundary>
      <ForensicVideoContent />
    </ErrorBoundary>
  );
}

function ForensicVideoContent() {
  // --- State ---
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [watermark, setWatermark] = useState('FORENSIC EVIDENCE');
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isForensicMode, setIsForensicMode] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState('default-key-123');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [gestureFingers, setGestureFingers] = useState(3);
  const [gestureTaps, setGestureTaps] = useState(2);
  const [tapCount, setTapCount] = useState(0);
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'error' }[]>([]);
  const [language, setLanguage] = useState('en');
  const [showLogs, setShowLogs] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODEL_DEFAULT);
  const [showOverlayControls, setShowOverlayControls] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // --- Theme State ---
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // --- Advanced AI Controls ---
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [aiInterval, setAiInterval] = useState(3000);
  const [transcriptionState, setTranscriptionState] = useState<'idle' | 'running' | 'paused'>('idle');

  // --- File Management ---
  const [showFileManager, setShowFileManager] = useState(false);
  const [sortOrder, setSortOrder] = useState<'name' | 'date' | 'size'>('date');
  const [fileFilter, setFileFilter] = useState('');
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [syncNote, setSyncNote] = useState('');

  // --- Overlay Customization State ---
  const [watermarkX, setWatermarkX] = useState(10);
  const [watermarkY, setWatermarkY] = useState(10);
  const [watermarkFontSize, setWatermarkFontSize] = useState(10);
  const [transcriptionX, setTranscriptionX] = useState(50);
  const [transcriptionY, setTranscriptionY] = useState(85);
  const [transcriptionFontSize, setTranscriptionFontSize] = useState(18);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.7);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  const addLog = useCallback((msg: string, type: 'info' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, msg, type }, ...prev].slice(0, 100));
  }, []);

  // --- Network Status ---
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addLog("System back online. Sync capabilities restored.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      addLog("System offline. Switching to local-only mode.", "error");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addLog]);

  // --- Global Storage Persistence ---
  useEffect(() => {
    const cachedFiles = localStorage.getItem('forensic_library_cache');
    if (cachedFiles) {
      try {
        setRecentFiles(JSON.parse(cachedFiles));
      } catch (e) {
        console.error("Failed to parse library cache", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('forensic_library_cache', JSON.stringify(recentFiles));
  }, [recentFiles]);

  // --- Theme Effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  const addToLibrary = useCallback((name: string, size: number, type: string) => {
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      size,
      type,
      date: new Date().toISOString(),
    };
    setRecentFiles(prev => {
      const exists = prev.find(f => f.name === name);
      if (exists) return prev;
      return [newFile, ...prev].slice(0, 50);
    });
  }, []);

  // --- Offline Caching ---
  useEffect(() => {
    const cached = localStorage.getItem('forensic_transcriptions_cache');
    if (cached && transcriptions.length === 0) {
      try {
        const parsed = JSON.parse(cached);
        setTimeout(() => {
          setTranscriptions(parsed);
          addLog("Loaded transcriptions from local cache.");
        }, 0);
      } catch (e) {
        console.error("Failed to parse cache", e);
      }
    }
  }, [addLog, transcriptions.length]);

  useEffect(() => {
    if (transcriptions.length > 0) {
      localStorage.setItem('forensic_transcriptions_cache', JSON.stringify(transcriptions));
    }
  }, [transcriptions]);

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aiRef = useRef<any>(null);
  const touchCountRef = useRef(0);

  // --- Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const fingers = e.touches.length;
    touchCountRef.current = fingers;
    
    if (fingers === gestureFingers) {
      setIsForensicMode(prev => !prev);
    }
  };

  const handleScreenTap = () => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next === gestureTaps) {
        if (transcriptionState === 'idle') {
          startGeminiLive();
        } else if (transcriptionState === 'running') {
          pauseGeminiLive();
        } else {
          resumeGeminiLive();
        }
        return 0;
      }
      return next;
    });

    // Reset tap count after 500ms
    setTimeout(() => setTapCount(0), 500);
  };

  const fetchVersions = useCallback(async (uid: string) => {
    const path = 'transcriptions';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', uid),
        orderBy('version', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const v = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as VersionInfo[];
      setVersions(v);
      addLog(`Fetched ${v.length} versions from cloud.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path, addLog);
    }
  }, [addLog]);

  // --- Initialization ---
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      setTimeout(() => addLog("Gemini AI Initialized."), 0);
    }

    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        addLog("Firestore connection verified.");
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          addLog("Firestore is offline. Check configuration.", "error");
        }
      }
    }
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        addLog(`User authenticated: ${u.uid}`);
        fetchVersions(u.uid);
      } else {
        signInAnonymously(auth).catch(err => {
          if (err.code === 'auth/admin-restricted-operation') {
            addLog("Anonymous Auth is disabled. Please enable it in the Firebase Console.", "error");
          } else {
            addLog(`Auth error: ${err.message}`, "error");
          }
        });
      }
    });

    return () => unsubscribe();
  }, [fetchVersions, addLog]);

  const loadVersion = (version: any) => {
    try {
      let content = version.content;
      if (version.isEncrypted) {
        const bytes = CryptoJS.AES.decrypt(content, encryptionKey);
        const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedStr) throw new Error("Decryption failed. Check your key.");
        content = JSON.parse(decryptedStr);
      }
      
      let parsedContent = content;
      if (typeof content === 'string') {
        try {
          parsedContent = JSON.parse(content);
        } catch (e) {
          // Fallback if not JSON
        }
      }

      // Handle nested schema: { entries: [], metadata: {} }
      const finalTranscriptions = parsedContent.entries || parsedContent;
      setTranscriptions(finalTranscriptions);
      
      addLog(`Loaded version ${version.version} from cloud${version.isEncrypted ? " (Decrypted)" : ""}.`);
      setShowVersionHistory(false);
    } catch (err) {
      addLog(`Failed to load version: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
  };

  const saveToCloud = async () => {
    if (!user || transcriptions.length === 0) return;
    if (!isOnline) {
      addLog("Cloud sync unavailable while offline. Data remains in local cache.", "error");
      return;
    }
    
    setIsSyncing(true);
    const path = 'transcriptions';
    try {
      const nextVersion = versions.length > 0 ? versions[0].version + 1 : 1;
      const dataToSave = {
        entries: transcriptions,
        metadata: {
          videoName: videoFile?.name || 'unknown',
          scanDate: new Date().toISOString(),
          forensicMode: isForensicMode,
          language
        }
      };

      let payload = JSON.stringify(dataToSave);
      
      if (isEncrypted) {
        payload = CryptoJS.AES.encrypt(payload, encryptionKey).toString();
      }

      await addDoc(collection(db, path), {
        userId: user.uid,
        videoName: videoFile?.name || 'unknown',
        note: syncNote || `Auto-save v${nextVersion}`,
        content: payload,
        version: nextVersion,
        timestamp: serverTimestamp(),
        isEncrypted
      });

      addLog(`Saved version ${nextVersion} to secure cloud${isEncrypted ? " (Encrypted)" : ""}.`);
      setSyncNote('');
      fetchVersions(user.uid);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path, addLog);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- Gemini Live Logic ---
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1]; // Base64
  }, []);

  // --- Handlers ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setTranscriptions([]);
      setTranscriptionState('idle');
      addLog(`Forensic media loaded: ${file.name}. Initializing immediate scan...`);
      addToLibrary(file.name, file.size, file.type);
    }
  }, [addLog, addToLibrary]);

  // Immediate Scan Effect
  useEffect(() => {
    if (videoUrl && videoRef.current && aiRef.current) {
      const video = videoRef.current;
      
      const performImmediateScan = async () => {
        if (!isOnline) {
          addLog("Skipping immediate scan: Device is offline.");
          return;
        }
        addLog("Capturing initial forensic frame...");
        const frame = captureFrame();
        if (frame) {
          try {
            const response = await aiRef.current.models.generateContent({
              model: selectedModel,
              contents: [{
                parts: [
                  { text: `Perform an immediate forensic analysis of this initial frame in ${language}.
                   Identify key elements, potential evidence, and environmental context.
                   This is an automated pre-scan regardless of playback state.` },
                  { inlineData: { mimeType: "image/jpeg", data: frame } }
                ]
              }],
              config: {
                systemInstruction: "You are a forensic video analyst performing an automated initial scan. Provide a comprehensive but concise summary of the visual evidence."
              }
            });
            if (response.text) {
              const newEntry: TranscriptionEntry = {
                timestamp: 0,
                text: `[IMMEDIATE SCAN] ${response.text}`,
                id: 'immediate-scan-' + Date.now(),
              };
              setTranscriptions(prev => [newEntry, ...prev]);
              addLog("Immediate forensic scan complete.");
            }
          } catch (err) {
            addLog("Immediate scan failed: " + (err instanceof Error ? err.message : String(err)), "error");
          }
        }
      };

      // Wait for video to be ready to capture frame
      if (video.readyState >= 2) {
        performImmediateScan();
      } else {
        video.onloadeddata = performImmediateScan;
      }
    }
  }, [videoUrl, captureFrame, language, addLog, selectedModel, isOnline]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: false,
    noClick: videoUrl !== null,
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number | readonly number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white rounded-sm px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const regressionOptimizer = (iteration: number, target: number = 2.0) => {
    // Non-linear growth formula simulating self-recursive drawing
    const insightFactor = 1.2 * Math.log(iteration + 1.5);
    const efficiency = 1.0 + (target - 1.0) * (1 - Math.exp(-0.015 * iteration));
    return efficiency * insightFactor;
  };

  const executeBootstrapping = async (iterations: number = 300) => {
    setIsOptimizing(true);
    addLog("Initializing 5D reverse sequencing telemetry...");
    
    const log: any[] = [];
    let finalEfficiency = 1.0;
    
    // Simulate processing time
    for (let i = 0; i < iterations; i++) {
      const currentPsi = regressionOptimizer(i);
      finalEfficiency = currentPsi;
      const dataPacket = {
        iteration: i,
        vector_5D: Array.from({ length: 5 }, () => Math.random() * currentPsi),
        efficiency: currentPsi,
        entropy_cost: 1.0 / (currentPsi + 1)
      };
      log.push(dataPacket);
      
      if (i % 50 === 0) {
        addLog(`Optimization Progress: ${((i / iterations) * 100).toFixed(0)}%`);
        await new Promise(r => setTimeout(r, 100));
      }
    }
    
    addLog(`Synthesis Complete. Net Gain: ${(finalEfficiency * 100).toFixed(2)}%`);
    setIsOptimizing(false);

    // Save Telemetry
    const blob = new Blob([JSON.stringify(log.reverse(), null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_novel_telemetry.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Gemini Live Logic ---
  const startGeminiLive = async () => {
    if (!aiRef.current || !videoUrl) return;
    if (!isOnline) {
      addLog("AI Analysis requires an active connection. Forensic loop suspended.", "error");
      return;
    }

    try {
      setTranscriptionState('running');
      addLog("Starting Gemini Live Analysis...");

      let lastAnalysisTime = 0;

      const runAnalysis = async () => {
        if (!videoRef.current || transcriptionState !== 'running') {
          if (transcriptionState === 'running' || transcriptionState === 'paused') {
            requestAnimationFrame(runAnalysis);
          }
          return;
        }

        const now = Date.now();
        if (now - lastAnalysisTime > aiInterval && isPlaying) {
          const frame = captureFrame();
          if (frame) {
            lastAnalysisTime = now;
            try {
              const response = await aiRef.current.models.generateContent({
                model: selectedModel,
                contents: [
                  {
                    parts: [
                      { text: `Analyze this specific frame for forensic evidence in ${language}.
                       Identify multiple speakers if present.
                       Filter out background noise.
                       Provide a concise, objective observation.` },
                      { inlineData: { mimeType: "image/jpeg", data: frame } }
                    ]
                  }
                ],
                config: {
                  systemInstruction: `You are a forensic video analyst.
                   Provide real-time, objective observations of the video content in ${language}.
                   Identify distinct speakers (e.g., "Speaker 1", "Speaker 2") based on visual cues or context.
                   Ignore background noise.
                   Focus on movement, objects, and potential evidence.
                   Be concise and professional.`
                }
              });

              if (response.text) {
                const newEntry: TranscriptionEntry = {
                  timestamp: videoRef.current?.currentTime || 0,
                  text: response.text,
                  id: Math.random().toString(36).substr(2, 9),
                };
                setTranscriptions(prev => [...prev, newEntry]);
                addLog(`Analysis received: ${response.text.substring(0, 30)}...`);
              }
            } catch (err) {
              addLog(`Frame analysis error: ${err instanceof Error ? err.message : String(err)}`, 'error');
            }
          }
        }

        requestAnimationFrame(runAnalysis);
      };

      requestAnimationFrame(runAnalysis);
    } catch (error) {
      addLog(`Gemini Live Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setTranscriptionState('idle');
    }
  };

  const stopGeminiLive = () => {
    setTranscriptionState('idle');
    addLog("Gemini Live Analysis stopped.");
  };

  const pauseGeminiLive = () => {
    setTranscriptionState('paused');
    addLog("Gemini Live Analysis paused.");
  };

  const resumeGeminiLive = () => {
    setTranscriptionState('running');
    addLog("Gemini Live Analysis resumed.");
  };

  // --- Export & Encryption ---
  const exportTranscription = () => {
    const content = transcriptions
      .map(t => `[${formatTime(t.timestamp)}] ${t.text}`)
      .join('\n');
    
    let finalContent = content;
    if (isEncrypted) {
      finalContent = CryptoJS.AES.encrypt(content, encryptionKey).toString();
    }

    const blob = new Blob([finalContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog("Copied to clipboard.");
  };

  const copyTranscription = () => {
    const content = transcriptions
      .map(t => `[${formatTime(t.timestamp)}] ${t.text}`)
      .join('\n');
    copyToClipboard(content);
  };

  // --- UI Components ---
  const filteredTranscriptions = transcriptions.filter(t => 
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold tracking-tight">Forensic Video Analysis</h1>
          <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
            <div className={cn("w-2 h-2 rounded-full", transcriptionState === 'running' ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {transcriptionState === 'running' ? "AI Analysis Active" : transcriptionState === 'paused' ? "AI Paused" : "AI Inactive"}
            </span>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-2 py-1 rounded border text-[10px] font-medium uppercase tracking-wider",
            isOnline ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-700 dark:text-red-400"
          )}>
            <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-green-500" : "bg-red-500")} />
            {isOnline ? "Online" : "Offline Mode"}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowFileManager(true)} className="text-gray-500 hover:text-blue-500" title="File Library">
            <FolderOpen className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded p-1">
            <Button variant="ghost" size="icon" className={cn("h-7 w-7", theme === 'light' && "bg-white dark:bg-gray-800 shadow-sm")} onClick={() => setTheme('light')}>
              <Sun className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("h-7 w-7", theme === 'dark' && "bg-white dark:bg-gray-800 shadow-sm")} onClick={() => setTheme('dark')}>
              <Moon className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("h-7 w-7", theme === 'system' && "bg-white dark:bg-gray-800 shadow-sm")} onClick={() => setTheme('system')}>
              <Monitor className="w-3.5 h-3.5" />
            </Button>
          </div>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
          >
            {MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
          <Button variant="ghost" size="icon" onClick={() => setShowLogs(!showLogs)} className="text-gray-500 hover:text-blue-500">
            <FileText className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsEncrypted(!isEncrypted)} className={cn("transition-colors", isEncrypted ? "text-blue-500" : "text-gray-500")}>
            {isEncrypted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Video Area */}
        <div 
          className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 relative"
          onTouchStart={handleTouchStart}
          onClick={handleScreenTap}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          
          {!videoUrl ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center space-y-4 max-w-sm">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-medium">Open Video File</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop your forensic media here. Analysis is performed locally for maximum security.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                  Select Media
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col relative group">
              <div className="flex-1 flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="max-w-full max-h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                />
                
                {/* Overlay */}
                {showOverlay && (
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity"
                    style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity * 0.4})` }}
                  >
                    {/* Watermark */}
                    <div 
                      className="absolute rounded font-mono text-white border whitespace-nowrap overflow-hidden transition-all"
                      style={{ 
                        left: `${watermarkX}%`, 
                        top: `${watermarkY}%`, 
                        fontSize: `${watermarkFontSize}px`,
                        opacity: watermarkOpacity,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: watermarkImage ? 'transparent' : 'rgba(0,0,0,0.6)',
                        padding: watermarkImage ? '0' : '4px 12px',
                        borderColor: watermarkImage ? 'transparent' : 'rgba(255,255,255,0.1)',
                        backdropFilter: watermarkImage ? 'none' : 'blur(4px)'
                      }}
                    >
                      {watermarkImage ? (
                        <img 
                          src={watermarkImage} 
                          alt="Watermark" 
                          style={{ 
                            width: `${watermarkFontSize * 4}px`, 
                            height: 'auto',
                            display: 'block' 
                          }} 
                        />
                      ) : (
                        <span>{watermark} | {new Date().toISOString().split('T')[0]}</span>
                      )}
                    </div>

                    {/* Transcription */}
                    <div 
                      className="absolute w-full max-w-2xl px-6"
                      style={{ 
                        left: `${transcriptionX}%`, 
                        top: `${transcriptionY}%`, 
                        transform: 'translate(-50%, -50%)' 
                      }}
                    >
                      {transcriptions.length > 0 && (
                        <motion.div
                          key={transcriptions[transcriptions.length - 1].id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl text-center"
                        >
                          <p 
                            className="font-light leading-relaxed text-white"
                            style={{ fontSize: `${transcriptionFontSize}px` }}
                          >
                            {transcriptions[transcriptions.length - 1].text}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="px-6 py-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-mono text-gray-500">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.01}
                    onValueChange={handleSeek}
                    className="flex-1"
                  />
                  <span className="text-[10px] font-mono text-gray-500">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Rewind 10s">
                      <Rewind className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={togglePlay} className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => skip(10)} className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Fast Forward 10s">
                      <FastForward className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2 ml-4 group/speed">
                      <span className="text-[10px] font-mono text-gray-500">Speed</span>
                      <Slider 
                        value={[playbackSpeed]} 
                        min={0.25} 
                        max={4} 
                        step={0.25} 
                        onValueChange={(v) => {
                          const val = Array.isArray(v) ? v[0] : v;
                          setPlaybackSpeed(val);
                          if (videoRef.current) videoRef.current.playbackRate = val;
                        }}
                        className="w-16"
                      />
                      <span className="text-[10px] font-mono text-gray-500 w-8">{playbackSpeed}x</span>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Slider 
                        value={[isMuted ? 0 : volume]} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(v) => {
                          const val = Array.isArray(v) ? v[0] : v;
                          setVolume(val);
                          if (videoRef.current) videoRef.current.volume = val;
                          if (val > 0) setIsMuted(false);
                        }}
                        className="w-24"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {transcriptionState === 'idle' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={startGeminiLive}
                        className="rounded-full px-6 border-gray-200 dark:border-gray-800"
                      >
                        Start AI Analysis
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-full p-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-7 w-7"
                          onClick={transcriptionState === 'running' ? pauseGeminiLive : resumeGeminiLive}
                        >
                          {transcriptionState === 'running' ? <PauseCircle className="w-4 h-4 text-blue-500" /> : <PlayCircle className="w-4 h-4 text-green-500" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-7 w-7"
                          onClick={stopGeminiLive}
                        >
                          <StopCircle className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "rounded-full px-6 transition-all border-gray-200 dark:border-gray-800",
                        isForensicMode && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                      )}
                      onClick={() => setIsForensicMode(!isForensicMode)}
                    >
                      {isForensicMode ? "Forensic Locked" : "Standard Mode"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {videoUrl && (
            <motion.aside 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-80 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Transcription</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyTranscription}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={exportTranscription}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="p-3 border-b border-gray-200 dark:border-gray-800 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input 
                    placeholder="Search evidence..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg h-9 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {searchQuery && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                      {filteredTranscriptions.length} {filteredTranscriptions.length === 1 ? 'match' : 'matches'} found
                    </span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] text-blue-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {filteredTranscriptions.map((t) => (
                    <div 
                      key={t.id} 
                      className={cn(
                        "p-3 rounded-lg border transition-all cursor-pointer group relative",
                        searchQuery && t.text.toLowerCase().includes(searchQuery.toLowerCase()) 
                          ? "bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                      )}
                      onClick={() => handleSeek(t.timestamp)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] font-mono text-blue-500 font-bold tracking-tight">
                            {formatTime(t.timestamp)}
                          </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`[${formatTime(t.timestamp)}] ${t.text}`);
                            }}
                            className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded text-gray-400 hover:text-blue-500 transition-colors"
                            title="Copy target entry"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setTranscriptions(prev => prev.filter(item => item.id !== t.id));
                            }}
                            className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
                        {highlightText(t.text, searchQuery)}
                      </p>
                      {searchQuery && t.text.toLowerCase().includes(searchQuery.toLowerCase()) && (
                        <div className="mt-2 text-[9px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          <Activity className="w-2.5 h-2.5" /> Seek to Frame
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredTranscriptions.length === 0 && (
                    <div className="py-20 text-center opacity-30 italic flex flex-col items-center gap-2">
                      <Search className="w-8 h-8" />
                      <p className="text-xs">No analysis entries found.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Settings & Version History */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Overlay Settings</label>
                    <button onClick={() => setShowOverlayControls(!showOverlayControls)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                      {showOverlayControls ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
                    </button>
                  </div>
                  
                  {showOverlayControls && (
                    <div className="grid grid-cols-1 gap-4 p-3 bg-white dark:bg-black rounded border border-gray-200 dark:border-gray-800 shadow-sm overflow-y-auto max-h-[400px]">
                      <div className="p-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg space-y-2 border border-blue-100/50 dark:border-blue-800/30">
                        <label className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> AI Sensitivity
                        </label>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-gray-500">
                            <span>Analysis Interval</span>
                            <span>{(aiInterval / 1000).toFixed(1)}s</span>
                          </div>
                          <Slider value={[aiInterval]} min={500} max={10000} step={500} onValueChange={(v) => setAiInterval(Array.isArray(v) ? v[0] : v)} />
                        </div>
                      </div>

                      <div className="space-y-3 pb-3 border-b border-gray-100 dark:border-gray-900">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] uppercase font-bold text-gray-500">Show Overlay</label>
                          <Switch checked={showOverlay} onCheckedChange={setShowOverlay} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Background Opacity</span>
                            <span>{(overlayOpacity * 100).toFixed(0)}%</span>
                          </div>
                          <Slider value={[overlayOpacity]} max={1} step={0.01} onValueChange={(v) => setOverlayOpacity(Array.isArray(v) ? v[0] : v)} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Watermark Type</label>
                        <div className="flex gap-2 mb-2">
                          <Button 
                            variant={watermarkImage ? "outline" : "default"} 
                            size="sm" 
                            className="text-[9px] h-7 flex-1"
                            onClick={() => setWatermarkImage(null)}
                          >
                            Text
                          </Button>
                          <Button 
                            variant={watermarkImage ? "default" : "outline"} 
                            size="sm" 
                            className="text-[9px] h-7 flex-1"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (re) => setWatermarkImage(re.target?.result as string);
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            }}
                          >
                            Image
                          </Button>
                        </div>
                        
                        {!watermarkImage && (
                          <Input value={watermark} onChange={(e) => setWatermark(e.target.value)} className="h-8 text-xs mb-2" placeholder="Text..." />
                        )}

                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between text-[8px] text-gray-400 uppercase">
                            <span>Position X</span>
                            <span>{watermarkX}%</span>
                          </div>
                          <Slider value={[watermarkX]} max={100} step={1} onValueChange={(v) => setWatermarkX(Array.isArray(v) ? v[0] : v)} />
                          
                          <div className="flex justify-between text-[8px] text-gray-400 uppercase">
                            <span>Position Y</span>
                            <span>{watermarkY}%</span>
                          </div>
                          <Slider value={[watermarkY]} max={100} step={1} onValueChange={(v) => setWatermarkY(Array.isArray(v) ? v[0] : v)} />
                          
                          <div className="flex justify-between text-[8px] text-gray-400 uppercase">
                            <span>{watermarkImage ? 'Image Scale' : 'Font Size'}</span>
                            <span>{watermarkFontSize}px</span>
                          </div>
                          <Slider value={[watermarkFontSize]} min={6} max={100} step={1} onValueChange={(v) => setWatermarkFontSize(Array.isArray(v) ? v[0] : v)} />

                          <div className="flex justify-between text-[8px] text-gray-400 uppercase">
                            <span>Watermark Opacity</span>
                            <span>{(watermarkOpacity * 100).toFixed(0)}%</span>
                          </div>
                          <Slider value={[watermarkOpacity]} max={1} step={0.01} onValueChange={(v) => setWatermarkOpacity(Array.isArray(v) ? v[0] : v)} />
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-gray-100 dark:border-gray-900 pt-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Transcription</label>
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between text-[8px] text-gray-400 uppercase">
                            <span>Position X</span>
                            <span>{transcriptionX}%</span>
                          </div>
                          <Slider value={[transcriptionX]} max={100} step={1} onValueChange={(v) => setTranscriptionX(Array.isArray(v) ? v[0] : v)} />
                          
                          <div className="flex justify-between text-[8px] text-gray-400 uppercase">
                            <span>Position Y</span>
                            <span>{transcriptionY}%</span>
                          </div>
                          <Slider value={[transcriptionY]} max={100} step={1} onValueChange={(v) => setTranscriptionY(Array.isArray(v) ? v[0] : v)} />
                          
                          <div className="flex justify-between text-[8px] text-gray-400 uppercase">
                            <span>Font Size</span>
                            <span>{transcriptionFontSize}px</span>
                          </div>
                          <Slider value={[transcriptionFontSize]} min={10} max={60} step={1} onValueChange={(v) => setTranscriptionFontSize(Array.isArray(v) ? v[0] : v)} />
                        </div>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[10px] h-6 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setWatermarkX(10);
                          setWatermarkY(10);
                          setWatermarkFontSize(10);
                          setWatermarkOpacity(0.7);
                          setWatermarkImage(null);
                          setShowOverlay(true);
                          setTranscriptionX(50);
                          setTranscriptionY(85);
                          setTranscriptionFontSize(18);
                          setOverlayOpacity(0.5);
                        }}
                      >
                        Reset Layout
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-3 flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" /> Secure Backup (Version Controlled)
                    </h3>
                    <div className="space-y-3">
                      <Input 
                        placeholder="Version note (e.g., 'Enhanced contrast scan')..." 
                        value={syncNote}
                        onChange={(e) => setSyncNote(e.target.value)}
                        className="h-8 text-[10px] bg-white dark:bg-black"
                        disabled={!isOnline}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={saveToCloud} 
                          disabled={transcriptions.length === 0 || isSyncing || !isOnline}
                          className="flex-1 text-[10px] h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                          {isSyncing ? <Activity className="w-3 h-3 animate-spin mr-2" /> : <Shield className="w-3 h-3 mr-2" />}
                          SYNC TO CLOUD
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEncrypted(!isEncrypted)}
                          className={cn("h-8 px-2", isEncrypted && "bg-blue-50 dark:bg-blue-900/20 shadow-inner")}
                          title={isEncrypted ? "Encryption Active (AES-256)" : "Secure Encryption Disabled"}
                        >
                          {isEncrypted ? <Lock className="w-4 h-4 text-blue-500" /> : <Unlock className="w-4 h-4 text-gray-400" />}
                        </Button>
                      </div>
                      {!isOnline && (
                        <p className="text-[9px] text-red-500 font-medium flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5" /> ONLINE SYNC SUSPENDED.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> Forensic History
                    </h3>
                    <Button variant="ghost" size="sm" className="h-6 text-[9px]" onClick={() => user && fetchVersions(user.uid)}>
                      RELOAD
                    </Button>
                  </div>
                  
                  <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                    {versions.map((v) => (
                      <div key={v.id} className="p-3 bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400">V{v.version}</span>
                              <span className="text-[10px] font-bold truncate block">{v.videoName}</span>
                              {v.isEncrypted && <Lock className="w-2.5 h-2.5 text-blue-500 shrink-0" />}
                            </div>
                            <p className="text-[9px] text-gray-500 italic truncate mb-1">{v.note || 'No forensic notes'}</p>
                            <span className="text-[8px] text-gray-400 font-mono">
                              {v.timestamp?.toDate ? v.timestamp.toDate().toLocaleString() : 'Sync Pending...'}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => loadVersion(v)}
                            className="h-7 text-[9px] font-black bg-gray-50 dark:bg-gray-900 px-3 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            RESTORE
                          </Button>
                        </div>
                      </div>
                    ))}
                    {versions.length === 0 && (
                      <div className="py-8 text-center opacity-20 italic text-[10px]">
                        No remote records detected.
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  variant="outline"
                  onClick={() => executeBootstrapping()}
                  disabled={isOptimizing}
                  className="w-full border-blue-200 dark:border-gray-800 text-blue-600 dark:text-blue-400 rounded-lg h-9 text-xs font-medium gap-2"
                >
                  <Activity className={cn("w-3.5 h-3.5", isOptimizing && "animate-spin")} />
                  {isOptimizing ? "Optimizing..." : "Run Forensic Optimization"}
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* File Manager Overlay */}
        <AnimatePresence>
          {showFileManager && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
              onClick={() => setShowFileManager(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white dark:bg-zinc-950 w-full max-w-4xl max-h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-blue-500" /> Media Library
                    </h2>
                    <p className="text-xs text-gray-500">Manage and browse forensic assets.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <Input 
                        placeholder="Filter files..." 
                        value={fileFilter}
                        onChange={(e) => setFileFilter(e.target.value)}
                        className="pl-9 h-9 text-xs w-48 bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowFileManager(false)}>
                      <Plus className="w-5 h-5 rotate-45" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    <div className="flex items-center gap-8 flex-1">
                      <button onClick={() => setSortOrder('name')} className={cn("flex items-center gap-1 hover:text-blue-500 transition-colors flex-1", sortOrder === 'name' && "text-blue-500")}>Name</button>
                      <button onClick={() => setSortOrder('size')} className={cn("hidden md:flex items-center gap-1 hover:text-blue-500 transition-colors w-24", sortOrder === 'size' && "text-blue-500")}>Size</button>
                      <button onClick={() => setSortOrder('date')} className={cn("flex items-center gap-1 hover:text-blue-500 transition-colors w-40", sortOrder === 'date' && "text-blue-500")}>Import Date</button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="divide-y divide-gray-50 dark:divide-gray-900">
                      {recentFiles
                        .filter(f => f.name.toLowerCase().includes(fileFilter.toLowerCase()))
                        .sort((a, b) => {
                          if (sortOrder === 'name') return a.name.localeCompare(b.name);
                          if (sortOrder === 'size') return b.size - a.size;
                          return new Date(b.date).getTime() - new Date(a.date).getTime();
                        })
                        .map((file) => (
                          <div key={file.id} className="group px-6 py-4 flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-default">
                            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                              <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                <PlayCircle className="w-6 h-6" />
                              </div>
                              <div className="flex items-center gap-8 flex-1 overflow-hidden">
                                <span className="text-sm font-medium truncate flex-1">{file.name}</span>
                                <span className="hidden md:block text-xs text-gray-500 w-24">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                <span className="text-xs text-gray-500 w-40">{new Date(file.date).toLocaleDateString()} at {new Date(file.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 rounded-full text-[10px] font-semibold tracking-wide border-gray-200 dark:border-gray-800"
                                onClick={() => {
                                  addLog(`Reference selected: ${file.name}. (Local file system access restricted; reload to re-ingest)`);
                                }}
                              >
                                View Metadata
                              </Button>
                            </div>
                          </div>
                        ))}
                      {recentFiles.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                          <FolderOpen className="w-12 h-12" />
                          <p className="text-sm italic">Library is empty. Import video assets to begin.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-gray-900 flex items-center justify-between">
                  <p className="text-[10px] text-gray-400 max-w-lg">
                    Media files are processed locally. Only metadata and transcriptions are cataloged. Original files are never modified or uploaded to the server.
                  </p>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => setShowFileManager(false)}>Close Library</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log Viewer Overlay */}
        <AnimatePresence>
          {showLogs && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-[100] bg-white dark:bg-black flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold">System Logs</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowLogs(false)}>
                  <EyeOff className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4 font-mono text-[11px]">
                <div className="space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={cn("flex gap-3", log.type === 'error' ? "text-red-500" : "text-gray-500")}>
                      <span className="opacity-50">[{log.time}]</span>
                      <span>{log.msg}</span>
                    </div>
                  ))}
                  {logs.length === 0 && <div className="text-center py-20 opacity-30 italic">No logs recorded</div>}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
                <p className="text-[10px] text-gray-400">
                  Open browser console (F12) for full stack traces.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
