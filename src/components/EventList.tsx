import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';

import { Event } from '../types/event';
import { Character } from '../types/character';

interface EventListProps {
  storyId: string;
}

export default function EventList({ storyId }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'storyId'>>({
    title: '',
    date: '',
    location: '',
    participants: [],
    description: ''
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    // Load characters from localStorage
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      const allCharacters = JSON.parse(savedCharacters);
      setCharacters(allCharacters.filter((c: Character) => c.storyId === storyId));
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
    const event: Event = {
      id: isEditing || Date.now().toString(),
      ...newEvent,
      storyId
    };

    // Save to localStorage
    const savedEvents = localStorage.getItem('events');
    const allEvents = savedEvents ? JSON.parse(savedEvents) : [];
    if (isEditing) {
      const index = allEvents.findIndex((e: Event) => e.id === isEditing);
      allEvents[index] = event;
    } else {
      allEvents.push(event);
    }
    localStorage.setItem('events', JSON.stringify(allEvents));

    setEvents(allEvents.filter((e: Event) => e.storyId === storyId));
    setIsAdding(false);
    setIsEditing(null);
    setNewEvent({
      title: '',
      date: '',
      location: '',
      participants: [],
      description: ''
    });
  };

  const handleParticipantChange = (index: number, value: string) => {
    const updatedParticipants = [...newEvent.participants];
    updatedParticipants[index] = value;
    setNewEvent({ ...newEvent, participants: updatedParticipants });
  };

  const addParticipant = () => {
    setNewEvent({ ...newEvent, participants: [...newEvent.participants, ''] });
  };

  const removeParticipant = (index: number) => {
    const updatedParticipants = newEvent.participants.filter((_, i) => i !== index);
    setNewEvent({ ...newEvent, participants: updatedParticipants });
  };

  const handleEdit = (event: Event) => {
    setIsEditing(event.id);
    setNewEvent({
      title: event.title,
      date: event.date,
      location: event.location,
      participants: event.participants,
      description: event.description
    });
    setIsAdding(true);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">イベント一覧</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          新規イベント
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">新規イベント登録</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">イベントタイトル</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">日時</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  placeholder="例：2024年春"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">場所</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">関係者</label>
              {newEvent.participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={participant}
                    onChange={(e) => handleParticipantChange(index, e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {characters.map(character => (
                      <option key={character.id} value={character.id}>
                        {character.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addParticipant}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                追加
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">イベント内容</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">{event.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">日時</p>
                <p className="mt-1">{event.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">場所</p>
                <p className="mt-1">{event.location}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-300">関係者</p>
              <p className="mt-1">
                {event.participants.map(participantId => {
                  const participant = characters.find(c => c.id === participantId);
                  return participant ? participant.name : '不明な関係者';
                }).join(', ')}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-300">イベント内容</p>
              <p className="mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}