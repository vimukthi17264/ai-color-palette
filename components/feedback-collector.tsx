'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { StarIcon } from '@radix-ui/react-icons';
import { useToast } from '@/hooks/use-toast';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FeedbackCollectorProps {
  autoOpenCondition: boolean;
}

const FeedbackCollector: React.FC<FeedbackCollectorProps> = ({ autoOpenCondition }) => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkFeedbackStatus = () => {
      const lastPrompt = localStorage.getItem('lastFeedbackPrompt');
      const hasFeedback = localStorage.getItem('hasFeedback');

      if (hasFeedback === 'true') {
        return; // Don't show if feedback was already provided
      }

      const currentDate = new Date().toDateString();

      if (!lastPrompt || lastPrompt !== currentDate) {
        if (autoOpenCondition) {
          const timer = setTimeout(() => setIsOpen(true), 2000);
          localStorage.setItem('lastFeedbackPrompt', currentDate);
          return () => clearTimeout(timer);
        }
      }
    };

    checkFeedbackStatus();
  }, [autoOpenCondition]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          { feedback, email, rating }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      localStorage.setItem('hasFeedback', 'true');
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // If the user closes without submitting, we still don't want to show it again today
    localStorage.setItem('lastFeedbackPrompt', new Date().toDateString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>We Value Your Feedback</DialogTitle>
        <DialogDescription>Please let us know your thoughts so we can improve.</DialogDescription>

        {isSubmitted ? (
          <div className="text-center">
            <p>Thank you for your feedback!</p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-row justify-between">
              <label className="block text-sm font-medium">Rating</label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setRating(star)}
                    onMouseLeave={() => setRating(rating)}
                    aria-label={`Rate ${star} stars`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="feedback" className="block text-sm font-medium">Your Feedback</label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here..."
                rows={4}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium">Your Email (Optional)</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button onClick={handleClose} variant="outline">
                Maybe Later
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackCollector;