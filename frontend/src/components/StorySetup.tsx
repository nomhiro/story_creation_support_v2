import React, { useState } from 'react';
import type { Story } from '../types/story';

interface StorySetupProps {
  initialStory?: Story | null;
  onComplete: (story: Story) => void;
}

export default function StorySetup({ initialStory, onComplete }: StorySetupProps) {
  const [storyDetails, setStoryDetails] = useState<Omit<Story, 'id'>>({
    title: initialStory?.title || '',
    era: initialStory?.era || '',
    country: initialStory?.country || '',
    summary: initialStory?.summary || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const story: Story = {
      id: initialStory?.id || Date.now().toString(),
      ...storyDetails
    };

    // Save to localStorage
    const savedStories = localStorage.getItem('stories');
    const stories = savedStories ? JSON.parse(savedStories) : [];
    
    if (initialStory) {
      // Update existing story
      const index = stories.findIndex((s: Story) => s.id === initialStory.id);
      if (index !== -1) {
        stories[index] = story;
      }
    } else {
      // Add new story
      stories.push(story);
    }
    
    localStorage.setItem('stories', JSON.stringify(stories));
    onComplete(story);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {initialStory ? '物語の編集' : '新規物語の作成'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={storyDetails.title}
            onChange={(e) => setStoryDetails({ ...storyDetails, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="era" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            時代設定
          </label>
          <input
            type="text"
            id="era"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={storyDetails.era}
            onChange={(e) => setStoryDetails({ ...storyDetails, era: e.target.value })}
            placeholder="例：現代、江戸時代、近未来"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            国・地域
          </label>
          <input
            type="text"
            id="country"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={storyDetails.country}
            onChange={(e) => setStoryDetails({ ...storyDetails, country: e.target.value })}
            placeholder="例：日本、アメリカ、架空世界"
            required
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            物語の概要
          </label>
          <textarea
            id="summary"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={storyDetails.summary}
            onChange={(e) => setStoryDetails({ ...storyDetails, summary: e.target.value })}
            placeholder="物語の主なテーマや展開について記述してください"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {initialStory ? '更新' : '作成'}
          </button>
        </div>
      </form>
    </div>
  );
}