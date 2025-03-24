import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !message) {
      toast.error('Please fill out all fields');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent!');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Page title */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Contact Us</h1>
            <p className="text-black/70 max-w-2xl mx-auto">
              We'd love to hear from you. Reach out with any questions about our products or services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-medium mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 p-3 bg-amber-50 rounded-full text-amber-700">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-black/70">hello@vhinternational.com</p>
                      <p className="text-black/70">support@vhinternational.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-3 bg-amber-50 rounded-full text-amber-700">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-black/70">+91 97568-53317</p>
                      <p className="text-black/70">Mon-Fri: 9am - 5pm EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-3 bg-amber-50 rounded-full text-amber-700">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Visit Us</h3>
                      <p className="text-black/70">400 University Drive Suite 200 Coral Gables</p>
                      <p className="text-black/70">FL 33134 UK</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Store Hours</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Monday - Friday</div>
                    <div>10:00 AM - 7:00 PM</div>
                    <div>Saturday</div>
                    <div>11:00 AM - 6:00 PM</div>
                    <div>Sunday</div>
                    <div>12:00 PM - 5:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact form */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-medium mb-6">Send a Message</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Your Name"
                      className="w-full rounded-lg border-amber-200 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="w-full rounded-lg border-amber-200 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full rounded-lg border-amber-200 focus:ring-amber-500"
                      rows={6}
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white py-6 rounded-full transition-all mt-4"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-pulse">Sending...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message <Send size={16} className="ml-2" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Map */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="aspect-[16/9] rounded-lg overflow-hidden bg-amber-50">
                {/* Embed a map here in a real application */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-black/50">Map Placeholder - In a real app, you would embed a Google Map or similar service here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
