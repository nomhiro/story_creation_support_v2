import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Trash2 } from 'lucide-react';

import { Character } from '../types/character';

interface CharacterListProps {
  storyId: string;
}

const GENDER_OPTIONS = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' }
];

export default function CharacterList({ storyId }: CharacterListProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id' | 'storyId'>>({
    name: '',
    gender: '',
    age: 20,
    origin: '',
    education: '',
    career: '',
    personality: '',
    relationships: []
  });
  const [newRelationship, setNewRelationship] = useState({
    characterId: '',
    type: ''
  });

  useEffect(() => {
    // Load characters from localStorage
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      const allCharacters = JSON.parse(savedCharacters);
      setCharacters(allCharacters.filter((c: Character) => c.storyId === storyId));
    }
  }, [storyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const character: Character = {
      id: isEditing || Date.now().toString(),
      storyId,
      ...newCharacter
    };

    // Save to localStorage
    const savedCharacters = localStorage.getItem('characters');
    const allCharacters = savedCharacters ? JSON.parse(savedCharacters) : [];
    if (isEditing) {
      const index = allCharacters.findIndex((c: Character) => c.id === isEditing);
      allCharacters[index] = character;
    } else {
      allCharacters.push(character);
    }
    localStorage.setItem('characters', JSON.stringify(allCharacters));

    setCharacters(allCharacters.filter((c: Character) => c.storyId === storyId));
    setIsAdding(false);
    setIsEditing(null);
    setNewCharacter({
      name: '',
      gender: '',
      age: 20,
      origin: '',
      education: '',
      career: '',
      personality: '',
      relationships: []
    });
  };

  const addRelationship = () => {
    if (!newRelationship.characterId || !newRelationship.type) return;

    setNewCharacter({
      ...newCharacter,
      relationships: [...newCharacter.relationships, newRelationship]
    });

    setNewRelationship({
      characterId: '',
      type: ''
    });
  };

  const removeRelationship = (index: number) => {
    setNewCharacter({
      ...newCharacter,
      relationships: newCharacter.relationships.filter((_, i) => i !== index)
    });
  };

  const getCharacterName = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    return character ? character.name : '';
  };

  const handleEdit = (character: Character) => {
    setIsEditing(character.id);
    setNewCharacter({
      name: character.name,
      gender: character.gender,
      age: character.age,
      origin: character.origin,
      education: character.education,
      career: character.career,
      personality: character.personality,
      relationships: character.relationships
    });
    setIsAdding(true);
  };

  const handleDeleteCharacter = (id: string) => {
    const updatedCharacters = characters.filter(character => character.id !== id);
    setCharacters(updatedCharacters);
    localStorage.setItem('characters', JSON.stringify(updatedCharacters));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">登場人物一覧</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          新規登録
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {isEditing ? 'キャラクター編集' : '新規キャラクター登録'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">名前</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">性別</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newCharacter.gender}
                  onChange={(e) => setNewCharacter({ ...newCharacter, gender: e.target.value })}
                  required
                >
                  <option value="">選択してください</option>
                  {GENDER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">年齢</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newCharacter.age}
                  onChange={(e) => setNewCharacter({ ...newCharacter, age: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">出身</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newCharacter.origin}
                  onChange={(e) => setNewCharacter({ ...newCharacter, origin: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">学歴</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={2}
                value={newCharacter.education}
                onChange={(e) => setNewCharacter({ ...newCharacter, education: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">職歴</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={2}
                value={newCharacter.career}
                onChange={(e) => setNewCharacter({ ...newCharacter, career: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">性格</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={2}
                value={newCharacter.personality}
                onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">対人関係</label>
              <div className="space-y-2">
                {newCharacter.relationships.map((rel, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span>{getCharacterName(rel.characterId)}</span>
                    <span>との関係：{rel.type}</span>
                    <button
                      type="button"
                      onClick={() => removeRelationship(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex space-x-2">
                <select
                  className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newRelationship.characterId}
                  onChange={(e) => setNewRelationship({ ...newRelationship, characterId: e.target.value })}
                >
                  <option value="">キャラクターを選択</option>
                  {characters.map(character => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="関係性（例：親友、恋敵）"
                  className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newRelationship.type}
                  onChange={(e) => setNewRelationship({ ...newRelationship, type: e.target.value })}
                />
                <button
                  type="button"
                  onClick={addRelationship}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  追加
                </button>
              </div>
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
                {isEditing ? '更新' : '登録'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {characters.map((character) => (
          <div key={character.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">{character.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(character)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteCharacter(character.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">性別</p>
                <p className="mt-1">
                  {GENDER_OPTIONS.find(opt => opt.value === character.gender)?.label || character.gender}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">年齢</p>
                <p className="mt-1">{character.age}歳</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">出身</p>
                <p className="mt-1">{character.origin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">学歴</p>
                <p className="mt-1">{character.education}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-300">職歴</p>
              <p className="mt-1">{character.career}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-300">性格</p>
              <p className="mt-1">{character.personality}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-300">対人関係</p>
              <div className="mt-1 space-y-1">
                {character.relationships.map((rel, index) => (
                  <p key={index}>
                    {getCharacterName(rel.characterId)}との関係：{rel.type}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}