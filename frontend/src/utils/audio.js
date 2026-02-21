const SFX = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    wrong: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
    levelUp: 'https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
};

export const playSFX = (type) => {
    const isMuted = localStorage.getItem('bg_music_muted') === 'true';
    if (isMuted) return;

    const audio = new Audio(SFX[type]);
    const volume = parseFloat(localStorage.getItem('bg_music_volume') || '0.3');
    audio.volume = Math.min(volume * 1.5, 1); // SFX slightly louder than BG music
    audio.play().catch(err => console.log("SFX Blocked:", err));
};
