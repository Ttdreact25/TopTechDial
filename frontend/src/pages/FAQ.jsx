import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, Phone, Mail, Award, Globe, PlusCircle } from 'lucide-react';

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeId, setActiveId] = useState(null);

    const questions = [
        {
            id: 1,
            category: 'general',
            question: "What exactly is TopTechDial?",
            answer: "TopTechDial is a next-generation business discovery platform. We connect high-quality local service providers with customers through a verified, transparent directory. Our platform features real-time search, interactive maps, and a robust review moderation system to ensure quality."
        },
        {
            id: 2,
            category: 'business',
            question: "How do I list my business on TopTechDial?",
            answer: "Registering your business is simple! Create an account, click on 'Add Listing' in your dashboard, and provide your business details including category, address, and contact information. Our moderation team will review your submission within 24-48 hours for quality assurance."
        },
        {
            id: 3,
            category: 'account',
            question: "Is TopTechDial free to use for customers?",
            answer: "Yes, TopTechDial is 100% free for customers to search, discover, and contact businesses. We believe in providing open access to quality service discovery for everyone in the community."
        },
        {
            id: 4,
            category: 'general',
            question: "How are businesses verified on the platform?",
            answer: "We use a multi-step verification process that includes checking official business registrations, validating phone numbers and physical addresses, and monitoring initial customer feedback. Look for the 'Verified' shield icon on a listing for platform-certified businesses."
        },
        {
            id: 5,
            category: 'business',
            question: "Can I manage multiple businesses from one account?",
            answer: "Absolutely. Our platform is built for growth. You can manage multiple business locations or entirely different service brands from a single consolidated dashboard with separate analytics for each."
        },
        {
            id: 6,
            category: 'account',
            question: "What happens if I lose my password?",
            answer: "You can use our 'Forgot Password' feature on the login page. We'll send a secure verification link or OTP to your registered email address to help you reset your credentials instantly."
        },
        {
            id: 7,
            category: 'general',
            question: "How do I report a fraudulent listing?",
            answer: "If you encounter a suspicious or fraudulent listing, please use the 'Report' button on the business's details page. Alternatively, you can contact our security team at compliance@toptechdial.com with the listing ID."
        }
    ];

    const filteredQuestions = questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <div style={{ background: 'var(--primary-low)', display: 'inline-flex', padding: '15px', borderRadius: '50%', marginBottom: '20px' }}><HelpCircle size={40} color="var(--primary)" /></div>
                <h1 style={styles.title}>Help & Knowledge Base</h1>
                <p style={styles.subtitle}>Looking for answers? Find quick solutions to common questions here.</p>
                
                <div style={styles.searchBox}>
                    <Search size={20} color="#888" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        className="form-control" 
                        placeholder="Search for topics, keywords, or specific questions..." 
                        style={{ paddingLeft: '55px', height: '64px', fontSize: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.grid}>
                    <div style={styles.mainCol}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                             <button className="btn btn-secondary" style={{ borderRadius: '30px' }}>All Topics</button>
                             <button className="btn btn-secondary" style={{ borderRadius: '30px', background: 'transparent' }}>General</button>
                             <button className="btn btn-secondary" style={{ borderRadius: '30px', background: 'transparent' }}>Business Owners</button>
                             <button className="btn btn-secondary" style={{ borderRadius: '30px', background: 'transparent' }}>Security</button>
                        </div>

                        {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
                            <div key={q.id} style={styles.faqCard}>
                                <div 
                                    onClick={() => setActiveId(activeId === q.id ? null : q.id)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '25px' }}
                                >
                                    <h4 style={{ margin: 0, color: 'white', fontSize: '17px' }}>{q.question}</h4>
                                    {activeId === q.id ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                                </div>
                                {activeId === q.id && (
                                    <div style={{ padding: '0 25px 25px', color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.8', borderTop: '1px solid rgba(255,255,255,0.03)', marginTop: '-5px', paddingTop: '15px' }}>
                                        {q.answer}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                                <Search size={48} color="var(--text-low)" style={{ marginBottom: '20px' }} />
                                <h3>No matching results</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Try searching with different keywords or browse our topics list.</p>
                            </div>
                        )}
                    </div>

                    <div style={styles.sideCol}>
                         <div className="glass-card" style={{ padding: '30px', background: 'var(--primary-gradient)', border: 'none' }}>
                            <h3 style={{ marginBottom: '15px', color: 'white' }}>Still need help?</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '25px' }}>Our support engineers are available 24/7 to assist you with technical issues or billing enquiries.</p>
                            <button className="btn btn-secondary" style={{ width: '100%', background: 'white', color: 'black', fontWeight: 'bold' }}>Contact Support</button>
                         </div>

                         <div style={{ marginTop: '40px' }}>
                             <h4 style={{ marginBottom: '20px', color: 'white' }}>Quick Contact</h4>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                 <div style={styles.contactItem}><div style={styles.iconCircle}><Mail size={16} /></div> <span>support@toptechdial.com</span></div>
                                 <div style={styles.contactItem}><div style={styles.iconCircle}><Phone size={16} /></div> <span>+91 1800-PLATFORM</span></div>
                                 <div style={styles.contactItem}><div style={styles.iconCircle}><MessageSquare size={16} /></div> <span>Live Chat (Admin only)</span></div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#050505', color: 'white' },
    hero: { padding: '120px 20px 80px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255, 94, 54, 0.05) 0%, transparent 100%)' },
    title: { fontSize: '42px', fontWeight: 'bold' },
    subtitle: { color: 'var(--text-muted)', fontSize: '16px', marginBottom: '40px' },
    searchBox: { maxWidth: '800px', margin: '0 auto', position: 'relative' },
    content: { maxWidth: '1200px', margin: '0 auto', padding: '0 40px 100px' },
    grid: { display: 'flex', gap: '40px' },
    mainCol: { flexGrow: 1, minWidth: '0' },
    sideCol: { width: '350px', position: 'sticky', top: '100px' },
    faqCard: { marginBottom: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' },
    contactItem: { display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-muted)', fontSize: '14px' },
    iconCircle: { width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }
};

export default FAQ;
