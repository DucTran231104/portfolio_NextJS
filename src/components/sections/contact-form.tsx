"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function Toast({ message, open }: { message: string; open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-md bg-slate-900 text-white px-4 py-2 shadow-md">
      {message}
    </div>
  );
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Lấy dữ liệu từ form
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setToast({ open: true, message: 'Message sent — thanks! I will reply within 1–3 days.' });
        form.reset();
      } else {
        setToast({ open: true, message: result.message || 'Something went wrong. Please try again later.' });
      }
    } catch (error) {
      setToast({ open: true, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
      window.setTimeout(() => setToast({ open: false, message: '' }), 5000);
    }
  }

  // Simple controlled form submit via fetch + tiny toast
  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" placeholder="Your full name" required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={6} placeholder="Tell me about your project or question" required />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send message'}</Button>
          <p className="text-sm text-muted-foreground">We will reply within 2 business days.</p>
        </div>
      </form>

      <Toast open={toast.open} message={toast.message} />
    </>
  );
}
