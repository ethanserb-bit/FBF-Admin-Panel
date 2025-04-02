// src/pages/community/Quizzes.tsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, BarChart2, X } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
    points: number;
  }[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  totalTaken: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  questions: Question[];
}

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'Are You Dating an F Boy?',
      description: '5 min quiz • 10k+ taken today',
      totalTaken: 10000,
      status: 'active',
      createdAt: new Date(),
      questions: []
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState<Omit<Quiz, 'id' | 'totalTaken' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'draft',
    questions: []
  });

  const handleOpenModal = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({
        title: quiz.title,
        description: quiz.description,
        status: quiz.status,
        questions: quiz.questions
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        status: 'draft',
        questions: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now().toString(),
          text: '',
          options: [
            { text: '', isCorrect: true, points: 0 },
            { text: '', isCorrect: false, points: 0 },
            { text: '', isCorrect: false, points: 0 },
            { text: '', isCorrect: false, points: 0 }
          ]
        }
      ]
    }));
  };

  const handleQuestionChange = (questionId: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, text } : q
      )
    }));
  };

  const handleOptionChange = (questionId: string, optionIndex: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, text } : opt
              )
            }
          : q
      )
    }));
  };

  const handleCorrectAnswerChange = (questionId: string, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => ({
                ...opt,
                isCorrect: idx === optionIndex
              }))
            }
          : q
      )
    }));
  };

  const handlePointsChange = (questionId: string, optionIndex: number, points: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, points } : opt
              )
            }
          : q
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingQuiz) {
      setQuizzes(prev =>
        prev.map(quiz =>
          quiz.id === editingQuiz.id
            ? { ...quiz, ...formData }
            : quiz
        )
      );
    } else {
      const newQuiz: Quiz = {
        ...formData,
        id: Date.now().toString(),
        totalTaken: 0,
        createdAt: new Date()
      };
      setQuizzes(prev => [...prev, newQuiz]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Active Quizzes</h2>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Quiz Title</th>
                <th className="pb-4">Total Taken</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Created</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-t">
                  <td className="py-4">
                    <div>
                      <h3 className="font-medium">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">{quiz.description}</p>
                    </div>
                  </td>
                  <td className="py-4">{quiz.totalTaken.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {quiz.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500">
                    {quiz.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(quiz)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <BarChart2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Quiz['status'] }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      Questions
                    </label>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-purple-600 text-sm font-medium hover:text-purple-700"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.questions.map((question, qIndex) => (
                      <div key={question.id} className="p-4 border rounded">
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                          placeholder={`Question ${qIndex + 1}`}
                          className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />

                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={option.isCorrect}
                                onChange={() => handleCorrectAnswerChange(question.id, oIndex)}
                                className="text-purple-600 focus:ring-purple-500"
                              />
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(question.id, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                              />
                              <input
                                type="number"
                                value={option.points}
                                onChange={(e) => handlePointsChange(question.id, oIndex, parseInt(e.target.value) || 0)}
                                placeholder="Points"
                                className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                min="0"
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {editingQuiz ? 'Save Changes' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quizzes;