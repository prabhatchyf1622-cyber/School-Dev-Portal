import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Atom,
  Binary,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiTutorModule: React.FC = () => {
  const { currentUser } = useSchool();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${currentUser.name.split(' ')[0]}! I am your AI Academic Tutor for Grade ${currentUser.classId || '10'}. I can help you solve Math problems, explain Physics formulas, review Chemistry reactions, or prepare for upcoming examinations. What would you like to explore today?`,
      timestamp: '10:00 AM',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    'How do I solve quadratic equations using the discriminant formula?',
    'Explain the Lens Maker’s Formula and sign conventions in Ray Optics.',
    'What are the key moral themes in Shakespeare’s Merchant of Venice?',
    'Explain the difference between photosynthesis and cellular respiration.',
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    // Provide rich academic answers
    setTimeout(() => {
      let answer = '';
      const q = questionText.toLowerCase();

      if (q.includes('quadratic') || q.includes('discriminant')) {
        answer = `**Quadratic Equations & Discriminant Guide:**\n\nFor any quadratic equation in standard form:  \n$$ax^2 + bx + c = 0$$\n\n1. The Discriminant $D$ is given by:  \n$$D = b^2 - 4ac$$\n\n2. Nature of Roots based on $D$:\n- If **$D > 0$**: Two distinct real roots  \n  Roots: $x = \\frac{-b \\pm \\sqrt{D}}{2a}$\n- If **$D = 0$**: Two equal real roots  \n  Roots: $x = \\frac{-b}{2a}$\n- If **$D < 0$**: No real roots (imaginary/complex roots)\n\n*Pro-tip for your Midterms:* Always verify whether $a \\neq 0$ before computing!`;
      } else if (q.includes('lens') || q.includes('optics') || q.includes('ray')) {
        answer = `**Ray Optics: Lens Formula & Sign Conventions:**\n\n1. **Thin Lens Formula:**  \n$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$$\nWhere:\n- $f$ = Focal length (Positive for convex lens, Negative for concave lens)\n- $v$ = Image distance\n- $u$ = Object distance (Always taken as negative in Cartesian convention)\n\n2. **Linear Magnification ($m$):**  \n$$m = \\frac{h'}{h} = \\frac{v}{u}$$\n\n3. **Key Exam Rule:** If $m$ is negative, the image is real and inverted. If $m$ is positive, the image is virtual and erect.`;
      } else if (q.includes('shakespeare') || q.includes('merchant of venice')) {
        answer = `**The Merchant of Venice — Central Themes:**\n\n1. **Justice versus Mercy:** Portia’s famous courtroom speech emphasizes that *"the quality of mercy is not strained"*—it drops like gentle rain from heaven, surpassing the temporal power of earthly rulers.\n2. **Prejudice & Outsider Status:** Shylock's speech (*"Hath not a Jew eyes?"*) exposes the Venetian society's hypocrisy and religious marginalization.\n3. **Love and Friendship:** Antonio’s profound bond with Bassanio contrasts with the materialistic contract of the pound of flesh.`;
      } else {
        answer = `Great inquiry! For Grade ${currentUser.classId || '10'} curriculum, let's break this down systematically:\n\n1. **Fundamental Principle:** In academic examinations, clearly state the definition and governing formula first.\n2. **Step-by-Step Derivation:** Write down all given parameters with proper SI units before calculating.\n3. **Examiner Marking Tip:** Always box your final answer and mention the units (e.g. Joules, Newtons, meters). Would you like to practice a sample question on this topic?`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Academic Tutor & Doubt Solver
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
              Curriculum AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            24/7 intelligent homework assistant and CBSE exam revision mentor.
          </p>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Try asking:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(q)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-xs text-slate-700 whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[520px]">
        {/* Messages list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-bold text-xs'
                    : 'bg-slate-900 text-amber-400'
                }`}
              >
                {m.sender === 'user' ? (
                  currentUser.name[0]
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              <div>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div
                  className={`text-[10px] text-slate-400 mt-1 font-mono ${
                    m.sender === 'user' ? 'text-right' : ''
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span>AI Tutor is formulating step-by-step academic explanation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAsk(inputQuestion);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={e => setInputQuestion(e.target.value)}
              placeholder="Ask any question from Math, Physics, Chemistry, Biology, English..."
              className="flex-1 text-xs px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isTyping}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Tutor</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
