import React, { useState } from 'react';

// Temp type definitions until import issues are fixed
interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  bySpeaker: Record<string, {
    type: 'positive' | 'neutral' | 'negative';
    score: number;
  }>;
  timeline: Array<{
    time: number;
    type: 'positive' | 'neutral' | 'negative';
    score: number;
  }>;
}

interface Topic {
  name: string;
  keywords: string[];
  relevance: number;
  relatedEntryIds: string[];
}

interface NamedEntity {
  text: string;
  type: string;
  confidence: number;
  occurrences: Array<{
    transcriptEntryId: string;
    startPosition: number;
    endPosition: number;
  }>;
}

interface ActionItem {
  text: string;
  assignee?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  transcriptEntryId: string;
}

interface KeyMoment {
  type: 'question' | 'decision' | 'problem' | 'solution' | 'objection' | 'commitment';
  description: string;
  transcriptEntryId: string;
  time: number;
}

interface ComplianceIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  transcriptEntryId: string;
}

interface AnalysisResult {
  callId: string;
  sentiment: SentimentAnalysis;
  topics: Topic[];
  entities: NamedEntity[];
  actionItems: ActionItem[];
  keyMoments: KeyMoment[];
  summary: string;
  complianceIssues?: ComplianceIssue[];
}

export interface AnalysisResultsPanelProps {
  /**
   * Analysis results data
   */
  analysisResult: AnalysisResult;
  
  /**
   * Callback when clicking on a transcript entry reference
   */
  onEntryClick?: (entryId: string) => void;
  
  /**
   * CSS class to apply to the container
   */
  className?: string;
}

/**
 * AnalysisResultsPanel component that displays AI analysis results with visualizations and insights
 */
const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({
  analysisResult,
  onEntryClick,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sentiment' | 'topics' | 'moments' | 'issues'>('overview');
  
  // Get appropriate color for sentiment
  const getSentimentColor = (type: 'positive' | 'neutral' | 'negative'): string => {
    switch (type) {
      case 'positive':
        return 'bg-green-500';
      case 'neutral':
        return 'bg-blue-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get label for sentiment
  const getSentimentLabel = (type: 'positive' | 'neutral' | 'negative'): string => {
    switch (type) {
      case 'positive':
        return 'Positive';
      case 'neutral':
        return 'Neutral';
      case 'negative':
        return 'Negative';
      default:
        return 'Unknown';
    }
  };
  
  // Get color for severity
  const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
    switch (severity) {
      case 'low':
        return 'text-yellow-600 bg-yellow-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const handleEntryClick = (entryId: string) => {
    if (onEntryClick) {
      onEntryClick(entryId);
    }
  };
  
  // Sentiment timeline visualization (simplified for now)
  const SentimentTimeline = () => {
    const { timeline } = analysisResult.sentiment;
    
    if (!timeline || timeline.length === 0) {
      return <p>No timeline data available</p>;
    }
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Sentiment Over Time</h4>
        <div className="h-20 flex items-end space-x-1">
          {timeline.map((point, index) => {
            // Map score from -1,1 to 0,100 for height
            const heightPercentage = ((point.score + 1) / 2) * 100;
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-4 ${getSentimentColor(point.type)}`} 
                  style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                  title={`${getSentimentLabel(point.type)} (${point.score.toFixed(2)})`}
                />
                {index % 3 === 0 && (
                  <span className="text-xs mt-1">{Math.floor(point.time / 60)}:{(point.time % 60).toFixed(0).padStart(2, '0')}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Main content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div className="p-4 bg-neutral-50 rounded-md mb-4">
              <h3 className="font-medium mb-2">Summary</h3>
              <p className="text-sm">{analysisResult.summary}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.topics.slice(0, 3).map((topic) => (
                  <span key={topic.name} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Overall Sentiment</h3>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${getSentimentColor(analysisResult.sentiment.overall)} mr-2`} />
                <span>{getSentimentLabel(analysisResult.sentiment.overall)} ({analysisResult.sentiment.score.toFixed(2)})</span>
              </div>
            </div>
            
            {analysisResult.actionItems && analysisResult.actionItems.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Action Items</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysisResult.actionItems.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-sm">
                      <span 
                        className="cursor-pointer hover:underline" 
                        onClick={() => handleEntryClick(item.transcriptEntryId)}
                      >
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
        
      case 'sentiment':
        return (
          <div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Overall Sentiment</h3>
              <div className="mb-2 flex items-center">
                <div className={`w-4 h-4 rounded-full ${getSentimentColor(analysisResult.sentiment.overall)} mr-2`} />
                <span>{getSentimentLabel(analysisResult.sentiment.overall)} ({analysisResult.sentiment.score.toFixed(2)})</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Sentiment by Speaker</h3>
              {Object.entries(analysisResult.sentiment.bySpeaker).map(([speakerId, sentiment]) => (
                <div key={speakerId} className="flex items-center mb-2">
                  <span className="text-sm w-32">{speakerId.includes('agent') ? 'Agent' : 'Customer'}:</span>
                  <div className={`w-3 h-3 rounded-full ${getSentimentColor(sentiment.type)} mr-2`} />
                  <span className="text-sm">{getSentimentLabel(sentiment.type)} ({sentiment.score.toFixed(2)})</span>
                </div>
              ))}
            </div>
            
            <SentimentTimeline />
          </div>
        );
        
      case 'topics':
        return (
          <div>
            <h3 className="font-medium mb-3">Topics</h3>
            {analysisResult.topics.map((topic) => (
              <div key={topic.name} className="mb-4 p-3 bg-neutral-50 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{topic.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {(topic.relevance * 100).toFixed(0)}% relevant
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-neutral-500">Keywords:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {topic.keywords.map((keyword) => (
                      <span key={keyword} className="px-2 py-0.5 bg-neutral-200 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                {topic.relatedEntryIds.length > 0 && (
                  <div>
                    <span className="text-xs text-neutral-500">Mentioned in:</span>
                    <div className="mt-1">
                      {topic.relatedEntryIds.slice(0, 3).map((entryId) => (
                        <span 
                          key={entryId}
                          className="text-xs mr-2 text-blue-600 cursor-pointer hover:underline"
                          onClick={() => handleEntryClick(entryId)}
                        >
                          Jump to mention
                        </span>
                      ))}
                      {topic.relatedEntryIds.length > 3 && (
                        <span className="text-xs text-neutral-500">
                          +{topic.relatedEntryIds.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'moments':
        return (
          <div>
            <h3 className="font-medium mb-3">Key Moments</h3>
            {analysisResult.keyMoments.length === 0 ? (
              <p className="text-sm text-neutral-500">No key moments detected</p>
            ) : (
              <div className="space-y-3">
                {analysisResult.keyMoments.map((moment, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                    <div className="flex justify-between">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize mb-1">
                        {moment.type}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {Math.floor(moment.time / 60)}:{(moment.time % 60).toFixed(0).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm">{moment.description}</p>
                    <button 
                      className="text-xs text-blue-600 mt-1 hover:underline"
                      onClick={() => handleEntryClick(moment.transcriptEntryId)}
                    >
                      Jump to transcript
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'issues':
        return (
          <div>
            <h3 className="font-medium mb-3">Compliance Issues</h3>
            {!analysisResult.complianceIssues || analysisResult.complianceIssues.length === 0 ? (
              <div className="p-3 bg-green-50 text-green-800 rounded-md">
                No compliance issues detected
              </div>
            ) : (
              <div className="space-y-3">
                {analysisResult.complianceIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-neutral-50 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">{issue.type}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.severity} severity
                      </span>
                    </div>
                    <p className="text-sm mb-2">{issue.description}</p>
                    <button 
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => handleEntryClick(issue.transcriptEntryId)}
                    >
                      Jump to transcript
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`rounded-lg border border-neutral-200 bg-white overflow-hidden ${className}`}>
      <div className="border-b border-neutral-200">
        <nav className="flex">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sentiment', label: 'Sentiment' },
            { id: 'topics', label: 'Topics' },
            { id: 'moments', label: 'Key Moments' },
            { id: 'issues', label: 'Compliance' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`py-3 px-4 text-sm font-medium border-b-2 focus:outline-none ${
                activeTab === tab.id 
                  ? 'text-primary-600 border-primary-600' 
                  : 'text-neutral-500 border-transparent hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisResultsPanel; 