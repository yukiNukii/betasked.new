import React, { useState } from 'react';
import { Play, CheckCircle, Share2, Upload, ArrowRight, MessageCircle, Brain, HelpCircle, Zap, X, Send, Globe, ThumbsUp, ThumbsDown, ArrowLeft, Mic, Edit3, Briefcase, Mail, FileText, PenTool, Users, Coffee, Target } from 'lucide-react';
import { useTask } from '../contexts/TaskContext';
import { Link } from 'react-router-dom';

interface Mission {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  difficulty: string;
  points: number;
  category: 'mission' | 'chat';
  hints?: string[];
}

interface SuggestedResponse {
  text: string;
  translation?: string;
}

const TaskArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'normal' | 'hospitality'>('normal');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showCompletionScreen, setShowCompletionScreen] = useState<boolean>(false);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [completedConversations, setCompletedConversations] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isJapanese, setIsJapanese] = useState<boolean>(true);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([
    { 
      text: "商談後のお礼メールを作成してください。",
      translation: "先方の立場に立った丁寧な文面を心がけましょう。"
    },
    { 
      text: "週次進捗レポートを作成してください。",
      translation: "簡潔で分かりやすい報告を心がけましょう。"
    }
  ]);

  const normalMissions: Mission[] = [
    {
      id: 1,
      title: "商談後のお礼メール作成",
      description: "AIと一緒に、商談後の丁寧なお礼メールを作成します。",
      image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e",
      icon: <Mail className="w-6 h-6" />,
      difficulty: "初級",
      points: 30,
      category: 'mission',
      hints: [
        "先方の立場に立った表現を心がけましょう",
        "具体的な商談内容に触れると良いでしょう",
        "次回のアクションを含めると効果的です"
      ]
    },
    {
      id: 2,
      title: "週次進捗レポート作成",
      description: "AIを活用して、効率的な週次進捗レポートを作成します。",
      image: "https://images.unsplash.com/photo-1664575602554-2087b04935a5",
      icon: <FileText className="w-6 h-6" />,
      difficulty: "中級",
      points: 50,
      category: 'mission'
    },
    {
      id: 3,
      title: "プレゼン資料のブラッシュアップ",
      description: "AIと協力して、プレゼン資料をより説得力のあるものに改善します。",
      image: "https://images.unsplash.com/photo-1633613286991-611fe299c4be",
      icon: <PenTool className="w-6 h-6" />,
      difficulty: "上級",
      points: 70,
      category: 'mission'
    },
    {
      id: 4,
      title: "チーム会議の議事録作成",
      description: "AIを使って、効率的に会議の議事録を作成します。",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
      icon: <Users className="w-6 h-6" />,
      difficulty: "中級",
      points: 50,
      category: 'mission'
    }
  ];

  const hospitalityMissions: Mission[] = [
    {
      id: 5,
      title: "初心者向けミッション作成",
      description: "AIを使い始めたばかりの方向けのミッションを作成します。",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      icon: <Target className="w-6 h-6" />,
      difficulty: "中級",
      points: 60,
      category: 'chat'
    }
  ];

  const openMissionDetail = (mission: Mission) => {
    setSelectedMission(mission);
    setShowCompletionScreen(false);
    setChatMessages([
      { 
        text: mission.category === 'chat' 
          ? "初心者向けのミッションを作成するために、どのようなタスクを考えていますか？" 
          : `このミッションでは「${mission.title}」に取り組みます。準備はよろしいですか？`, 
        sender: 'bot' 
      }
    ]);
    setShowHints(false);
  };

  const closeMissionDetail = () => {
    setSelectedMission(null);
    setChatMessages([]);
    setUserInput('');
    setShowHints(false);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setChatMessages([...chatMessages, { text: userInput, sender: 'user' }]);
      setTimeout(() => {
        if (selectedMission?.category === 'chat') {
          setChatMessages(prev => [...prev, { 
            text: "提案されたミッションを分析しています。初心者の方により適した難易度に調整するアドバイスを提供します。", 
            sender: 'bot' 
          }]);
        } else {
          setChatMessages(prev => [...prev, { 
            text: "タスクの実行をサポートします。一緒に最適な内容を考えていきましょう。", 
            sender: 'bot' 
          }]);
        }
      }, 1000);
      setUserInput('');
    }
  };

  const completeMission = () => {
    if (selectedMission) {
      setEarnedPoints(selectedMission.points);
      setCompletedConversations(prev => prev + 1);
      setShowCompletionScreen(true);
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const useSuggestedResponse = (response: string) => {
    setUserInput(response);
  };

  const CompletionScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-lg w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">
            ミッション完了！
          </h2>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-300">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">完了したミッション数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 mt-2">
              {completedConversations}
            </div>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-300">
              <Zap className="w-5 h-5" />
              <span className="font-medium">獲得ポイント</span>
            </div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-300 mt-2">
              {earnedPoints}ポイント
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowCompletionScreen(false)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              続ける
            </button>
            <button
              onClick={() => {
                setShowCompletionScreen(false);
                if (selectedMission) {
                  openMissionDetail(selectedMission);
                }
              }}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-400 rounded-lg shadow transition duration-300"
            >
              このミッションをやり直す
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedMission) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={closeMissionDetail}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ホームに戻る
          </button>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48">
            <img
              src={selectedMission.image}
              alt={selectedMission.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                {selectedMission.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{selectedMission.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedMission.category === 'chat' ? 'ミッション作成' : 'ビジネスタスク'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">目的:</h2>
              <p className="text-gray-700 dark:text-gray-300">{selectedMission.description}</p>
            </div>

            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    {message.text}
                    {message.sender === 'bot' && (
                      <div className="flex items-center mt-2 space-x-2">
                        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                          翻訳
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={selectedMission.category === 'chat' 
                    ? "作成したいミッションの内容を入力してください" 
                    : "メッセージを入力してください"}
                  className="flex-1 bg-transparent border-none focus:outline-none px-2"
                />
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleHints}
                    className={`p-2 ${showHints ? 'text-primary' : 'text-gray-500'} hover:text-gray-700 dark:hover:text-gray-300`}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showHints && (
                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 animate-fade-in">
                  <h3 className="font-semibold mb-2">アシスタントからのアドバイス:</h3>
                  <div className="space-y-2">
                    {suggestedResponses.map((response, index) => (
                      <button
                        key={index}
                        onClick={() => useSuggestedResponse(response.text)}
                        className="w-full text-left p-2 hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded transition-colors duration-200"
                      >
                        <p className="font-medium">{response.text}</p>
                        {response.translation && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{response.translation}</p>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedMission.hints && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">ヒント:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedMission.hints.map((hint, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setActiveTab('normal')}
          className={`flex-1 py-3 px-4 text-center rounded-l-lg transition duration-300 ease-in-out ${
            activeTab === 'normal'
              ? 'bg-primary text-white'
              : 'bg-background-light text-text hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          ビジネスミッション
        </button>
        <button
          onClick={() => setActiveTab('hospitality')}
          className={`flex-1 py-3 px-4 text-center rounded-r-lg transition duration-300 ease-in-out ${
            activeTab === 'hospitality'
              ? 'bg-primary text-white'
              : 'bg-background-light text-text hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          接待ミッション作成
        </button>
      </div>

      {activeTab === 'hospitality' ? (
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">接待ミッション作成</h2>
            <p className="text-gray-600 dark:text-gray-400">
              AIを使い始めたばかりの方向けのミッションを作成します。
              経験者の皆さんのサポートで、より多くの方がAIを活用できるようになります。
            </p>
          </div>
          {hospitalityMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {mission.icon}
                  <h3 className="text-xl font-semibold ml-3">{mission.title}</h3>
                </div>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {mission.points}ポイント
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{mission.description}</p>
              <button
                onClick={() => openMissionDetail(mission)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
              >
                ミッションを作成
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {normalMissions.map((mission) => (
            <div 
              key={mission.id} 
              className="bg-card-light dark:bg-card-dark shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="relative">
                <img 
                  src={mission.image} 
                  alt={mission.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm">
                  {mission.category === 'mission' ? 'ミッション' : 'チャット'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold line-clamp-1">{mission.title}</h3>
                  {mission.icon}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {mission.description}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                    {mission.difficulty}
                  </span>
                  <button
                    onClick={() => openMissionDetail(mission)}
                    className="bg-secondary text-white px-4 py-2 rounded text-sm transition duration-300 ease-in-out hover:bg-secondary-dark"
                  >
                    開始
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCompletionScreen && <CompletionScreen />}
    </div>
  );
};

export default TaskArena;