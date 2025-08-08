
import React, { useState, useCallback, useEffect } from 'react';
import { testimonials } from '../constants';
import { Testimonial } from '../types';

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-white/5 p-8 rounded-lg h-full flex flex-col justify-between">
        <p className="text-white italic text-lg leading-relaxed">"{testimonial.comment}"</p>
        <div className="flex items-center mt-6 pt-6 border-t border-white/10">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="ml-4">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-brand-gray">{testimonial.location}</p>
            </div>
        </div>
    </div>
);

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevTestimonial = useCallback(() => {
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? testimonials.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const nextTestimonial = useCallback(() => {
        const isLast = currentIndex === testimonials.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);
    
    useEffect(() => {
        const timer = setInterval(() => {
            nextTestimonial();
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(timer);
    }, [nextTestimonial]);


    return (
        <section id="testimonials" className="bg-brand-black py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Ce que nos <span className="text-brand-red">clients</span> disent</h2>
                     <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Leur satisfaction est notre meilleure publicité.</p>
                    <div className="h-1 w-20 bg-brand-red mx-auto mt-6"></div>
                </div>

                <div className="relative max-w-3xl mx-auto">
                    <div className="overflow-hidden">
                        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                                    <TestimonialCard testimonial={testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={prevTestimonial} className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-red text-white transition-colors">
                        &#8592;
                    </button>
                    <button onClick={nextTestimonial} className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-red text-white transition-colors">
                        &#8594;
                    </button>
                    
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-brand-red' : 'bg-white/20 hover:bg-white/40'}`}></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
