'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ClientProtectedRoute from '@/components/ClientProtectedRoute';
import { 
  Building2,
  ArrowLeft,
  Search,
  HelpCircle,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  ExternalLink,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

const faqs = [
  {
    id: '1',
    category: 'Getting Started',
    icon: HelpCircle,
    color: 'blue',
    questions: [
      {
        q: 'How do I access my projects?',
        a: 'You can view all your projects from the main dashboard. Click on "View Details" on any project card to see full project information, tasks, content, campaigns, and timeline.'
      },
      {
        q: 'How do I track project progress?',
        a: 'Each project shows a progress bar and detailed statistics. You can see completed vs. total tasks, published content, active campaigns, and upcoming deadlines.'
      },
      {
        q: 'What are the different project statuses?',
        a: 'Projects can have these statuses: Planning (initial phase), In Progress (active work), On Hold (temporarily paused), or Completed (finished). The status badge shows on each project card.'
      }
    ]
  },
  {
    id: '2',
    category: 'Communication',
    icon: MessageSquare,
    color: 'purple',
    questions: [
      {
        q: 'How do I contact my Project Manager?',
        a: 'You can message your Project Manager directly from any project page. Click on the "Messages" tab to start a conversation, share files, and get real-time responses.'
      },
      {
        q: 'How do I receive notifications?',
        a: 'Notifications appear in the bell icon at the top of your dashboard. You\'ll be notified about project updates, task completions, new content, and messages from your team.'
      },
      {
        q: 'Can I upload files or share documents?',
        a: 'Yes! In the Messages section of any project, you can attach files when sending messages. Your Project Manager will receive them instantly.'
      }
    ]
  },
  {
    id: '3',
    category: 'Content & Deliverables',
    icon: FileText,
    color: 'green',
    questions: [
      {
        q: 'Where can I see my content calendar?',
        a: 'Navigate to any project and click the "Social Calendar" tab to view all scheduled content, including posts, reels, and other deliverables with their publish dates.'
      },
      {
        q: 'How do I review and approve content?',
        a: 'Content items are displayed in the "Content Plan" tab within each project. You can review details, view attachments, and provide feedback through messages.'
      },
      {
        q: 'Can I see campaign performance?',
        a: 'Yes! The "Campaigns" tab shows all active and completed campaigns for each project, including budgets, platforms, and key performance indicators.'
      }
    ]
  },
  {
    id: '4',
    category: 'Account & Security',
    icon: Shield,
    color: 'orange',
    questions: [
      {
        q: 'How do I update my profile information?',
        a: 'Your profile information (name, email, company) can be updated by contacting your Project Manager or our support team.'
      },
      {
        q: 'Is my data secure?',
        a: 'Absolutely! We use industry-standard encryption and security measures to protect your data. All communications and files are transmitted securely.'
      },
      {
        q: 'Can I change my password?',
        a: 'Yes, you can change your password from the login page using the "Forgot Password" option, or by contacting support.'
      }
    ]
  },
  {
    id: '5',
    category: 'Billing & Invoices',
    icon: FileText,
    color: 'pink',
    questions: [
      {
        q: 'How do I view project costs?',
        a: 'Campaign budgets and project costs are displayed in the respective sections. For detailed invoices, please contact your Account Manager.'
      },
      {
        q: 'When are invoices sent?',
        a: 'Invoices are typically sent at the end of each billing cycle or project milestone. You\'ll receive them via email and can request copies anytime.'
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept various payment methods including bank transfers, credit cards, and digital payments. Contact our billing team for specific options.'
      }
    ]
  }
];

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    value: 'support@yourcompany.com',
    description: 'Get response within 24 hours'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    value: '+20 123 456 7890',
    description: 'Mon-Fri, 9AM-6PM EET'
  },
  {
    icon: Globe,
    title: 'Visit Website',
    value: 'www.yourcompany.com',
    description: 'More resources and info'
  }
];

export default function ClientHelpCenterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-400 bg-blue-500/20',
      purple: 'text-purple-400 bg-purple-500/20',
      green: 'text-green-400 bg-green-500/20',
      orange: 'text-orange-400 bg-orange-500/20',
      pink: 'text-pink-400 bg-pink-500/20'
    };
    return colors[color] || colors.blue;
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(qa => 
      searchQuery === '' || 
      qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <ClientProtectedRoute>
      <div className="min-h-screen bg-[#0c081e] text-white">
        {/* Header */}
        <div className="bg-[#14102a] border-b border-[#563EB7]/20 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} />
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                <HelpCircle className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Help Center</h1>
                <p className="text-sm text-gray-400">Find answers to your questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
          {/* Search Section */}
          <Card hover={false}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">How can we help you today?</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for help articles, FAQs, guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover>
              <button 
                onClick={() => router.push('/client-dashboard')}
                className="w-full p-6 text-left transition-transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">View Projects</h3>
                    <p className="text-sm text-gray-400">Access your projects</p>
                  </div>
                </div>
              </button>
            </Card>

            <Card hover>
              <button 
                onClick={() => router.push('/client-dashboard')}
                className="w-full p-6 text-left transition-transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Contact Support</h3>
                    <p className="text-sm text-gray-400">Message your team</p>
                  </div>
                </div>
              </button>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Getting Started</h3>
                    <p className="text-sm text-gray-400">New to the platform?</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* FAQs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            
            {filteredFaqs.length === 0 ? (
              <Card hover={false}>
                <div className="p-8 text-center">
                  <Search className="text-gray-400 mx-auto mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try different search terms or browse categories below</p>
                </div>
              </Card>
            ) : (
              filteredFaqs.map((category) => (
                <Card key={category.id} title={category.category} hover={false}>
                  <div className="divide-y divide-[#563EB7]/10">
                    {category.questions.map((qa, index) => {
                      const faqId = `${category.id}-${index}`;
                      const isExpanded = expandedFaq === faqId;
                      
                      return (
                        <div key={faqId} className="p-4">
                          <button
                            onClick={() => toggleFaq(faqId)}
                            className="w-full text-left flex items-start justify-between gap-4 group"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(category.color)}`}>
                                <category.icon size={16} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-white group-hover:text-[#8B5CF6] transition-colors">
                                  {qa.q}
                                </h4>
                                {isExpanded && (
                                  <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                                    {qa.a}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Contact Methods */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Still need help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactMethods.map((method, index) => (
                <Card key={index} hover>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#563EB7]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <method.icon className="text-[#8B5CF6]" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{method.title}</h3>
                        <p className="text-[#8B5CF6] font-medium mb-2">{method.value}</p>
                        <p className="text-sm text-gray-400">{method.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <Card title="Additional Resources" hover={false}>
            <div className="divide-y divide-[#563EB7]/10">
              <div className="p-4 flex items-center justify-between hover:bg-[#1a1333]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-400" size={20} />
                  <div>
                    <h4 className="font-medium text-white">Documentation</h4>
                    <p className="text-sm text-gray-400">Comprehensive guides and tutorials</p>
                  </div>
                </div>
                <ExternalLink className="text-gray-400" size={16} />
              </div>
              
              <div className="p-4 flex items-center justify-between hover:bg-[#1a1333]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-400" size={20} />
                  <div>
                    <h4 className="font-medium text-white">Release Notes</h4>
                    <p className="text-sm text-gray-400">Latest updates and features</p>
                  </div>
                </div>
                <ExternalLink className="text-gray-400" size={16} />
              </div>
              
              <div className="p-4 flex items-center justify-between hover:bg-[#1a1333]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="text-green-400" size={20} />
                  <div>
                    <h4 className="font-medium text-white">Account Settings</h4>
                    <p className="text-sm text-gray-400">Manage your preferences</p>
                  </div>
                </div>
                <ExternalLink className="text-gray-400" size={16} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ClientProtectedRoute>
  );
}

