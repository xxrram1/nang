import { useState, useEffect, useRef } from 'react';
import { Heart, Cake, IceCream, Star, Lock, Unlock, Camera, Music, Gift, Sparkles, Key, Crown, X, Smile, MessageSquareText, Send, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import MusicPlayer from '@/components/MusicPlayer';
import { Dialog, DialogContent, DialogOverlay, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pin, setPin] = useState('');
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [showPinError, setShowPinError] = useState(false);
  const [showPinSuccess, setShowPinSuccess] = useState(false);
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageSrc, setLightboxImageSrc] = useState('');
  const [lightboxImageAlt, setLightboxImageAlt] = useState('');

  // Quiz Game States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [quizFeedbackMessage, setQuizFeedbackMessage] = useState<string | null>(null);

  // Calendar Memory States
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  const musicPlayerRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      title: "เรื่องราวดีๆ ที่เราอยากบอกให้เธอฟัง 😊",
      subtitle: "เธอคนน่ารักคนนี้ชอบเค้กช็อกโกแลต อร่อยๆ 🍰",
      bgColor: "bg-gradient-to-br from-pink-300 to-purple-400"
    },
    {
      title: "รอยยิ้มของเธอน่ารักสุดๆ 🌟",
      subtitle: "ชินจัง คือการ์ตูนที่เธอชอบมากๆ 🖍️",
      bgColor: "bg-gradient-to-br from-yellow-300 to-orange-400"
    },
    {
      title: "ของหวานอร่อยๆที่เธอชอบกิน 💖",
      subtitle: "ไอติม ชาคูลซ่า โออิชิ เยลลี่ ของหวานๆเธอชอบทั้งนั้นเลยย 🍦",
      bgColor: "bg-gradient-to-br from-pink-400 to-rose-400"
    },
    {
      title: "เธอคือกำลังใจของเราเสมอมา 💫",
      subtitle: "แค่เราเห็นเธอมีความสุขเราก็มีความสุขมากๆแล้วว ✨",
      bgColor: "bg-gradient-to-br from-blue-300 to-cyan-400"
    },
    {
      title: "รอยยิ้มและเสียงหัวเราะของเธอเราชอบที่สุดเลย 🎶",
      subtitle: "เธอจำได้ไหมที่เราไปเที่ยวที่ต่างๆด้วยหลายๆที่ มันสนุกมากๆเลยเนอะ 🚲",
      bgColor: "bg-gradient-to-br from-green-300 to-teal-400"
    }
  ];

  const galleryItems = [
    { src: "https://i.postimg.cc/KYcGmdCf/1729357562236.jpg", alt: "Memory 1", category: "trip", caption: "เดินงานชักพระด้วยกัน 2 คน" },
    { src: "https://i.postimg.cc/rpYkMz1y/FB-IMG-1731333962679.jpg", alt: "Memory 1", category: "trip", caption: "ภาพถ่ายเรา 2 คน" },
    { src: "https://i.postimg.cc/X7x1Tmc4/Messenger-creation-FD0-E7-C5-F-5978-4-B0-B-8416-A0-E7-D33-AFBAB.jpg", alt: "Memory 1", category: "trip", caption: "งานวันเด็ก" },
    { src: "https://i.postimg.cc/hjGHYnNF/20250110-170550.jpg", alt: "Memory 1", category: "trip", caption: "ซื้อลิป ที่ watsons" },
    { src: "https://i.postimg.cc/c4WVqfpM/FB-IMG-1745754193044.jpg", alt: "Memory 2", category: "nature", caption: "ไอพิ้งง" },
    { src: "https://i.postimg.cc/dVHXTpL4/FB-IMG-1745754414101.jpg", alt: "Memory 1", category: "trip", caption: "ดูหนัง" },
    { src: "https://i.postimg.cc/02pPDksZ/1735305778507.jpg", alt: "Memory 1", category: "trip", caption: "ไปสหไทยด้วยกัน" },
    { src: "https://i.postimg.cc/Sxg0fjtL/FB-IMG-1745753589491.jpg", alt: "Memory 1", category: "special", caption: "วันเกิดเธอ" },
    { src: "https://i.postimg.cc/HxQB3hkG/Messenger-creation-44-C01-FE0-A54-F-4916-8-C69-02-A8997-D7100.jpg", alt: "Memory 2", category: "nature", caption: "งานวันเด็ก" },
    { src: "https://i.postimg.cc/43Y0vPcZ/FB-IMG-1745754435397.jpg", alt: "Memory 2", category: "nature", caption: "น่ารักเนอะ" },
    { src: "https://i.postimg.cc/BbTkLvKK/FB-IMG-1745753922908.jpg", alt: "Memory 2", category: "nature", caption: "วันวิทยาศาสตร์" },
    { src: "https://i.postimg.cc/430rjqGm/FB-IMG-1745753741219.jpg", alt: "Memory 2", category: "nature", caption: "เล่นฟิลเตอร์กัน" },
    { src: "https://i.postimg.cc/50vkTtpR/FB-IMG-1745754385821.jpg", alt: "Memory 6", category: "trip", caption: "ไปดูเธองานชักพระรอบ 1" },
    { src: "https://i.postimg.cc/sgjdW5KD/FB-IMG-1745753628466.jpg", alt: "Memory 2", category: "nature", caption: "ตุ๊กตาน่ารักเนอะ" },
    { src: "https://i.postimg.cc/tCtG7B3M/FB-IMG-1742212873055.jpg", alt: "Memory 3", category: "activity", caption: "โต๊ะของเรา อิอิ" },
    { src: "https://i.postimg.cc/nhGVbHSM/1729253602733.jpg", alt: "Memory 6", category: "trip", caption: "ดูเธอเดินงานชักพระรอบ 2" },
    { src: "https://i.postimg.cc/sXqs91xH/1734694405695.jpg", alt: "Memory 2", category: "nature", caption: "ลากิจ ไปดูเธอเดินขบวนกีฬาสี อิอิ" },
    { src: "https://i.postimg.cc/mDPN5ZNF/Screenshot-20250709-204023-Instagram.jpg", alt: "Memory 2", category: "nature", caption: "วันปัจฉิมเรา" },
    { src: "https://i.postimg.cc/DzzT91bY/1740139611293.jpg", alt: "Memory 2", category: "nature", caption: "วันปัจฉิมเธอ" },
    { src: "https://i.postimg.cc/5NMMxhCz/FB-IMG-1742212585522.jpg", alt: "Memory 2", category: "nature", caption: "วันวาเลนไทน์ ดอกไม้ต่อเลโก้" },
    { src: "https://i.postimg.cc/CMkW6cQx/FB-IMG-1745754023649.jpg", alt: "Memory 2", category: "nature", caption: "ขอร้องให้เธอทำการบ้านให้ 5555" },
    { src: "https://i.postimg.cc/50YM01gB/1740245565808.jpg", alt: "Memory 6", category: "trip", caption: "เดินงานกาชาดด้วยกัน" },
    { src: "https://i.postimg.cc/gk6PdYjm/20241227-182545.jpg", alt: "Memory 6", category: "trip", caption: "ร้องเพลงคาราโอเกะ" },
    { src: "https://i.postimg.cc/pd02rsHH/1733486963703.jpg", alt: "Memory 3", category: "activity", caption: "ชุดช็อปป" },
    { src: "https://i.postimg.cc/dQh0kc3S/1725970715817.jpg", alt: "Memory 3", category: "activity", caption: "ชุดนักศึกษา" },
    { src: "https://i.postimg.cc/J0DS1q1P/20241121-153325.jpg", alt: "Memory 3", category: "activity", caption: "เบบี๋ทรี อิอิ" },
    { src: "https://i.postimg.cc/dtMJh7zL/1734835592381.jpg", alt: "Memory 6", category: "trip", caption: "กินสังกะสีฉลองปิดเทอม" },
    { src: "https://i.postimg.cc/ZnxsYDGP/FB-IMG-1747317083693.jpg", alt: "Memory 6", category: "trip", caption: "กินสังกะสีฉลองปิดเทอม (ภาพรวม)" },
    { src: "https://i.postimg.cc/x1DV1WNH/20250328-134309.jpg", alt: "Memory 6", category: "trip", caption: "ไปเดินเที่ยวส่งท้ายวันเลิกกัน 😢" },
    { src: "https://i.postimg.cc/sfGVfPHk/1734835591906.jpg", alt: "Memory 4", category: "special", caption: "วันเกิดเธอ" },
    { src: "https://i.postimg.cc/05Ss1kbx/FB-IMG-1739088812769.jpg", alt: "Memory 2", category: "nature", caption: "วันวิทยาศาสตร์" },
    { src: "https://i.postimg.cc/L8bCsPbW/Screenshot-20241002-015014-Messenger.jpg", alt: "Memory 4", category: "special", caption: "วันเกิดเรา (ช่วงปิดเทอมพอดี)" },
    { src: "https://i.postimg.cc/c4Y4h7QR/1727535467191.jpg", alt: "Memory 4", category: "special", caption: "วันเกิดเรา " },
    { src: "https://i.postimg.cc/8Cx0Zvdv/FB-IMG-1745754270173.jpg", alt: "Memory 5", category: "special", caption: "วันเกิดเรา" },
    { src: "https://i.postimg.cc/gjF12hnp/FB-IMG-1745754099975.jpg", alt: "Memory 2", category: "nature", caption: "วันภาษาไทย" },
    { src: "https://i.postimg.cc/1zVWVtx3/Screenshot-20250509-194528-Instagram.jpg", alt: "Memory 3", category: "activity", caption: "เทคนิคเที่ยวสหไทย" },
    { src: "https://i.postimg.cc/tJ6yryVq/1734835591726.jpg", alt: "Memory 6", category: "trip", caption: "งานกาชาด" },
  ];

  const quizQuestions = [
    {
      question: "เธอชอบเค้กรสอะไรมากที่สุด?",
      options: ["เค้กส้ม", "เค้กช็อกโกแลต", "เค้กมะพร้าว", "เค้กชาเขียว"],
      answer: "เค้กช็อกโกแลต"
    },
    {
      question: "ตัวการ์ตูนตัวโปรดของเธอ?",
      options: ["โดเรมอน", "ชินจัง", "ปิกาจู", "คิตตี้"],
      answer: "ชินจัง"
    },
    {
      question: "อะไรที่เราเคยทำกันที่เกาะลำพู?",
      options: ["กินข้าว", "วิ่งเล่น", "ปั่นจักรยาน", "ถ่ายรูป"],
      answer: "ปั่นจักรยาน"
    },
    {
      question: "เราเกิดวันที่เท่าไหร่",
      options: ["2", "10", "20", "12"],
      answer: "2"
    },
    {
      question: "เราเรียกเธอว่าอะไร? (เมื่อก่อน)",
      options: ["น้อง", "นาง", "หมูอ้วน", "บี๋"],
      answer: "บี๋"
    }
  ];

  const memorableDates = [
    { date: new Date(2025, 1, 12), title: "วันเกิดน้องนาง 🎂", description: "ขอให้เธอมีความสุขมากๆ" },
    { date: new Date(2022, 9, 9), title: "วันแรกที่เราคุยกัน 💖", description: "จุดเริ่มต้นของเรื่องราวดีๆ ของเรา" },
    { date: new Date(2022, 10, 16), title: "วันครบรอบ ✨", description: "วันครบรอบที่เราเคยคบกันยังจำได้อยู่นะ" }
  ];

  // Modifiers for Calendar to highlight specific dates annually
  const calendarModifiers = {
    birthday: (day: Date) => day.getMonth() === 1 && day.getDate() === 12, // February 12
    specialAnniversary: (day: Date) => day.getMonth() === 10 && day.getDate() === 16, // November 16
  };

  const calendarClassNames = {
    day_birthday: "day-birthday",
    day_specialAnniversary: "day-special-anniversary",
  };

  // Calculate days known for statistics
  const firstMeetingDate = new Date(2022, 11, 16); // October 9, 2022
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - firstMeetingDate.getTime());
  const daysKnown = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // New Cute Statistics Data (placeholder values for demonstration)
  const smilesCaused = 121.71; // A cute, arbitrary number
  const sweetMessages = 28.03; // Another cute, arbitrary number
  const songsDedicated = 2.34; // Placeholder
  const heartEmojis = 3000; // Placeholder

  // Chart data structure updated for multiple bars on a single x-axis category
  const chartData = [
    {
      category: 'ความสัมพันธ์ของเรา', // A single category for all metrics
      daysKnown: daysKnown,
      smilesCaused: smilesCaused,
      sweetMessages: sweetMessages,
      songsDedicated: songsDedicated,
      heartEmojis: heartEmojis,
    },
  ];

  // Chart configuration for colors and labels
  const chartConfig = {
    daysKnown: {
      label: 'วันที่รู้จักกัน (วัน)',
      color: 'hsl(var(--chart-1))',
      icon: CalendarDays,
    },
    smilesCaused: {
      label: 'วันที่รู้จักกัน (สัปดาห์)',
      color: 'hsl(var(--chart-2))',
      icon: Smile,
    },
    sweetMessages: {
      label: 'วันที่รู้จักกัน (เดือน)',
      color: 'hsl(var(--chart-3))',
      icon: MessageSquareText,
    },
    songsDedicated: {
      label: 'วันที่รู้จักกัน (ปี)',
      color: 'hsl(var(--chart-4))',
      icon: Music,
    },
    heartEmojis: {
      label: 'หัวใจที่มอบให้ (ดวง)',
      color: 'hsl(var(--chart-5))',
      icon: Heart,
    },
  };

  const filteredGalleryItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for Music Player
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMusicPlayerVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (musicPlayerRef.current) {
      observer.observe(musicPlayerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePinComplete = (value: string) => {
    setPin(value);
    if (value === '021051') {
      setIsPinUnlocked(true);
      setShowPinError(false);
      setShowPinSuccess(true);
      setTimeout(() => setShowPinSuccess(false), 3000);
    } else if (value.length === 6) {
      setShowPinError(true);
      setTimeout(() => {
        setShowPinError(false);
        setPin('');
      }, 3000);
    }
  };

  const openLightbox = (src: string, alt: string) => {
    setLightboxImageSrc(src);
    setLightboxImageAlt(alt);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImageSrc('');
    setLightboxImageAlt('');
  };

  const handleQuizAnswer = (selectedOption: string) => {
    if (selectedQuizAnswer !== null) return; // Prevent multiple selections

    setSelectedQuizAnswer(selectedOption);

    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setQuizScore(prevScore => prevScore + 1);
      setQuizFeedbackMessage("ถูกต้องแล้วว! เก่งมากก 🎉");
    } else {
      setQuizFeedbackMessage(`ผิดด! คำตอบที่ถูกคือ: "${currentQuestion.answer}" 😢`);
    }

    setTimeout(() => {
      setQuizFeedbackMessage(null);
      setSelectedQuizAnswer(null);
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        setShowQuizResults(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setShowQuizResults(false);
    setSelectedQuizAnswer(null);
    setQuizFeedbackMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          <div className={`w-full h-full ${slides[currentSlide].bgColor} opacity-90`} />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce">
              สำหรับน้องนาง
            </h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 animate-scale-in">
              <h2 className="text-2xl md:text-4xl font-semibold mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg md:text-2xl opacity-90">
                {slides[currentSlide].subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute text-white/30 animate-pulse`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                fontSize: `${1.5 + (i % 2) * 0.5}rem`
              }}
            />
          ))}
        </div>
      </section>

      {/* Long Message Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4 animate-fade-in">
                  สมุดบันทึกเรื่องราวของเรากับเธอ 😊
                </h2>
                <div className="flex justify-center space-x-4 text-pink-500">
                  <Star className="animate-spin" style={{ animationDuration: '3s' }} />
                  <Heart className="animate-pulse" />
                  <Star className="animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                <p className="text-xl">
                  ทักครับน้องง อ่านให้จบด้วยขอร้องง! ขอใช้คำว่าเรากับเธอละกันเนอะ พอดีไม่ชินกับคำอื่น5555 เราไม่รู้ว่าเธอจะมาเจอหน้านี้เมื่อไหร่นะ แต่เราอยากบันทึกเรื่องราวดีๆ ของเรา 2 คนไว้เยอะๆ ถึงจะเป็นในอดีตก็เถอะะ 😊 
                  เราก็แอบเขินๆ เหมือนกันที่จะมาบอกอะไรแบบนี้ แต่เธอคือ <span className="text-pink-600 font-bold">'บีบี๋'</span> ที่เราเอ็นดูและรักเสมอเลยนะ 55555 💕
                </p>

                <p>
                  เราจำได้เลยว่าเวลาที่เธอ <span className="text-yellow-600 font-semibold">ยิ้มและหัวเราะ</span> มันทำเรามีความสุขมากจริงๆนะะ
                  เวลาที่เธอหัวเราะยิ้มหรืออะไรต่างๆจะทำให้รู้สึกดีมากๆเลย แบบรู้สึกว่าวันนี้มีแรงเลยอะะ 😊
                </p>

                <p>
                  เราชอบเวลาที่ได้ <span className="text-blue-600 font-semibold">คุยกับเธอ</span> ได้พูดคุยเรื่องนู้นเรื่องนี้ด้วยกัน เธอเป็นคนที่คุยแล้วรู้สึกแบบเพลินมากอะ ไปได้เรื่อยๆ คุยไปยิ้มไป 
                  ทำให้เราไม่เหงาเลย เวลาเธอ <span className="text-green-600 font-semibold">โทรคุยเปิดกล้อง</span> ก็รู้สึกเหมือนอยู่ข้างๆกันเลย อบอุ่นดี เวลาโทรก็จะใช้เปิดกล้องตลอดด 55555
                </p>

                <p>
                  โมเม้นท์ ที่เรามีความสุข คือ <span className="text-orange-600 font-semibold">ตอนที่เราได้ไปเที่ยวที่ต่างๆด้วยกัน</span> เราเคยไปปั่นจักรยานที่  
                  <span className="text-teal-600 font-bold"> เกาะลำพู</span> เคยไป <span className="text-pink-600 font-bold">งานกาชาด</span> และ <span className="text-yellow-600 font-semibold">งานสวนสนุก</span> และเดินเที่ยวดูหนัง ที่ <span className="text-purple-600 font-semibold"> สหไทย </span> ด้วยกัน มันเป็นความทรงจำที่น่ารักมากๆและรู้สึกดีมากๆเลยนะ คิดย้อนกลับไปก็มีเรื่องราวเข้ามาในหัวทำให้น้ำตาซึมได้ตลอด ตอนดูหนังกัน ตอนปั่นจักรยานกัน ตอนเล่นสวนสนุกกัน ตอนเดินงานกาชาดด้วยกัน รวมถึงตอนอยู่ด้วยกันที่โรงเรียน ร้องเพลงแล้วก็กระโดดหน้าคอนเสริตที่เวที ท.5 ด้วยกัน นี้พิมพ์มาตั้งเยอะยังไม่หมดอะ คิดดู 2 ปีครึ่งที่อยู่กันมาได้ความทรงจำเยอะแค่ไหน นี้ยังจำตอนงานวันเด็กที่เธอได้จักรยานอยู่เลย 55555 อะไรหลายๆอย่างมันมีความหมายมากต่อเรามากเลยนะ เธอรู้ไหม
                </p>

                <p>
                    แล้วเมื่อก่อนเวลาที่เรา <span className="text-purple-600 font-semibold">มองตา</span> เธอ เธอจะชอบ <span className="text-pink-600 font-semibold">เขิน</span> ละหลบหน้า ทำโกรธตลอด ดูน่ารักมากเลย 555555
                  แล้วก็ชอบเวลาที่เราได้ <span className="text-red-500 font-semibold">จับมือ</span> กัน มันทำให้เรารู้สึกอบอุ่นเสมอเลย
                   ละเธอรู้ไหม เวลาที่เธอ <span className="text-pink-600 font-bold">อ้อน</span> เรานะ เราจะเขินมากและรู้สึกดีไปทั้งวันเลยอะ จะรู้สึกว่าเธอน่าเอ็นดูม๊ากกน่ารักม๊ากก 5555 😊
                </p>

                <p>
                  เราเห็นเธอเป็น <span className="text-yellow-600 font-bold">เด็กน่ารัก</span> เสมอเลยนะ ไม่ว่าจะเธอจะทำอะไร เราก็เอ็นดูและเป็นห่วงเธอเสมอเลย
                </p>

                <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-6 rounded-xl border-l-4 border-pink-500">
                  <p className="font-semibold text-lg">
                    เธอคือทุกสิ่งทุกอย่างของเราจริงๆ ถึงจะไม่ได้คบกันแล้ว แต่เราก็ยังเป็นห่วงห่างๆนะะ 💖 เรายังจำได้ว่าเธอชอบ
                    <span className="text-brown-600 font-bold"> เค้กช็อกโกแลต</span> อร่อยๆ ชอบ 
                    <span className="text-blue-600 font-bold"> ไอติม ชาคูลซา โออิชิ</span> ของหวานๆนี้อะชอบหมดแหละแต่ต้องอร่อยด้วย และเธอก็ชอบดู
                    <span className="text-orange-600 font-bold"> ชินจัง</span> มากด้วยย 😊 
                    ทุกอย่างที่เป็นอ้วง เราก็จำได้หมดนั้นแหละะ
                  </p>
                </div>

                <p className="text-xl text-center font-semibold text-purple-800">
                  ไม่ว่าวันเวลาจะผ่านไปนานแค่ไหน เธอก็ยังที่ 1 ในใจเราเสมอนั้นแหละ 55555 
                  เราขอให้เธอมีความสุขมากๆนะ เจอคนดีๆที่ไม่ทำร้ายจิตใจเธอ ให้เธอมีแต่รอยยิ้ม ให้เธอไม่เจ็บไม่ไข้ มีความสุขเสมอนะ 😊 
                </p>

                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600 animate-pulse">
                    และเราก็รักและเป็นห่วงเธอเสมอนะ (ไม่ต้องห่วงเว็บนี้มีแค่เรา 2 คนที่รู้) 💖
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Music Player Section */}
      <section ref={musicPlayerRef} className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            🎵 เพลงที่เราอยากให้เธอฟัง 🎵
          </h2>
          <p className="text-white/80 text-lg mb-8">
            เพลงนี้สื่อถึงความรู้สึกที่เรามีให้เธอนะ 💖
          </p>
        </div>
        <MusicPlayer isVisible={isMusicPlayerVisible} />
      </section>

      {/* Enhanced OTP PIN System Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute text-white/30 animate-pulse`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.8}s`,
                fontSize: `${1.5 + (i % 2) * 0.5}rem`
              }}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Card className={`bg-white/80 backdrop-blur-sm shadow-2xl border-2 transition-all duration-1000 ${isPinUnlocked ? 'border-green-300 shadow-green-200/50' : 'border-purple-200'}`}>
            <CardContent className="p-10">
              {!isPinUnlocked ? (
                <div className="animate-fade-in">
                  <div className="relative mb-6">
                    <Lock className="mx-auto text-purple-600 w-16 h-16 animate-bounce" />
                    <div className="absolute -top-2 -right-2">
                      <Key className="w-8 h-8 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-purple-800 mb-6 animate-pulse">
                    🔮 ความลับของเราที่มีต่อเธอ 🔮
                  </h3>
                  
                  <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-6 rounded-xl mb-8 border-2 border-pink-300">
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      มีเรื่องราวลับๆที่เรากับเธอ 💕<br />
                      แต่ต้องใส่รหัสผ่านให้ถูกก่อนถึงเห็นน 😊
                    </p>
                    <div className="bg-white/60 p-4 rounded-lg">
                      <p className="text-pink-700 font-semibold text-lg">
                        🎂 ลองใส่วันเดือนปีเกิดของเราดู จะจำได้มั้ยนะะ
                      </p>
                      <p className="text-sm text-purple-600 animate-pulse mt-2">
                        💡 คำใบ้: 02 ? 51 ( ? คือ เติมเลขเดือน ) ✨
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-6 max-w-sm mx-auto">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">ใส่รหัส 6 หลัก</p>
                      <InputOTP
                        maxLength={6}
                        value={pin}
                        onChange={handlePinComplete}
                        className="justify-center"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-12 h-12 text-lg font-bold border-2 border-purple-300 rounded-xl bg-white/80" />
                          <InputOTPSlot index={1} className="w-12 h-12 text-lg font-bold border-2 border-purple-300 rounded-xl bg-white/80" />
                          <InputOTPSlot index={2} className="w-12 h-12 text-lg font-bold border-2 border-purple-300 rounded-xl bg-white/80" />
                          <InputOTPSlot index={3} className="w-12 h-12 text-lg font-bold border-2 border-purple-300 rounded-xl bg-white/80" />
                          <InputOTPSlot index={4} className="w-12 h-12 text-lg font-bold border-2 border-purple-300 rounded-xl bg-white/80" />
                          <InputOTPSlot index={5} className="w-12 h-12 text-lg font-bold border-2 border-purple-300 rounded-xl bg-white/80" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  {showPinError && (
                    <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl animate-shake">
                      <p className="text-red-700 font-semibold">
                        🙈 อุ๊ปส์! รหัสไม่ถูกต้องนะ ลองใหม่! 
                        <br />💭 คิดถึงวันเกิดของเราดูนะ ( เดือน 10 ไหมน้าา? )
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-scale-in">
                  {showPinSuccess && (
                    <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl animate-bounce">
                      <p className="text-green-700 font-bold text-lg">
                        🎉 ยินดีด้วย! เธอเก่งมาก! 🎉
                      </p>
                    </div>
                  )}

                  <div className="relative mb-6">
                    <Unlock className="mx-auto text-green-600 w-16 h-16 animate-bounce" />
                    <div className="absolute -top-3 -right-3">
                      <Crown className="w-10 h-10 text-yellow-500 animate-pulse" />
                    </div>
                    <div className="absolute -top-2 -left-2">
                      <Sparkles className="w-8 h-8 text-pink-500 animate-spin" style={{ animationDuration: '2s' }} />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-green-800 mb-8 animate-rainbow bg-clip-text text-transparent">
                    🌟 เรื่องราวลับๆ 🌟
                  </h3>
                  
                  <Carousel className="w-full max-w-2xl mx-auto">
                    <CarouselContent>
                      <CarouselItem>
                        <Card className="bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-300 hover:scale-105 transition-transform duration-500 shadow-xl">
                          <CardContent className="p-8">
                            <div className="flex items-center justify-center mb-4">
                              <Gift className="w-12 h-12 text-pink-600 animate-bounce mr-3" />
                              <Crown className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h4 className="text-2xl font-bold text-pink-800 mb-4">🎁 ความรู้สึกของเราที่มีต่อเธอ</h4>
                            <div className="bg-white/70 p-4 rounded-lg">
                              <p className="text-gray-700 leading-relaxed">
                                ทุกความทรงจำที่เราเคยมีด้วยกัน เป็นสิ่งที่ดีที่สุดในชีวิตเราแล้ว 🎀
                                <br />✨ เธอคือทุกสิ่งสำหรับเราเลย ต่อให้ไม่ได้คบกัน แต่ถ้าเราเห็นเธอมีความสุข เราก็มีความสุข
                                <br />💖 ขอบคุณที่เธอยิ้ม มีความสุข หัวเราะ ถึงวันนี้อะไรต่างๆอาจจะไม่เหมือนเดิม แต่ความรู้สึกทุกอย่างของเราที่มีต่อเธอมันเหมือนเดิมเสมอเลยนะ
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>

                      <CarouselItem>
                        <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-300 hover:scale-105 transition-transform duration-500 shadow-xl">
                          <CardContent className="p-8">
                            <div className="flex items-center justify-center mb-4">
                              <Music className="w-12 h-12 text-blue-600 animate-pulse mr-3" />
                              <Heart className="w-8 h-8 text-red-500 animate-pulse" />
                            </div>
                            <h4 className="text-2xl font-bold text-blue-800 mb-4">🎵 เสียงหัวเราะและรอยยิ้มของเธอ</h4>
                            <div className="bg-white/70 p-4 rounded-lg">
                              <p className="text-gray-700 leading-relaxed">
                                เวลาที่เธอยิ้มหรือหัวเราะจะเป็นช่วงที่มีความสุขมากที่สุดเลย เหมือนเราคนนี้ทำให้เธอสดใสได้ 🎶
                                <br />🌈 ทุกครั้งที่คุยกันแล้วเธอยิ้ม เราจะแฮปปี้มากๆ เห็นเธอชอบเราก็มีความสุข
                                <br />🎭 ขอให้เธอยิ้มและหัวเราะแบบนี้ไปตลอดนะ อย่าให้มีความทุกข์ใจใดๆเข้ามาเถอะะ สาธุ 55555
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>

                      <CarouselItem>
                        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-300 hover:scale-105 transition-transform duration-500 shadow-xl">
                          <CardContent className="p-8">
                            <div className="flex items-center justify-center mb-4">
                              <Star className="w-12 h-12 text-yellow-600 animate-spin mr-3" style={{ animationDuration: '4s' }} />
                              <Sparkles className="w-10 h-10 text-orange-500 animate-pulse" />
                            </div>
                            <h4 className="text-2xl font-bold text-yellow-800 mb-4">⭐ เหตุผลที่เธอคือคนพิเศษเสมอมา</h4>
                            <div className="bg-white/70 p-4 rounded-lg">
                              <p className="text-gray-700 leading-relaxed">
                                🌟 เธอนิสัยดีมาก บ้านๆ ยิ้มง่าย หัวเราะง่าย เวลาโกรธก็ดูน่าเอ็นดูแก้มป่อง คิ้วติดกัน 55555
                                <br />😊 เธอเป็นคนที่มีความสุขกับอะไรง่ายๆได้
                                <br />💫 เธอน่ารักในแบบของเธอเอง
                                <br />✨ เธอสดใส และเป็นเด็กน้อยน่ารักในสายตาเราเสมอ
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>

                      <CarouselItem>
                        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-2 border-purple-300 hover:scale-105 transition-transform duration-500 shadow-xl">
                          <CardContent className="p-8">
                            <div className="flex items-center justify-center mb-4">
                              <Heart className="w-12 h-12 text-purple-600 animate-pulse mr-3" />
                              <Crown className="w-10 h-10 text-pink-500 animate-bounce" />
                            </div>
                            <h4 className="text-2xl font-bold text-purple-800 mb-4"> ข้อความลับ</h4>
                            <div className="bg-white/70 p-4 rounded-lg border-l-4 border-purple-400">
                              <p className="text-gray-700 leading-relaxed font-semibold">
                                 ✨ 3 ข้อหลักๆ (พอเธออ่านจบเธอจะ อ๋ออ ทันที 55555)
                                <br /> ข้อที่ 1 ที่ถาม ว่ารักบ้างไหม ก็ฉันไม่มีวันไหน ที่ใจจะไม่ จะไม่รักเธอ
                                <br /> ข้อที่ 2 ทำไมฉันต้องคิดถึง เมื่อฉันจะดึงเธอไว้ใกล้ๆ ไม่ห่าง ให้ฉันต้องห่วง
                                <br /> ข้อสุดท้าย หากวันนั้นเธอต้องตาย จะไม่รู้สึกขาดหาย เพราะฉันจะตายแทนเธอ
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                  </Carousel>

                  <div className="mt-8 p-6 bg-gradient-to-r from-pink-200 via-purple-200 to-rose-200 rounded-2xl border-2 border-pink-400">
                    <p className="text-xl font-bold text-purple-800 animate-pulse">
                      🎀 เราจะเอ็นดูเธอเจม๋ออ 👑💖
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      💡 ปัดซ้าย-ขวาเพื่อดูเนื้อหาทั้งหมดน้าา
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* New Cute Sections */}
      
      {/* Cake & Ice Cream Corner */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-12 animate-fade-in">
            🍰 มุมของหวานและสนุกของเธอ 🍦
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-b from-orange-100 to-orange-200 border-orange-300 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <Cake className="mx-auto mb-4 text-orange-600 w-12 h-12 animate-bounce" />
                <h3 className="font-bold text-orange-800 mb-2">เค้กช็อกโกแลต 🍰</h3>
                <p className="text-sm text-gray-600">
                  เธอชอบ เค้กช็อกโกแลต แต่ต้องเป็นร้านอร่อยๆเท่านั้นนะ ถ้าไม่อร่อยคือไม่ปลื้มม

                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-cyan-100 to-cyan-200 border-cyan-300 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <IceCream className="mx-auto mb-4 text-cyan-600 w-12 h-12 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <h3 className="font-bold text-cyan-800 mb-2">ไอติม ชาคูลซ่า โออิชิ เยลลี่ และของหวานๆ 🍦</h3>
                <p className="text-sm text-gray-600">
                  ของหวานพวกนี้เธอจะชอบมาก อะไรหวานๆมาเถอะ แต่ข้าวกับของมีประโยชน์นี้ขอไม่สู้ 55555 (ถึงแม้บางอย่างตอนนี้อาจจะเฉยๆ ไปบ้างแล้ว แต่เรายังจำได้นะ อิอิ 😊)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-red-100 to-red-200 border-red-300 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-red-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.4s' }}>
                  🖍️
                </div>
                <h3 className="font-bold text-red-800 mb-2">ชินจังจอมแก่นน 🖍️</h3>
                <p className="text-sm text-gray-600">
                   เป็นการ์ตูนที่เธอชอบมากก เราเคยซื้อกิ๊ฟชินจังให้เธอด้วย ตอนนั้นเธอยิ้มจนแก้มฉีกเลยย น่ารักดีเนอะะ
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Memory Gallery - Enhanced Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-4 animate-fade-in">
            🌟 เรื่องราวดีๆ ของเรา 📸
          </h2>
          <p className="text-center text-gray-600 mb-8">ภาพความทรงจำดีๆ (กดที่ภาพเพื่อดูภาพเต็ม) 💖</p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-base hover:bg-pink-200 transition-colors"
              onClick={() => setSelectedCategory('all')}
            >
              ทั้งหมด
            </Badge>
            <Badge
              variant={selectedCategory === 'trip' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-base hover:bg-pink-200 transition-colors"
              onClick={() => setSelectedCategory('trip')}
            >
              ไปเที่ยว
            </Badge>
            <Badge
              variant={selectedCategory === 'nature' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-base hover:bg-pink-200 transition-colors"
              onClick={() => setSelectedCategory('nature')}
            >
              เทศบาล 5
            </Badge>
            <Badge
              variant={selectedCategory === 'activity' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-base hover:bg-pink-200 transition-colors"
              onClick={() => setSelectedCategory('activity')}
            >
              เทคนิค
            </Badge>
            <Badge
              variant={selectedCategory === 'special' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-base hover:bg-pink-200 transition-colors"
              onClick={() => setSelectedCategory('special')}
            >
              วันเกิด
            </Badge>
          </div>

          {/* Image Gallery */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleryItems.map((item, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => openLightbox(item.src, item.alt)}
              >
                <CardContent className="p-0">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <p className="text-sm text-gray-600 text-center">{item.caption}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredGalleryItems.length === 0 && (
              <div className="col-span-full text-center text-gray-500 text-lg py-10">
                ไม่มีรูปภาพในหมวดหมู่นี้ 😢
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quiz Game Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-yellow-50 to-orange-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-800 mb-8 animate-fade-in">
            🎮 เกมทายใจจ 💖
          </h2>
          {!showQuizResults ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-orange-200">
              <CardContent className="p-8">
                <p className="text-lg text-gray-700 mb-4">
                  คำถามที่ {currentQuestionIndex + 1} จาก {quizQuestions.length}
                </p>
                <h3 className="text-2xl font-bold text-orange-700 mb-6">
                  {quizQuestions[currentQuestionIndex].question}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedQuizAnswer === option ? (option === quizQuestions[currentQuestionIndex].answer ? "default" : "destructive") : "outline"}
                      className={`w-full py-3 text-lg transition-all duration-300 ${selectedQuizAnswer !== null ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={selectedQuizAnswer !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                {quizFeedbackMessage && (
                  <p className={`mt-6 text-xl font-semibold ${selectedQuizAnswer === quizQuestions[currentQuestionIndex].answer ? 'text-green-600' : 'text-red-600'} animate-pulse`}>
                    {quizFeedbackMessage}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-orange-300">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-4">
                  ✨ ผลคะแนนของคุณ ✨
                </h3>
                <p className="text-4xl font-extrabold text-purple-600 mb-6">
                  {quizScore} / {quizQuestions.length}
                </p>
                {quizScore === quizQuestions.length ? (
                  <p className="text-xl text-green-700 font-semibold mb-6">
                    สุดยอดเลยย นี้แสดงว่ายังจำเรื่องราวได้อะสิ อิอิ 🎉💖
                  </p>
                ) : quizScore >= quizQuestions.length / 2 ? (
                  <p className="text-xl text-blue-700 font-semibold mb-6">
                    พอได้อยู่นะะ นี่เธออย่าลืมเรื่องราวของเราสิ์ 😊
                  </p>
                ) : (
                  <p className="text-xl text-red-700 font-semibold mb-6">
                    โกรธธธ เธอลืมไปหมดแล้วรึไงง งอมม 😢
                  </p>
                )}
                <Button onClick={resetQuiz} className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-full">
                  ลองเล่นอีกครั้ง!
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Memory Calendar Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-8 animate-fade-in">
            📅 ปฏิทินความทรงจำของพวกเรา 🌟
          </h2>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-blue-200 p-6 flex flex-col items-center">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md border shadow-md w-full max-w-md bg-white/70"
              modifiers={calendarModifiers}
              classNames={calendarClassNames}
            />
            <div className="mt-8 w-full">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">
                ✨ วันสำคัญน่าจดจำ ✨
              </h3>
              <div className="space-y-4">
                {memorableDates.map((event, index) => (
                  <Card key={index} className="bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-400 hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4 text-left">
                      <p className="text-sm text-gray-600">
                        {event.date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <h4 className="text-lg font-semibold text-blue-800 mt-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Cute Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-green-50 to-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8 animate-fade-in">
            📊 สถิติน่ารักของเรา 💖
          </h2>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-green-200 p-6 flex flex-col items-center">
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  {/* XAxis now uses 'category' from chartData for its tick, as it's a single entry */}
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="fill-muted-foreground"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  {/* Each Bar now represents a specific metric and pulls its color from chartConfig*/}
                  <Bar dataKey="daysKnown" fill="var(--color-daysKnown)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="smilesCaused" fill="var(--color-smilesCaused)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sweetMessages" fill="var(--color-sweetMessages)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="songsDedicated" fill="var(--color-songsDedicated)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="heartEmojis" fill="var(--color-heartEmojis)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-8 text-lg text-gray-700 space-y-2">
              <p>
                เราได้รู้จักกันมาแล้วกว่า <span className="font-bold text-green-600">{daysKnown}</span> วัน! 🎉
              </p>
              <p>
                เราได้รู้จักกันมาแล้วกว่า <span className="font-bold text-teal-600">{smilesCaused}</span> สัปดาห์! 😊
              </p>
              <p>
                เราได้รู้จักกันมาแล้วกว่า <span className="font-bold text-blue-600">{sweetMessages}</span> เดือน! 💌
              </p>
              <p>
                เราได้รู้จักกันมาแล้วกว่า <span className="font-bold text-purple-600">{songsDedicated}</span> ปี! 🎶
              </p>
              <p>
                และเรามอบหัวใจให้กันไปแล้ว <span className="font-bold text-pink-600">{heartEmojis}</span> ดวง! (รักนะ 3000 ไง ถ้าไม่รู้จักลองเสริชดู อิอิ)💖
              </p>
            </div>
          </Card>
        </div>
      </section>


      {/* New Adorable Sections */}
      
      {/* น้องนางของพี่ Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-rose-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-pink-800 mb-8 animate-fade-in">
            💖 เธอคือคนที่น่ารักที่สุด 💖
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">😊</div>
                <h3 className="text-xl font-bold text-pink-700 mb-3">รอยยิ้มสดใส</h3>
                <p className="text-gray-600">
                  เวลาเธอยิ้ม จะทำให้เรารู้สึกมีความสุขไปด้วยเสมอเลย
                  ไม่ว่าจะเหนื่อยแค่ไหน แต่พอเห็นเธอยิ้ม เราก็มีแรงขึ้นมาเลยยย อิอิ
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🎈</div>
                <h3 className="text-xl font-bold text-pink-700 mb-3">ความสดใสวัยใส</h3>
                <p className="text-gray-600">
                  เธอคือกำลังใจของเราในทุกๆวันเลย รู้สึกว่าถ้าเธอมีความสุขเราก็ยินดีด้วย
                  เราอยากให้เธอไม่เจ็บ ไม่ไข้ ไม่ทุกข์ และสดใสแบบนี้ไปตลอด
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ความทรงจำดีๆ Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-purple-800 mb-12 animate-fade-in">
            🌟 ไทม์ไลน์ความทรงจำดีๆ 📅
          </h2>
          <div className="space-y-8">
            {[
              { emoji: "🧑‍❤️‍👩", title: "งานชักพระ", desc: "เราไปดูเธอเดินขบวนทุกปีเลย โคตรมีความสุขอะ เราภูมิใจมากเลยนะ เวลาเห็นเธอเดิน แถมเรายังได้เดินงานกัน 2 คนด้วยเธอจำได้ไหม คิดถึงจังเลยเนอะ" },
              { emoji: "🚲", title: "เกาะลำพู", desc: "ปั่นจักรยานด้วยกัน ชมวิวว สนุกมากเลยเนอะ" },
              { emoji: "📞", title: "วิดิโอคอลกัน", desc: "เปิดกล้องคุยกัน ได้ยินเสียงกัน เห็นหน้าเธอก็มีความสุขแล้วเนอะ" },
              { emoji: "🎇", title: "งานกาชาด", desc: "เราไปกันทุกปีเลย ซื้อของกินด้วยกันทำอะไรด้วยกัน มีความสุขมากเลย คิดถึงโมโม้นท์อะไรแบบนี้เนอะ" },
              { emoji: "🎢", title: "เล่นสวนสนุกด้วยกัน", desc: "เราได้เล่นเครื่องเล่นกัน แทบอ้วกแหนะ แต่เราก็เล่นกันเกือบครบนะ สนุกมากเลย เสียดายปีนี้ที่เราไม่ได้ไปด้วยกันคิดถึงเนอะ" },
              { emoji: "🍽️", title: "เที่ยวสหไทยด้วยกัน", desc: "ดูหนัง เดินซื้อของกิน เล่นโซนของเล่น ร้องเพลงคาราโอเกะ เป็นช่วงเวลาที่ดีเนอะ" },
              { emoji: "👀", title: "เวลาคุยกัน", desc: "เวลาคุยกันจะเขินมากๆ ไม่ค่อยกล้าสบตา เราจะชอบมองหน้าเธอค้างไว้ ละคิดในใจว่าทำไมเธอน่ารักขนาดนี้ ไม่อยากเสียเธอไปเลย เราคิดแบบนี้ตลอดเลย เธอจะสงสัยตลอดว่าจะจ้องหน้าเธอทำไม แต่เราก็ไม่เคยบอกเหตุผลเธอเลย แบร่ อิอิ" },
              { emoji: "🤝", title: "จับมือกัน", desc: "เรารู้สึกดีเสมอเลยตอนที่ได้จับมือเธอ เหมือนได้อยู่ข้างๆเธอตลอดด" }
            ].map((memory, index) => (
              <Card key={index} className="bg-gradient-to-r from-white to-pink-50 border-l-4 border-pink-400 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{memory.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-700">{memory.title}</h3>
                      <p className="text-gray-600 mt-1">{memory.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* คำอวยพรสุดท้าย */}
      <section className="py-16 px-4 bg-gradient-to-br from-pink-200 via-purple-200 to-rose-200">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-300 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-6xl mb-6">🌸</div>
              <h2 className="text-3xl font-bold text-purple-800 mb-6">
                ขอให้เธอมีความสุขตลอดไป
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                ไม่ว่าจะวันเวลาจะผ่านไปนานแค่ไหน เธอก็ยังเป็นคนโปรดในใจเราเสมอ
                ขอให้เธอมีแต่รอยยิ้ม ความสุข และสิ่งดีๆ เข้ามาในชีวิตเสมอนะะ 💖
              </p>
              <div className="flex justify-center space-x-2 text-3xl">
                <Heart className="text-pink-500 animate-pulse" />
                <Star className="text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                <Sparkles className="text-purple-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-lg mb-4">
            ขอให้น้องนางมีความสุขในทุกๆ วัน 💖
          </p>
          <div className="flex justify-center space-x-4 text-2xl">
            <Heart className="animate-pulse" />
            <Star className="animate-spin" style={{ animationDuration: '3s' }} />
            <Heart className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-sm mt-4 opacity-75">
            จากใจพี่องศาที่รักน้องนางเสมอ ✨
          </p>
        </div>
      </footer>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogOverlay />
        <DialogContent className="max-w-3xl p-4">
          <img src={lightboxImageSrc} alt={lightboxImageAlt} className="w-full h-auto rounded-lg max-h-[80vh] object-contain" />
          <p className="text-center text-sm text-gray-600 mt-2">{lightboxImageAlt}</p>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;