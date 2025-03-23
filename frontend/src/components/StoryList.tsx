import React, { useState, useEffect } from 'react';
import type { Story } from '../types/story';

interface StoryListProps {
  onSelectStory: (story: Story) => void;
}

export default function StoryList({ onSelectStory }: StoryListProps) {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    // Load stories from localStorage
    const savedStories = localStorage.getItem('stories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    }
  }, []);

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">物語がまだ登録されていません。</p>
        <p className="text-gray-500 dark:text-gray-400">「新規物語」ボタンから作成を始めましょう。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <div
          key={story.id}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => onSelectStory(story)}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
              {story.title}
            </h3>
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
              <span className="truncate">
                {story.era} · {story.country}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 line-clamp-3">
              {story.summary}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}