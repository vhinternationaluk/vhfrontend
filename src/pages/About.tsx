import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';

const About = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Hero section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Our Story</h1>
            <p className="text-black/70 max-w-2xl mx-auto">
              We create furniture that combines timeless design with exceptional craftsmanship.
            </p>
          </div>
          
          {/* About content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-2xl font-medium mb-4">Crafting Excellence Since 2010</h2>
              <p className="text-black/70 mb-4">
                Our journey began with a simple vision: to create furniture pieces that blend functionality with artistry. 
                Founded in 2010, we started as a small workshop dedicated to crafting handmade wooden furniture.
              </p>
              <p className="text-black/70 mb-4">
                As our reputation for quality and design excellence grew, so did our team of skilled artisans and designers. 
                Today, we're proud to create pieces that grace homes around the world, while maintaining our commitment to 
                sustainable practices and exceptional craftsmanship.
              </p>
              <p className="text-black/70">
                Each piece in our collection tells a story – of tradition, innovation, and the transformative power of 
                thoughtful design. We invite you to become part of our continuing story.
              </p>
            </div>
            
            <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80" 
                  alt="Workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Values section */}
          <div className="mb-20">
            <h2 className="text-2xl font-medium mb-8 text-center animate-fade-in">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3 className="font-medium mb-2">Sustainability</h3>
                <p className="text-sm text-black/70">
                  We source our materials responsibly and create furniture designed to last for generations, 
                  reducing environmental impact.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                <h3 className="font-medium mb-2">Craftsmanship</h3>
                <p className="text-sm text-black/70">
                  Every piece is crafted with meticulous attention to detail, honoring traditional techniques while 
                  embracing innovation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                <h3 className="font-medium mb-2">Timeless Design</h3>
                <p className="text-sm text-black/70">
                  We create pieces that transcend trends, focusing on balanced proportions, quality materials, 
                  and enduring aesthetics.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team section */}
          <div>
            <h2 className="text-2xl font-medium mb-8 text-center animate-fade-in">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                 {
                  name: "Mr. Haider Ali",
                  role: "Founder & Owner",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                },
                {
                  name: "Elena Rodriguez",
                  role: "Lead Designer",
                  image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
                },
                {
                  name: "Sophia Kim",
                  role: "Sustainability Director",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80"
                },
                {
                  name: "James Watson",
                  role: "Head of Operations",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                }
              ].map((member, index) => (
                <div 
                  key={member.name}
                  className="bg-white rounded-xl overflow-hidden shadow-sm animate-fade-in"
                  style={{ animationDelay: `${100 + (index * 50)}ms` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-black/70">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
