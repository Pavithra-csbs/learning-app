import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './BackgroundMusic.css';

const TRACKS = {
    general: '/assets/bg_music.mp3', // Updated to use the requested Pixabay track
    boss: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'    // More exciting theme
};

const BackgroundMusic = () => {
    const location = useLocation();
    const audioRef = useRef(null);

    // Initial states from localStorage
    const [isMuted, setIsMuted] = useState(localStorage.getItem('bg_music_muted') === 'true');
    const [volume, setVolume] = useState(parseFloat(localStorage.getItem('bg_music_volume') || '0.3'));
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackType, setTrackType] = useState('general');
    const [showControls, setShowControls] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [interactionRequired, setInteractionRequired] = useState(true);

    // Update track type based on route
    useEffect(() => {
        const path = location.pathname.toLowerCase();
        if (path.includes('boss') || path.includes('hero-challenge') || path.includes('battle')) {
            setTrackType('boss');
        } else {
            setTrackType('general');
        }
    }, [location]);

    // Handle track source changes
    useEffect(() => {
        if (audioRef.current && isPlaying && !interactionRequired) {
            audioRef.current.play().catch(err => {
                console.log("Track switch play blocked:", err);
                setIsPlaying(false);
            });
        }
    }, [trackType]);

    // Initialize audio and handle autoplay restrictions
    useEffect(() => {
        const handleInteraction = () => {
            if (interactionRequired && audioRef.current) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        setInteractionRequired(false);
                        setHasError(false);
                    })
                    .catch(err => {
                        console.log("Playback blocked or failed:", err);
                    });

                // Cleanup listeners once we have had an interaction
                window.removeEventListener('click', handleInteraction);
                window.removeEventListener('touchstart', handleInteraction);
                window.removeEventListener('keydown', handleInteraction);
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [interactionRequired]);

    // Handle audio settings updates
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
            localStorage.setItem('bg_music_muted', isMuted);
            localStorage.setItem('bg_music_volume', volume);
        }
    }, [isMuted, volume]);

    // Pause music if other media (video/audio) is playing
    useEffect(() => {
        const onMediaPlay = (e) => {
            if (e.target !== audioRef.current && audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };

        const onMediaPause = (e) => {
            if (e.target !== audioRef.current && audioRef.current && !isMuted && !interactionRequired) {
                audioRef.current.play().catch(() => { });
                setIsPlaying(true);
            }
        };

        document.addEventListener('play', onMediaPlay, true);
        document.addEventListener('pause', onMediaPause, true);

        return () => {
            document.removeEventListener('play', onMediaPlay, true);
            document.removeEventListener('pause', onMediaPause, true);
        };
    }, [isMuted, interactionRequired]);

    const toggleMute = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        if (!newMuteState && audioRef.current && !interactionRequired) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (newVol > 0) setIsMuted(false);
    };

    const handleManualPlay = () => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    setInteractionRequired(false);
                    setHasError(false);
                })
                .catch(err => {
                    console.error("Manual play failed:", err);
                    setHasError(true);
                });
        }
    };

    return (
        <div className="music-controller-wrapper" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
            <audio
                ref={audioRef}
                src={TRACKS[trackType]}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setHasError(true)}
                preload="auto"
            />

            <motion.div
                className={`music-pill ${isMuted ? 'muted' : 'active'} ${hasError ? 'error' : ''} ${interactionRequired ? 'pending' : ''}`}
                layout
            >
                {interactionRequired || hasError ? (
                    <button className="play-trigger-btn" onClick={handleManualPlay} title={hasError ? "Audio Error - Click to Retry" : "Click to start music"}>
                        {hasError ? '⚠️' : '▶️'}
                    </button>
                ) : (
                    <button className="mute-toggle" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                )}

                <AnimatePresence>
                    {showControls && !interactionRequired && !hasError && (
                        <motion.div
                            className="volume-slider-container"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100px', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                        >
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volume-slider"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {interactionRequired && <span className="music-hint">Click to start music</span>}
                {hasError && <span className="music-hint error">File not found or blocked</span>}

                {!isMuted && isPlaying && !interactionRequired && (
                    <div className="music-bars">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default BackgroundMusic;
