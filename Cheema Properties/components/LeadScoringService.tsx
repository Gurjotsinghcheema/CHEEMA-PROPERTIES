import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  Star, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Lead scoring criteria
interface LeadScore {
  total: number;
  breakdown: {
    demographic: number;
    behavior: number;
    engagement: number;
    intent: number;
    timeline: number;
  };
  quality: 'hot' | 'warm' | 'cold';
  priority: 'high' | 'medium' | 'low';
  nextAction: string;
  lastUpdated: string;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyDescription: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'viewed' | 'closed';
  score: LeadScore;
  interactions: LeadInteraction[];
  tags: string[];
}

interface LeadInteraction {
  id: string;
  type: 'email' | 'call' | 'whatsapp' | 'property_view' | 'inquiry' | 'meeting';
  timestamp: string;
  description: string;
  outcome?: 'positive' | 'neutral' | 'negative';
  followUpNeeded?: boolean;
}

export class LeadScoringService {
  private static instance: LeadScoringService;

  private constructor() {}

  public static getInstance(): LeadScoringService {
    if (!LeadScoringService.instance) {
      LeadScoringService.instance = new LeadScoringService();
    }
    return LeadScoringService.instance;
  }

  // Calculate lead score based on multiple factors
  public calculateLeadScore(lead: any, interactions: LeadInteraction[] = []): LeadScore {
    let score = 0;
    const breakdown = {
      demographic: 0,
      behavior: 0,
      engagement: 0,
      intent: 0,
      timeline: 0
    };

    // Demographic scoring (25 points max)
    breakdown.demographic = this.scoreDemographics(lead);
    
    // Behavior scoring (25 points max)
    breakdown.behavior = this.scoreBehavior(lead, interactions);
    
    // Engagement scoring (20 points max)
    breakdown.engagement = this.scoreEngagement(interactions);
    
    // Intent scoring (20 points max)
    breakdown.intent = this.scoreIntent(lead);
    
    // Timeline scoring (10 points max)
    breakdown.timeline = this.scoreTimeline(lead);

    score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    const quality = this.getLeadQuality(score);
    const priority = this.getLeadPriority(score, lead);
    const nextAction = this.getNextAction(score, lead, interactions);

    return {
      total: Math.round(score),
      breakdown,
      quality,
      priority,
      nextAction,
      lastUpdated: new Date().toISOString()
    };
  }

  // Score based on demographic information
  private scoreDemographics(lead: any): number {
    let score = 0;

    // Phone number provided
    if (lead.phone) score += 5;

    // Email provided
    if (lead.email) score += 5;

    // Complete name
    if (lead.firstName && lead.lastName) score += 3;

    // Budget analysis from property description
    const description = lead.propertyDescription?.toLowerCase() || '';
    
    // Budget indicators
    if (description.includes('budget') || description.includes('price')) score += 2;
    if (description.includes('lakh') || description.includes('cr')) score += 3;
    if (description.includes('ready to buy') || description.includes('urgent')) score += 5;
    
    // Location specificity
    if (description.includes('ludhiana') || description.includes('chandigarh')) score += 2;

    return Math.min(score, 25);
  }

  // Score based on user behavior
  private scoreBehavior(lead: any, interactions: LeadInteraction[]): number {
    let score = 0;

    // Multiple property views
    const propertyViews = interactions.filter(i => i.type === 'property_view').length;
    score += Math.min(propertyViews * 2, 8);

    // Multiple inquiries
    const inquiries = interactions.filter(i => i.type === 'inquiry').length;
    score += Math.min(inquiries * 3, 9);

    // Specific property requirements
    const description = lead.propertyDescription?.toLowerCase() || '';
    if (description.length > 50) score += 3;
    if (description.includes('bedroom') || description.includes('bhk')) score += 2;
    if (description.includes('parking') || description.includes('amenities')) score += 2;
    if (description.includes('floor') || description.includes('facing')) score += 1;

    return Math.min(score, 25);
  }

  // Score based on engagement level
  private scoreEngagement(interactions: LeadInteraction[]): number {
    let score = 0;

    // Recent interactions (last 7 days)
    const recentInteractions = interactions.filter(i => {
      const days = (new Date().getTime() - new Date(i.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    });
    score += Math.min(recentInteractions.length * 2, 10);

    // Positive outcomes
    const positiveInteractions = interactions.filter(i => i.outcome === 'positive').length;
    score += Math.min(positiveInteractions * 3, 9);

    // Response time (if they responded quickly)
    const callInteractions = interactions.filter(i => i.type === 'call').length;
    score += Math.min(callInteractions * 1, 1);

    return Math.min(score, 20);
  }

  // Score based on purchase intent
  private scoreIntent(lead: any): number {
    let score = 0;
    const description = lead.propertyDescription?.toLowerCase() || '';

    // High intent keywords
    const highIntentKeywords = ['buy', 'purchase', 'invest', 'looking for', 'need', 'want'];
    const urgentKeywords = ['urgent', 'asap', 'immediate', 'soon', 'quickly'];
    const readyKeywords = ['ready', 'cash', 'approved', 'loan'];

    highIntentKeywords.forEach(keyword => {
      if (description.includes(keyword)) score += 2;
    });

    urgentKeywords.forEach(keyword => {
      if (description.includes(keyword)) score += 3;
    });

    readyKeywords.forEach(keyword => {
      if (description.includes(keyword)) score += 4;
    });

    // Specific requirements indicate serious intent
    if (description.includes('budget') && description.includes('location')) score += 3;

    return Math.min(score, 20);
  }

  // Score based on timeline factors
  private scoreTimeline(lead: any): number {
    let score = 0;
    const submittedAt = new Date(lead.submittedAt);
    const now = new Date();
    const hoursAgo = (now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60);

    // Recency bonus (more recent = higher score)
    if (hoursAgo <= 1) score += 5;        // Within 1 hour
    else if (hoursAgo <= 24) score += 3;  // Within 24 hours
    else if (hoursAgo <= 72) score += 1;  // Within 3 days

    // Time of submission (business hours bonus)
    const hour = submittedAt.getHours();
    if (hour >= 9 && hour <= 18) score += 2; // Business hours

    // Day of week (weekday bonus)
    const day = submittedAt.getDay();
    if (day >= 1 && day <= 5) score += 3; // Monday to Friday

    return Math.min(score, 10);
  }

  // Determine lead quality based on score
  private getLeadQuality(score: number): 'hot' | 'warm' | 'cold' {
    if (score >= 70) return 'hot';
    if (score >= 40) return 'warm';
    return 'cold';
  }

  // Determine lead priority
  private getLeadPriority(score: number, lead: any): 'high' | 'medium' | 'low' {
    const description = lead.propertyDescription?.toLowerCase() || '';
    const isUrgent = description.includes('urgent') || description.includes('asap');
    
    if (score >= 70 || isUrgent) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  // Suggest next action based on score and lead data
  private getNextAction(score: number, lead: any, interactions: LeadInteraction[]): string {
    const lastInteraction = interactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    const daysSinceLastContact = lastInteraction ? 
      (new Date().getTime() - new Date(lastInteraction.timestamp).getTime()) / (1000 * 60 * 60 * 24) : 
      999;

    if (score >= 70) {
      if (daysSinceLastContact > 1) return 'Immediate call required - Hot lead!';
      return 'Schedule property visit within 24 hours';
    }

    if (score >= 50) {
      if (daysSinceLastContact > 3) return 'Follow up with WhatsApp message';
      return 'Send property recommendations via email';
    }

    if (score >= 30) {
      return 'Add to nurture campaign - send weekly updates';
    }

    return 'Low priority - monthly newsletter only';
  }

  // Auto-assign tags based on lead characteristics
  public autoAssignTags(lead: any): string[] {
    const tags: string[] = [];
    const description = lead.propertyDescription?.toLowerCase() || '';

    // Budget tags
    if (description.includes('lakh')) tags.push('Mid-Budget');
    if (description.includes('cr') || description.includes('crore')) tags.push('High-Budget');
    
    // Property type tags
    if (description.includes('apartment')) tags.push('Apartment');
    if (description.includes('house')) tags.push('House');
    if (description.includes('villa')) tags.push('Villa');
    if (description.includes('commercial')) tags.push('Commercial');
    
    // Location tags
    if (description.includes('ludhiana')) tags.push('Ludhiana');
    if (description.includes('chandigarh')) tags.push('Chandigarh');
    
    // Urgency tags
    if (description.includes('urgent') || description.includes('asap')) tags.push('Urgent');
    if (description.includes('ready')) tags.push('Ready-to-Buy');
    
    // Investment tags
    if (description.includes('invest')) tags.push('Investor');
    if (description.includes('first time')) tags.push('First-Time-Buyer');

    return tags;
  }

  // Get leads sorted by score
  public sortLeadsByScore(leads: Lead[]): Lead[] {
    return leads.sort((a, b) => b.score.total - a.score.total);
  }

  // Get leads by quality
  public getLeadsByQuality(leads: Lead[], quality: 'hot' | 'warm' | 'cold'): Lead[] {
    return leads.filter(lead => lead.score.quality === quality);
  }

  // Get priority actions for today
  public getTodaysPriorityActions(leads: Lead[]): Array<{lead: Lead, action: string, priority: number}> {
    const actions: Array<{lead: Lead, action: string, priority: number}> = [];

    leads.forEach(lead => {
      let priority = 0;
      let action = '';

      if (lead.score.quality === 'hot') {
        priority = 3;
        action = 'Call immediately';
      } else if (lead.score.quality === 'warm') {
        priority = 2;
        action = 'Send WhatsApp message';
      } else {
        priority = 1;
        action = 'Send email follow-up';
      }

      // Increase priority for recent leads
      const hoursAgo = (new Date().getTime() - new Date(lead.submittedAt).getTime()) / (1000 * 60 * 60);
      if (hoursAgo <= 24) priority += 1;

      actions.push({ lead, action, priority });
    });

    return actions.sort((a, b) => b.priority - a.priority);
  }
}

// Lead Score Display Component
interface LeadScoreDisplayProps {
  lead: Lead;
  onUpdateScore: (leadId: string, newScore: LeadScore) => void;
}

export function LeadScoreDisplay({ lead, onUpdateScore }: LeadScoreDisplayProps) {
  const [scoreDetails, setScoreDetails] = useState(false);
  const scoringService = LeadScoringService.getInstance();

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'hot': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warm': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'cold': return <Target className="w-4 h-4 text-blue-600" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const refreshScore = () => {
    const newScore = scoringService.calculateLeadScore(lead, lead.interactions);
    onUpdateScore(lead.id, newScore);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getQualityIcon(lead.score.quality)}
            Lead Score Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${getScoreColor(lead.score.total)} border font-semibold`}>
              {lead.score.total}/100
            </Badge>
            <Badge variant="outline" className={
              lead.score.priority === 'high' ? 'border-red-200 text-red-700' :
              lead.score.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
              'border-blue-200 text-blue-700'
            }>
              {lead.score.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-sm text-muted-foreground">{lead.score.total}/100</span>
          </div>
          <Progress value={lead.score.total} className="h-2" />
        </div>

        {/* Lead Quality */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Quality: </span>
            <Badge variant="outline" className={
              lead.score.quality === 'hot' ? 'border-red-200 text-red-700 bg-red-50' :
              lead.score.quality === 'warm' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
              'border-blue-200 text-blue-700 bg-blue-50'
            }>
              {lead.score.quality.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Updated: {new Date(lead.score.lastUpdated).toLocaleDateString()}
          </div>
        </div>

        {/* Next Action */}
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Recommended Action</p>
              <p className="text-sm text-slate-600">{lead.score.nextAction}</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScoreDetails(!scoreDetails)}
            className="w-full flex items-center gap-2 text-left"
          >
            <TrendingUp className="w-4 h-4" />
            {scoreDetails ? 'Hide' : 'Show'} Score Breakdown
          </Button>
          
          {scoreDetails && (
            <div className="space-y-3 pt-2 border-t">
              {Object.entries(lead.score.breakdown).map(([category, score]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm capitalize">{category}</span>
                    <span className="text-sm text-muted-foreground">{Math.round(score)}</span>
                  </div>
                  <Progress 
                    value={(score / (category === 'demographic' || category === 'behavior' ? 25 : category === 'engagement' || category === 'intent' ? 20 : 10)) * 100} 
                    className="h-1" 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Refresh Score */}
        <Button
          variant="outline"
          size="sm"
          onClick={refreshScore}
          className="w-full flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh Score
        </Button>
      </CardContent>
    </Card>
  );
}

// Export singleton instance
export const leadScoringService = LeadScoringService.getInstance();