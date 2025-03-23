import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Maximize2, Minimize2 } from 'lucide-react';

import type { Chapter } from '../types/chapter';
import type { Event } from '../types/event';

interface StoryWriterProps {
  storyId: string;
}

export default function StoryWriter({ storyId }: StoryWriterProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapter, setNewChapter] = useState<Omit<Chapter, 'id'>>({
    storyId: storyId,
    title: '',
    events: [],
    content: ''
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isEditingMode, setIsEditingMode] = useState<string | null>(null);

  useEffect(() => {
    // Load chapters from localStorage
    const savedChapters = localStorage.getItem('chapters');
    if (savedChapters) {
      const allChapters = JSON.parse(savedChapters);
      setChapters(allChapters.filter((c: Chapter) => c.storyId === storyId));
    }
  }, [storyId]);

  useEffect(() => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      const allEvents = JSON.parse(savedEvents);
      setEvents(allEvents.filter((e: Event) => e.storyId === storyId));
    }
  }, [storyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chapter: Chapter = {
      id: isEditing || Date.now().toString(),
      ...newChapter
    };

    // Save to localStorage
    const savedChapters = localStorage.getItem('chapters');
    const allChapters = savedChapters ? JSON.parse(savedChapters) : [];
    if (isEditing) {
      const index = allChapters.findIndex((c: Chapter) => c.id === isEditing);
      allChapters[index] = chapter;
    } else {
      allChapters.push(chapter);
    }
    localStorage.setItem('chapters', JSON.stringify(allChapters));

    setChapters(allChapters.filter((c: Chapter) => c.storyId === storyId));
    setIsAddingChapter(false);
    setIsEditing(null);
    setNewChapter({
      storyId: storyId,
      title: '',
      events: [],
      content: ''
    });
  };

  const handleDeleteChapter = (id: string) => {
    const updatedChapters = chapters.filter(chapter => chapter.id !== id);
    setChapters(updatedChapters);
    localStorage.setItem('chapters', JSON.stringify(updatedChapters));
  };

  const handleEventChange = (index: number, value: string) => {
    const updatedEvents = [...newChapter.events];
    updatedEvents[index] = value;
    setNewChapter({ ...newChapter, events: updatedEvents });
  };

  const addEvent = () => {
    setNewChapter({ ...newChapter, events: [...newChapter.events, ''] });
  };

  const removeEvent = (index: number) => {
    const updatedEvents = newChapter.events.filter((_, i) => i !== index);
    setNewChapter({ ...newChapter, events: updatedEvents });
  };

  const handleEdit = (chapter: Chapter) => {
    setIsAddingChapter(true);
    setNewChapter({
      storyId: chapter.storyId,
      title: chapter.title,
      events: chapter.events,
      content: chapter.content
    });
    setIsEditing(chapter.id);
  };

  const handleContentChange = (chapterId: string, content: string) => {
    const updatedChapters = chapters.map(c =>
      c.id === chapterId ? { ...c, content } : c
    );
    setChapters(updatedChapters);
    localStorage.setItem('chapters', JSON.stringify(updatedChapters));
  };

  const toggleEditingMode = (chapterId: string | null) => {
    setIsEditingMode(prev => (prev === chapterId ? null : chapterId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">物語を書く</h2>
        <button
          onClick={() => setIsAddingChapter(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          新規章
        </button>
      </div>

      {isAddingChapter && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {isEditing ? '章を編集' : '新規章の追加'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">章タイトル</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">関連イベント</label>
              {newChapter.events.map((event, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={event}
                    onChange={(e) => handleEventChange(index, e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeEvent(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEvent}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                追加
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingChapter(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                {isEditing ? '更新' : '追加'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {chapters.map((chapter) => (
          <div key={chapter.id} className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${isEditingMode === chapter.id ? 'fixed inset-0 z-50' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{chapter.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(chapter)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleEditingMode(chapter.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {isEditingMode === chapter.id ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">関連イベント</p>
                <p className="mt-1">{chapter.events.map(eventId => {
                  const event = events.find(e => e.id === eventId);
                  return event ? event.title : '不明なイベント';
                }).join(', ')}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">章の内容</p>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  rows={isEditingMode === chapter.id ? 20 : 8}
                  value={chapter.content}
                  onChange={(e) => handleContentChange(chapter.id, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}