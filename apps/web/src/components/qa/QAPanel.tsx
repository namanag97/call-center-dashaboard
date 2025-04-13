import React, { useState } from 'react';

// Temporary type definitions until import issues are fixed
interface QANote {
  id: string;
  text: string;
  transcriptEntryId: string;
  createdBy: any;
  createdAt: string;
  category?: 'positive' | 'negative' | 'suggestion' | 'general';
}

interface QACriterion {
  id: string;
  name: string;
  description: string;
  category: string;
  weight: number;
}

interface QAData {
  callId: string;
  score: number;
  status: 'pending' | 'in-progress' | 'completed';
  evaluatedBy?: any;
  evaluatedAt?: string;
  criteriaEvaluations: Array<{
    criterionId: string;
    score: number;
    comment?: string;
  }>;
  notes: QANote[];
  feedback?: string;
}

export interface QAPanelProps {
  /**
   * Call ID
   */
  callId: string;

  /**
   * Current playback time in seconds
   */
  currentTime?: number;

  /**
   * QA data if available
   */
  qaData?: QAData;

  /**
   * Available QA criteria for evaluation
   */
  criteria: QACriterion[];

  /**
   * Current transcript entry ID
   */
  activeTranscriptEntryId?: string;

  /**
   * Callback when adding a note
   */
  onAddNote?: (note: {
    text: string;
    transcriptEntryId: string;
    category: 'positive' | 'negative' | 'suggestion' | 'general';
  }) => void;

  /**
   * Callback when updating a criterion score
   */
  onUpdateCriterion?: (criterionId: string, score: number, comment?: string) => void;

  /**
   * Callback when submitting overall feedback
   */
  onSubmitFeedback?: (feedback: string) => void;

  /**
   * Callback when completing the QA
   */
  onComplete?: () => void;

  /**
   * CSS class to apply to the container
   */
  className?: string;
}

/**
 * QAPanel component for quality assurance input
 */
const QAPanel: React.FC<QAPanelProps> = ({
  callId,
  currentTime = 0,
  qaData,
  criteria,
  activeTranscriptEntryId,
  onAddNote,
  onUpdateCriterion,
  onSubmitFeedback,
  onComplete,
  className = '',
}) => {
  // State for adding a new note
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState<'positive' | 'negative' | 'suggestion' | 'general'>('general');
  
  // State for overall feedback
  const [feedback, setFeedback] = useState(qaData?.feedback || '');
  
  // State for active view
  const [activeView, setActiveView] = useState<'notes' | 'scoring' | 'feedback'>('notes');
  
  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNote.trim() || !activeTranscriptEntryId) return;
    
    if (onAddNote) {
      onAddNote({
        text: newNote.trim(),
        transcriptEntryId: activeTranscriptEntryId,
        category: noteCategory,
      });
    }
    
    // Reset form
    setNewNote('');
    setNoteCategory('general');
  };
  
  // Handle scoring update
  const handleScoreUpdate = (criterionId: string, score: number, comment?: string) => {
    if (onUpdateCriterion) {
      onUpdateCriterion(criterionId, score, comment);
    }
  };
  
  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    if (onSubmitFeedback) {
      onSubmitFeedback(feedback);
    }
  };
  
  // Handle QA completion
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  // Get the category style
  const getCategoryStyle = (category: 'positive' | 'negative' | 'suggestion' | 'general') => {
    switch (category) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Format time
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get the scoring background color
  const getScoringBackground = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 5) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  return (
    <div className={`rounded-lg border border-neutral-200 bg-white overflow-hidden flex flex-col ${className}`}>
      <div className="border-b border-neutral-200">
        <nav className="flex">
          {[
            { id: 'notes', label: 'Notes' },
            { id: 'scoring', label: 'Scoring' },
            { id: 'feedback', label: 'Feedback' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`py-3 px-4 text-sm font-medium border-b-2 focus:outline-none ${
                activeView === tab.id 
                  ? 'text-primary-600 border-primary-600' 
                  : 'text-neutral-500 border-transparent hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveView(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-4 flex-grow overflow-auto">
        {activeView === 'notes' && (
          <div>
            {/* Add new note */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Add Note for Current Segment</h3>
              <div className="flex gap-2 mb-2">
                {['positive', 'negative', 'suggestion', 'general'].map((cat) => (
                  <button
                    key={cat}
                    className={`text-xs px-2 py-1 rounded-full ${
                      noteCategory === cat 
                        ? getCategoryStyle(cat as any)
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                    onClick={() => setNoteCategory(cat as any)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-grow p-2 border border-neutral-300 rounded text-sm min-h-[80px]"
                  placeholder="Add a note about this part of the call..."
                  disabled={!activeTranscriptEntryId}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || !activeTranscriptEntryId}
                  className="px-4 py-2 bg-primary-600 text-white rounded disabled:bg-neutral-300 disabled:text-neutral-500"
                >
                  Add
                </button>
              </div>
              {!activeTranscriptEntryId && (
                <p className="text-xs text-neutral-500 mt-1">
                  Please play the audio to select a transcript segment for annotation
                </p>
              )}
              {activeTranscriptEntryId && (
                <p className="text-xs text-neutral-500 mt-1">
                  Adding note at {formatTime(currentTime)}
                </p>
              )}
            </div>
            
            {/* Note list */}
            <div>
              <h3 className="text-sm font-medium mb-2">Notes ({qaData?.notes?.length || 0})</h3>
              {(!qaData?.notes || qaData.notes.length === 0) ? (
                <p className="text-sm text-neutral-500">No notes added yet</p>
              ) : (
                <div className="space-y-3">
                  {qaData.notes.map((note) => (
                    <div key={note.id} className={`p-3 rounded-md ${getCategoryStyle(note.category || 'general')}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium capitalize">{note.category || 'general'}</span>
                        <span className="text-xs">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeView === 'scoring' && (
          <div>
            <h3 className="text-sm font-medium mb-3">Quality Assessment</h3>
            
            {/* Criteria scoring */}
            <div className="space-y-4">
              {criteria.map((criterion) => {
                const evaluation = qaData?.criteriaEvaluations?.find(
                  (evaluation) => evaluation.criterionId === criterion.id
                );
                const score = evaluation?.score || 0;
                
                return (
                  <div key={criterion.id} className="border border-neutral-200 rounded-md p-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{criterion.name}</h4>
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                        Weight: {criterion.weight}%
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{criterion.description}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <button
                          key={value}
                          className={`w-8 h-8 rounded-full text-xs font-medium ${
                            score === value 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                          onClick={() => handleScoreUpdate(criterion.id, value, evaluation?.comment)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    
                    <textarea
                      value={evaluation?.comment || ''}
                      onChange={(e) => handleScoreUpdate(criterion.id, score, e.target.value)}
                      className="w-full p-2 text-sm border border-neutral-300 rounded"
                      placeholder="Add comments about this criterion..."
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Overall score */}
            {qaData?.score !== undefined && (
              <div className={`mt-4 p-4 rounded-md ${getScoringBackground(qaData.score)}`}>
                <h4 className="font-medium mb-1">Overall Score</h4>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{qaData.score.toFixed(1)}</div>
                  <div className="text-sm">/ 10</div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeView === 'feedback' && (
          <div>
            <h3 className="text-sm font-medium mb-3">Overall Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded text-sm min-h-[200px]"
              placeholder="Provide overall feedback about this call..."
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded"
                disabled={!feedback.trim()}
              >
                Save Feedback
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom actions */}
      <div className="border-t border-neutral-200 p-3 flex justify-between items-center bg-neutral-50">
        <div className="text-sm">
          Status: <span className="font-medium capitalize">{qaData?.status || 'pending'}</span>
        </div>
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={qaData?.status === 'completed'}
        >
          Complete QA
        </button>
      </div>
    </div>
  );
};

export default QAPanel; 