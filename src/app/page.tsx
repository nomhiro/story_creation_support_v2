"use client";

import React, { useState } from 'react';
import { Book, Users, Calendar, PenTool, Plus } from 'lucide-react';
import StorySetup from '../components/StorySetup';
import CharacterList from '../components/CharacterList';
import EventList from '../components/EventList';
import StoryWriter from '../components/StoryWriter';
import StoryList from '../components/StoryList';
import { Story } from '../types/story';

type Tab = 'story' | 'characters' | 'events' | 'writer';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('story');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const handleDeleteStory = () => {
    if (selectedStory) {
      const confirmed = window.confirm('本当にこの物語を削除しますか？');
      if (confirmed) {
        // ローカルストレージから削除
        const savedStories = localStorage.getItem('stories');
        const allStories = savedStories ? JSON.parse(savedStories) : [];
        const updatedStories = allStories.filter((story: Story) => story.id !== selectedStory.id);
        localStorage.setItem('stories', JSON.stringify(updatedStories));
        setSelectedStory(null);
      }
    }
  };

  if (!selectedStory && !isCreatingStory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-indigo-600 text-white py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">創作支援システム</h1>
            <p className="mt-2 text-indigo-200">あなたの物語作りをサポートします</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">物語一覧</h2>
            <button
              onClick={() => setIsCreatingStory(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              新規物語
            </button>
          </div>
          <StoryList onSelectStory={setSelectedStory} />
        </main>
      </div>
    );
  }

  if (isCreatingStory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-indigo-600 text-white py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">創作支援システム</h1>
            <p className="mt-2 text-indigo-200">あなたの物語作りをサポートします</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setIsCreatingStory(false)}
            className="mb-6 text-indigo-600 hover:text-indigo-800"
          >
            ← 物語一覧に戻る
          </button>
          <StorySetup
            onComplete={(story) => {
              setSelectedStory(story);
              setIsCreatingStory(false);
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-indigo-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{selectedStory?.title}</h1>
              <p className="mt-2 text-indigo-200">
                {selectedStory?.era} · {selectedStory?.country}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedStory(null)}
                className="text-white hover:text-indigo-200"
              >
                物語一覧に戻る
              </button>
              <button
                onClick={handleDeleteStory}
                className="text-red-600 hover:text-red-800"
              >
                物語を削除
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('story')}
              className={`flex items-center px-3 py-4 text-sm font-medium ${
                activeTab === 'story'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Book className="w-5 h-5 mr-2" />
              物語設定
            </button>
            <button
              onClick={() => setActiveTab('characters')}
              className={`flex items-center px-3 py-4 text-sm font-medium ${
                activeTab === 'characters'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              登場人物
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center px-3 py-4 text-sm font-medium ${
                activeTab === 'events'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              イベント
            </button>
            <button
              onClick={() => setActiveTab('writer')}
              className={`flex items-center px-3 py-4 text-sm font-medium ${
                activeTab === 'writer'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <PenTool className="w-5 h-5 mr-2" />
              執筆
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'story' && (
          <StorySetup
            initialStory={selectedStory}
            onComplete={setSelectedStory}
          />
        )}
        {activeTab === 'characters' && selectedStory && (
          <CharacterList storyId={selectedStory.id} />
        )}
        {activeTab === 'events' && selectedStory && <EventList storyId={selectedStory.id} />}
        {activeTab === 'writer' && selectedStory && <StoryWriter storyId={selectedStory.id} />}
      </main>
    </div>
  );
}

export default App;