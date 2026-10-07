'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { contactApi, footerApi } from '../../lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [contactInfo, setContactInfo] = useState({
    email: 'komalkshirasagar32009@gmail.com',
    phone: '+91-8080211162',
    location: 'Chhatrapati Sambhajinagar, Maharashtra'
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    footerApi.get().then(res => {
      if (res?.data) {
        setContactInfo({
          email: res.data.email || 'komalkshirasagar32009@gmail.com',
          phone: res.data.phone || '+91-8080211162',
          location: res.data.location || 'Chhatrapati Sambhajinagar, Maharashtra'
        });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await contactApi.submit(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(res.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Let&apos;s Connect</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Contact Me
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Have a project in mind, want to hire, or just say hello? Drop me a message!
          </p>
          <div className="mt-4 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Email</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Direct mail for inquiries</p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="mt-2 block text-sm font-semibold text-blue-600 hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Phone</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Mon - Sat, 9am - 7pm</p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="mt-2 block text-sm font-semibold text-blue-600 hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Location</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Base location</p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {contactInfo.location}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Send a Message
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                I typically respond within 24 hours.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-fade-in">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
                  <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Thank you! Your message has been sent.
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    I will get back to you shortly at your provided email address.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {errorMsg && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Project Inquiry / Job Opportunity"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about your project, timeline, or requirements..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
