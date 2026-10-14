// Synthesized Web Audio API Ringtone & Ringback Generator
// Provides 100% reliable call audio feedback without relying on external MP3 assets.

let audioCtx = null;
let activeRingtoneTimer = null;
let isRinging = false;
let isRingback = false;

function getAudioContext() {
  if (!audioCtx || audioCtx.state === "closed") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Play a pleasant dual-tone chime pulse
function playChime(freq1, freq2, duration = 0.8) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(freq1, now);
    osc2.frequency.setValueAtTime(freq2, now);

    // Smooth envelope attack and decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (e) {
    console.warn("Chime playback error:", e);
  }
}

// Outgoing soft telecom ringback tone (440Hz + 480Hz)
function playRingbackPulse() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(480, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.08);
    gainNode.gain.setValueAtTime(0.08, now + 1.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.4);
    osc2.stop(now + 1.4);
  } catch (e) {
    console.warn("Ringback pulse error:", e);
  }
}

export const CallAudio = {
  // Start repeating incoming call ringtone
  startIncomingRingtone() {
    this.stop();
    isRinging = true;

    const playCycle = () => {
      if (!isRinging) return;
      // High-low chime pattern
      playChime(587.33, 880.0, 0.4); // D5 + A5
      setTimeout(() => {
        if (isRinging) playChime(659.25, 987.77, 0.6); // E5 + B5
      }, 350);
    };

    playCycle();
    activeRingtoneTimer = setInterval(playCycle, 2400);
  },

  // Start outgoing ringback tone for caller
  startOutgoingRingback() {
    this.stop();
    isRingback = true;

    const playCycle = () => {
      if (!isRingback) return;
      playRingbackPulse();
    };

    playCycle();
    activeRingtoneTimer = setInterval(playCycle, 3500);
  },

  // Stop any active ringtone or ringback immediately
  stop() {
    isRinging = false;
    isRingback = false;
    if (activeRingtoneTimer) {
      clearInterval(activeRingtoneTimer);
      activeRingtoneTimer = null;
    }
  },

  // Ensure AudioContext is running after user interaction
  unlockAudio() {
    getAudioContext();
  },
};

export default CallAudio;
