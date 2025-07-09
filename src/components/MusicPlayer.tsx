import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, Heart, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MusicPlayerProps {
  isVisible?: boolean;
}

// Declare YT global variable for YouTube IFrame Player API
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const MusicPlayer = ({ isVisible = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const [isLiked, setIsLiked] = useState(false); // State for liked button
  const [isMuted, setIsMuted] = useState(false); // State for mute button
  const playerRef = useRef<any>(null); // Store YouTube player instance
  const intervalRef = useRef<number | null>(null); // To clear the lyric sync interval
  const playerContainerRef = useRef<HTMLDivElement>(null); // Ref for the div where player will be created

  // เนื้อเพลงพร้อมเวลาเริ่มต้นและสิ้นสุด (ในรูปแบบ นาที:วินาที) สำหรับการซิงค์
  // คุณสามารถปรับค่า 'start' และ 'end' ได้เองเพื่อให้เนื้อเพลงตรงกับจังหวะเพลงมากที่สุด
  // 'start': { min: นาที, sec: วินาที } - เวลาที่บรรทัดนี้ควรเริ่มไฮไลต์
  // 'end': { min: นาที, sec: วินาที } - เวลาที่บรรทัดนี้ควรหยุดไฮไลต์ (และบรรทัดถัดไปเริ่ม)
  const lyrics = [
    { text: "ที่สุดก็เป็นได้เพียงความรักที่จบไป", start: { min: 0, sec: 59 }, end: { min: 1, sec: 4.5 } },
    { text: "ที่สุดก็ไม่ได้เป็นอย่างฝัน", start: { min: 1, sec: 5.5 }, end: { min: 1, sec: 12 } },
    { text: "เหน็ดเหนื่อยเฝ้าคอยประคองความรักเรื่อยมา", start: { min: 1, sec: 12.5 }, end: { min: 1, sec: 18.5 } },
    { text: "แต่สุดท้ายก็ถึงเวลาต้องเลิกกัน", start: { min: 1, sec: 19.5 }, end: { min: 1, sec: 25.5 } },
    { text: "ฉันเข้าใจเมื่อได้รับรู้ว่าเธอเลือกแล้ว", start: { min: 1, sec: 26.5 }, end: { min: 1, sec: 33.5 } },
    { text: "เพียงรอเวลาปล่อยมือไปเท่านั้น", start: { min: 1, sec: 34.5 }, end: { min: 1, sec: 39.5 } },
    { text: "", start: { min: 1, sec: 39.6 }, end: { min: 1, sec: 40.4 } }, // บรรทัดว่างสำหรับเว้นวรรค/หยุดชั่วคราว
    { text: "ก็คงมีเพียงคำอวยพร อยากให้เธอนั้นโชคดี", start: { min: 1, sec: 40.5 }, end: { min: 1, sec: 46.5 } },
    { text: "ให้เธอได้พบรักแท้ พบคนที่ดีได้มีชีวิตที่ตรงใจ", start: { min: 1, sec: 47.5 }, end: { min: 1, sec: 55.5 } },
    { text: "มีเพียงความยินดี ที่จะได้เริ่มต้นใหม่", start: { min: 1, sec: 55.5 }, end: { min: 2, sec: 2 } },
    { text: "อยากขอบคุณเธอจริงๆ ที่เคยรักกัน", start: { min: 2, sec: 1.5 }, end: { min: 2, sec: 6.5 } },
    { text: "ถึงแม้ไม่นานเท่าไร มันก็สวยงาม", start: { min: 2, sec: 6.5 }, end: { min: 2, sec: 12.5 } },
    { text: "", start: { min: 2, sec: 12.5 }, end: { min: 2, sec: 13.5 } }, // บรรทัดว่างสำหรับเว้นวรรค/หยุดชั่วคราว
    { text: "ตอนจบที่เจอมันไม่ได้เหมือนที่ต้องการ", start: { min: 2, sec: 14.5 }, end: { min: 2, sec: 20 } },
    { text: "เจ็บปวดแต่มันก็มีความหมาย", start: { min: 2, sec: 21.5 }, end: { min: 2, sec: 27.5 } },
    { text: "ทุกวินาทีที่เราเคยใช้ด้วยกัน", start: { min: 2, sec: 28.5 }, end: { min: 2, sec: 33.5 } },
    { text: "อยากให้รู้ว่าฉันไม่เคยจะเสียดาย", start: { min: 2, sec: 34.5 }, end: { min: 2, sec: 40.5 } },
    { text: "", start: { min: 3, sec: 40.6 }, end: { min: 3, sec: 41.4 } }, // บรรทัดว่างสำหรับเว้นวรรค/หยุดชั่วคราว
    { text: "ถึงจะพยายามเหนี่ยวรั้งไว้นานแค่ไหน", start: { min: 2, sec: 41.5 }, end: { min: 2, sec: 49.5 } },
    { text: "สุดท้ายก็ต้องปล่อยมือไปจากกัน", start: { min: 2, sec: 49.5 }, end: { min: 2, sec: 54.5 } },
    { text: "", start: { min: 2, sec: 54.5 }, end: { min: 2, sec: 55.4 } }, // บรรทัดว่างสำหรับเว้นวรรค/หยุดชั่วคราว
    { text: "ก็คงมีเพียงคำอวยพร อยากให้เธอนั้นโชคดี", start: { min: 2, sec: 56 }, end: { min: 3, sec: 2.5 } },
    { text: "ให้เธอได้พบรักแท้ พบคนที่ดีได้มีชีวิตที่ตรงใจ", start: { min: 3, sec: 2.5 }, end: { min: 3, sec: 10.5 } },
    { text: "มีเพียงความยินดี ที่จะได้เริ่มต้นใหม่", start: { min: 3, sec: 10.5 }, end: { min: 3, sec: 16.5 } },
    { text: "อยากขอบคุณเธอจริงๆ ที่เคยรักกัน", start: { min: 3, sec: 16.5 }, end: { min: 3, sec: 21.5 } },
    { text: "ถึงแม้ไม่นานเท่าไร มันก็สวยงาม", start: { min: 3, sec: 21.5 }, end: { min: 3, sec: 27 } },
    { text: "", start: { min: 3, sec: 27.1 }, end: { min: 3, sec: 27.4 } }, // บรรทัดว่างสำหรับเว้นวรรค/หยุดชั่วคราว
    { text: "อยากบอกว่ารักเธอเท่าไร ฉันก็คงต้องเก็บมันไว้", start: { min: 3, sec: 27.5 }, end: { min: 3, sec: 35.4 } },
    { text: "รอฟังเธอพูดลา", start: { min: 3, sec: 35.5 }, end: { min: 3, sec: 39.5 } },
    { text: "", start: { min: 3, sec: 40.6 }, end: { min: 3, sec: 44.4 } }, // บรรทัดว่างสำหรับเว้นวรรค/หยุดชั่วคราว
    { text: "ก็คงมีเพียงคำอวยพร อยากให้เธอนั้นโชคดี", start: { min: 3, sec: 45 }, end: { min: 3, sec: 52.5 } },
    { text: "ให้เธอได้พบรักแท้ พบคนที่ดีได้มีชีวิตที่ตรงใจ", start: { min: 3, sec: 52.5 }, end: { min: 4, sec: 1.5 } },
    { text: "มีเพียงความยินดี ที่จะได้เริ่มต้นใหม่", start: { min:4, sec: 1.5 }, end: { min: 4, sec:10.5 } },
    { text: "และขอบคุณเธอจริงๆ ที่เคยผูกพัน", start: { min: 4, sec: 10.5 }, end: { min: 4, sec: 15.5 } },
    { text: "ถึงแม้ไม่นานเท่าไร มันก็สวยงาม", start: { min: 4, sec: 15.5 }, end: { min: 4, sec: 22 } },
    { text: "", start: { min: 4, sec: 22.1 }, end: { min: 4, sec: 23 } }, // บรรทัดว่างสำหรับเว้นวรรค/หยุดชั่วคราว
    { text: "แค่คำอวยพรให้โชคดี ที่จะใช้แทนคำๆ นี้", start: { min: 4, sec: 23 }, end: { min: 4, sec: 31.5 } },
    { text: "รักเธอหมดหัวใจ", start: { min: 4, sec: 33.5 }, end: { min: 4, sec: 40 } },
  ];

  // Handles YouTube player state changes (playing, paused, ended)
  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      // Start lyric synchronization interval if not already running
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(syncLyrics, 500) as unknown as number; // Check every 500ms
      }
    } else {
      setIsPlaying(false);
      // Clear lyric synchronization interval when not playing
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Reset active lyric when video ends
      if (event.data === window.YT.PlayerState.ENDED) {
        setActiveLyricIndex(-1);
      }
    }
  };

  // Synchronizes lyrics with current video time
  const syncLyrics = () => {
    const player = playerRef.current;
    if (!player || typeof player.getCurrentTime !== 'function') return;

    const currentTime = player.getCurrentTime();
    let foundIndex = -1;
    // Find the current lyric line based on timestamps
    for (let i = 0; i < lyrics.length; i++) {
      // Convert start and end times to total seconds for comparison
      const lyricStartTimeInSeconds = lyrics[i].start.min * 60 + lyrics[i].start.sec;
      const lyricEndTimeInSeconds = lyrics[i].end.min * 60 + lyrics[i].end.sec;

      if (currentTime >= lyricStartTimeInSeconds && currentTime < lyricEndTimeInSeconds) {
        foundIndex = i;
        break;
      }
    }
    setActiveLyricIndex(foundIndex);

    // Removed auto-scrolling to allow manual scrolling
    // const activeLyricElement = document.getElementById(`lyric-line-${foundIndex}`);
    // if (activeLyricElement) {
    //   activeLyricElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // }
  };

  useEffect(() => {
    // This function must be globally accessible for YouTube IFrame Player API
    // It initializes the YouTube player when the API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!playerRef.current && playerContainerRef.current) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: '1DWka3ZqAHI', // Correct YouTube Video ID for "คำอวยพร - SPF"
          playerVars: {
            'autoplay': 0, // Do not autoplay initially
            'controls': 1, // Show player controls
            'rel': 0, // Do not show related videos
            'modestbranding': 1, // Hide YouTube logo
            'enablejsapi': 1, // Enable JavaScript API
            'origin': window.location.origin, // Crucial for embedding restrictions
            'start': 59, // Start video at 0:59
          },
          events: {
            // Event listener for when the player is ready
            'onReady': (event: any) => {
                // Attempt to autoplay if component is visible and hasn't auto-played yet
                // Removed explicit autoplay here to rely on user interaction or YouTube's default
            },
            // Event listener for player state changes
            'onStateChange': onPlayerStateChange,
          },
        });
      }
    };

    // If YouTube API is already loaded (e.g., on hot reload), initialize player directly
    if (window.YT && window.YT.Player && !playerRef.current && playerContainerRef.current) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
            videoId: '1DWka3ZqAHI', // Correct YouTube Video ID
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'rel': 0,
                'modestbranding': 1,
                'enablejsapi': 1,
                'origin': window.location.origin,
                'start': 59, // Start video at 0:59
            },
            events: {
                'onReady': (event: any) => {
                    // Removed explicit autoplay here to rely on user interaction or YouTube's default
                },
                'onStateChange': onPlayerStateChange,
            },
        });
    }

    // Cleanup function to clear interval and destroy player on component unmount
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Removed the useEffect for autoplay based on isVisible and hasAutoPlayed
  // as the user wants to rely solely on YouTube's controls.


  // Toggles play/pause state of the video (this function is no longer used by a custom button)
  const togglePlay = () => {
    // This function is now effectively unused as the custom play/pause button is removed.
    // Playback will be controlled by the YouTube player's built-in controls.
  };

  // Toggles the liked state of the song
  const toggleLike = () => {
    setIsLiked(prev => !prev);
    // You could add a toast notification here for user feedback
    // e.g., toast({ title: isLiked ? "เอาใจออกแล้ว 💔" : "มอบใจให้แล้ว! 💖" });
  };

  // Toggles the mute state of the player
  const toggleMute = () => {
    const player = playerRef.current;
    if (player && typeof player.isMuted === 'function' && typeof player.mute === 'function' && typeof player.unMute === 'function') {
      if (player.isMuted()) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-0 shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="bg-black/20 backdrop-blur-sm p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">เพลงที่เราอยากให้เธอฟัง</h3>
                  <p className="text-white/70">คำอวยพร - SPF</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Heart
                  className={`w-6 h-6 ${isLiked ? 'text-red-500' : 'text-pink-400/70'} animate-pulse cursor-pointer hover:scale-110 transition-transform`}
                  onClick={toggleLike}
                />
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white/70 cursor-pointer hover:scale-110 transition-transform" onClick={toggleMute} />
                ) : (
                  <Volume2 className="w-6 h-6 text-white/70 cursor-pointer hover:scale-110 transition-transform" onClick={toggleMute} />
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-0">
            {/* Music Player Section */}
            <div className="relative">
              <div className="aspect-video bg-black">
                {/* Placeholder div where the YouTube player will be injected by the API */}
                <div id="youtube-player-placeholder" ref={playerContainerRef} className="w-full h-full" />
              </div>
              
              {/* Removed custom play/pause button and its container */}
              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                </div>
              </div> */}
            </div>

            {/* Lyrics Section */}
            <div className="p-8 bg-black/10 backdrop-blur-sm">
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-2 text-pink-300">🎵 เนื้อเพลง</h4>
                <p className="text-white/70 text-sm">
                  เพลงนี้สื่อถึงความรู้สึกที่เรามีให้เธอ 💖
                  
                </p>
                <p className="text-white/70 text-sm">
                  เลื่อนเว็บไปด้วยเปิดฟังไปด้วยนะ
                </p>
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {lyrics.map((line, index) => (
                  <div
                    key={index}
                    id={`lyric-line-${index}`}
                    // Apply text-wrap and adjust font size for active line to prevent overflow
                    className={`transition-all duration-300 mb-1 text-base ${ 
                      line.text.trim() === '' ? 'h-2' : '' 
                    } ${
                      activeLyricIndex === index
                        ? 'text-pink-300 font-bold text-lg whitespace-normal' // Increased font size, added whitespace-normal
                        : 'text-white/70 leading-relaxed hover:text-pink-300 cursor-pointer whitespace-normal' // Added whitespace-normal
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-pink-300 text-sm font-semibold mb-2">💝 ข้อความจากเรา</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  เพลงนี้สื่อถึงความรู้สึกที่เรามีให้เธอ ถึงแม้เราจะเลิกกันไปแล้ว
                  แต่เราก็หวังว่าเธอจะเจอคนดีๆ และอยากให้เธอจำไว้ว่าเราคนนี้เป็นห่วง หวังดีกับเธอเสมอเลย ถ้าเธอรู้สึกตันไม่รู้จะมองไปทางไหน จำไว้นะว่าหลังเธอ 1 ก้าวจะมีเราเสมอนะ 🌟
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPlayer;
