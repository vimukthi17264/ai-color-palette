'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { StarIcon } from '@radix-ui/react-icons'; // Adjust import based on your icon library

// Define the props interface
interface FeedbackCollectorProps {
    autoOpenCondition: boolean; // Specify the type for autoOpenCondition
  }
  
const FeedbackCollector: React.FC<FeedbackCollectorProps> = ({ autoOpenCondition }) => {
    const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0); // State for star rating

  useEffect(() => {
    if (autoOpenCondition) {
      const timer = setTimeout(() => setIsOpen(true), 2000); // Opens dialog after 2 seconds
      return () => clearTimeout(timer); // Clean up timer on component unmount
    }
  }, [autoOpenCondition]);

  const handleSubmit = () => {
    console.log('Feedback:', feedback);
    console.log('Email:', email);
    console.log('Rating:', rating);
    setIsSubmitted(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    onMouseLeave={() => setRating(0)} // Optional: Reset rating on mouse leave
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

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackCollector;