import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  HelpCircle,
  ShieldCheck,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { examService } from '../../services/examService';
import type { Exam, Question } from '../../types';

export const CreateExamPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingScore, setPassingScore] = useState(15);
  const [enableSnapshots, setEnableSnapshots] = useState(true);
  const [showResultsImmediately, setShowResultsImmediately] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-init-1',
      questionText: 'What browser API is used to detect when an exam tab loses focus or is minimized?',
      options: [
        'Page Visibility API (document.visibilityState)',
        'Battery Status API',
        'Web Bluetooth API',
        'Canvas Rendering Context'
      ],
      correctOptionIndex: 0,
      marks: 10
    },
    {
      id: 'q-init-2',
      questionText: 'Why is client-side WebAssembly face detection more privacy-friendly than traditional proctoring services?',
      options: [
        'It saves 90% cloud bandwidth and never streams raw webcam video to remote servers',
        'It disables student webcams permanently',
        'It records student microphone audio continuously',
        'It requires no user consent'
      ],
      correctOptionIndex: 0,
      marks: 10
    }
  ]);

  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add question
  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      questionText: '',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctOptionIndex: 0,
      marks: 10
    };
    setQuestions([...questions, newQ]);
  };

  // Remove question
  const handleRemoveQuestion = (qId: string) => {
    if (questions.length <= 1) {
      alert('An exam must have at least one question.');
      return;
    }
    setQuestions(questions.filter(q => q.id !== qId));
  };

  // Update question text
  const handleQuestionTextChange = (qId: string, text: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, questionText: text } : q));
  };

  // Add option to question
  const handleAddOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        if (q.options.length >= 6) {
          alert('Maximum 6 options allowed per question.');
          return q;
        }
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  // Remove option from question
  const handleRemoveOption = (qId: string, optIdx: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        if (q.options.length <= 2) {
          alert('A question must have at least 2 options.');
          return q;
        }
        const updatedOptions = q.options.filter((_, idx) => idx !== optIdx);
        let updatedCorrect = q.correctOptionIndex;
        if (updatedCorrect >= updatedOptions.length) {
          updatedCorrect = updatedOptions.length - 1;
        }
        return { ...q, options: updatedOptions, correctOptionIndex: updatedCorrect };
      }
      return q;
    }));
  };

  // Update option text
  const handleOptionTextChange = (qId: string, optIdx: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const updatedOptions = [...q.options];
        updatedOptions[optIdx] = text;
        return { ...q, options: updatedOptions };
      }
      return q;
    }));
  };

  // Set correct option
  const handleSetCorrectOption = (qId: string, optIdx: number) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, correctOptionIndex: optIdx } : q));
  };

  // Form submission & validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!title.trim()) validationErrors.push('Exam Title is required.');
    if (!description.trim()) validationErrors.push('Exam Description is required.');
    if (durationMinutes < 1) validationErrors.push('Duration must be at least 1 minute.');
    if (questions.length === 0) validationErrors.push('Please add at least one question.');

    questions.forEach((q, idx) => {
      if (!q.questionText.trim()) {
        validationErrors.push(`Question #${idx + 1} is missing question text.`);
      }
      q.options.forEach((opt, optIdx) => {
        if (!opt.trim()) {
          validationErrors.push(`Question #${idx + 1}, Option #${optIdx + 1} cannot be empty.`);
        }
      });
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors([]);

    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 10), 0);

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      durationMinutes: Number(durationMinutes),
      totalMarks,
      passingScore: Number(passingScore),
      questions,
      createdAt: new Date().toISOString(),
      createdBy: 'Dr. Sarah Jenkins',
      status: 'active',
      enableSnapshots,
      showResultsImmediately
    };

    examService.saveExam(newExam);
    setSuccessMessage(`Exam "${newExam.title}" has been created and synced with the Student Portal!`);

    setTimeout(() => {
      navigate('/student/dashboard');
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create New Assessment</h2>
            <p className="text-xs text-slate-500">Configure questions, duration, and on-device privacy proctoring settings</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Shared Demo Storage
        </span>
      </div>

      {/* Validation Alert */}
      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold text-rose-900 mb-1">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Please resolve the following before saving:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage} Redirecting to Student Portal...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-indigo-600" />
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exam Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. CS 402: Web Security & Modern Architecture"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Instructions <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary of exam scope, allowed resources, and guidelines..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Duration (Minutes) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="360"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Passing Score (Points)
              </label>
              <input
                type="number"
                min="1"
                value={passingScore}
                onChange={e => setPassingScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Privacy & Proctoring Switches */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={enableSnapshots}
                onChange={e => setEnableSnapshots(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Incident Snapshot Thumbnails
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Capture a small thumbnail only when a violation is flagged, stored locally with student consent.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={showResultsImmediately}
                onChange={e => setShowResultsImmediately(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-800">
                  Release Score Immediately
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Reveal score and answer evaluation upon student submission (or keep pending teacher review).
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Multiple Choice Questions ({questions.length})
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-indigo-200"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    {qIdx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">Question #{qIdx + 1}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>Points:</span>
                    <input
                      type="number"
                      min="1"
                      value={q.marks}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setQuestions(questions.map(item => item.id === q.id ? { ...item, marks: val } : item));
                      }}
                      className="w-14 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Question Prompt
                </label>
                <input
                  type="text"
                  value={q.questionText}
                  onChange={e => handleQuestionTextChange(q.id, e.target.value)}
                  placeholder="Enter multiple-choice question..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800"
                  required
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Options (Select radio for correct answer)
                </label>

                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctOptionIndex === optIdx}
                      onChange={() => handleSetCorrectOption(q.id, optIdx)}
                      className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => handleOptionTextChange(q.id, optIdx, e.target.value)}
                      placeholder={`Option ${optIdx + 1}`}
                      className={`flex-1 px-3 py-1.5 text-xs border rounded-lg focus:outline-none transition-colors ${
                        q.correctOptionIndex === optIdx
                          ? 'border-teal-500 bg-teal-50/30 text-teal-900 font-medium'
                          : 'border-slate-200'
                      }`}
                      required
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(q.id, optIdx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                        title="Remove option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {q.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => handleAddOption(q.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mt-1 pt-1"
                  >
                    + Add option
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/teacher/dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Exam & Sync with Students</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExamPage;
