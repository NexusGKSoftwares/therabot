import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Calendar, Brain, Heart, Smile, Meh, Frown, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Analytics() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [moodData, setMoodData] = useState([])
  const [insights, setInsights] = useState([])

  useEffect(() => {
    // TODO: Fetch real analytics data from backend
    const mockData = [
      { date: '2024-01-15', mood: 'positive', topics: ['study', 'friends'], messages: 5 },
      { date: '2024-01-16', mood: 'neutral', topics: ['stress', 'exams'], messages: 8 },
      { date: '2024-01-17', mood: 'negative', topics: ['anxiety', 'future'], messages: 12 },
      { date: '2024-01-18', mood: 'positive', topics: ['progress', 'goals'], messages: 6 },
      { date: '2024-01-19', mood: 'positive', topics: ['family', 'weekend'], messages: 4 },
      { date: '2024-01-20', mood: 'neutral', topics: ['work', 'routine'], messages: 7 },
      { date: '2024-01-21', mood: 'positive', topics: ['meditation', 'self-care'], messages: 3 }
    ]
    setMoodData(mockData)

    const mockInsights = [
      {
        type: 'positive',
        title: 'Improving Mood Trend',
        description: 'Your mood has improved by 40% over the past week',
        icon: TrendingUp
      },
      {
        type: 'warning',
        title: 'Stress Pattern Detected',
        description: 'You tend to feel more stressed on weekdays',
        icon: AlertTriangle
      },
      {
        type: 'info',
        title: 'Self-Care Progress',
        description: 'You\'ve been practicing self-care techniques regularly',
        icon: Heart
      }
    ]
    setInsights(mockInsights)
  }, [])

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'positive':
        return <Smile className="w-5 h-5 text-green-500" />
      case 'neutral':
        return <Meh className="w-5 h-5 text-yellow-500" />
      case 'negative':
        return <Frown className="w-5 h-5 text-red-500" />
      default:
        return <Meh className="w-5 h-5 text-gray-500" />
    }
  }

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'positive':
        return 'bg-green-100 text-green-700'
      case 'neutral':
        return 'bg-yellow-100 text-yellow-700'
      case 'negative':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStats = () => {
    const total = moodData.length
    const positive = moodData.filter(d => d.mood === 'positive').length
    const neutral = moodData.filter(d => d.mood === 'neutral').length
    const negative = moodData.filter(d => d.mood === 'negative').length
    const totalMessages = moodData.reduce((sum, d) => sum + d.messages, 0)

    return { total, positive, neutral, negative, totalMessages }
  }

  const getTopTopics = () => {
    const topicCounts = {}
    moodData.forEach(day => {
      day.topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1
      })
    })

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }))
  }

  const stats = getStats()
  const topTopics = getTopTopics()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mood Analytics</h1>
              <p className="text-gray-600">Track your mental health journey</p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedPeriod === period
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Sessions</span>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-green-600 mt-1">+2 from last week</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Positive Days</span>
              <Smile className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.positive}</div>
            <div className="text-xs text-green-600 mt-1">{Math.round((stats.positive / stats.total) * 100)}% of days</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Messages</span>
              <Brain className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalMessages}</div>
            <div className="text-xs text-blue-600 mt-1">Avg: {Math.round(stats.totalMessages / stats.total)} per session</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Stress Level</span>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">Medium</div>
            <div className="text-xs text-amber-600 mt-1">Needs attention</div>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Trend</h3>
            <div className="space-y-3">
              {moodData.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">{day.date}</div>
                  <div className="flex items-center gap-2 flex-1">
                    {getMoodIcon(day.mood)}
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          day.mood === 'positive' ? 'bg-green-500' :
                          day.mood === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(day.messages / 15) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{day.messages} msgs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Topics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Topics</h3>
            <div className="space-y-3">
              {topTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{topic.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${(topic.count / moodData.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{topic.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                    insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-1 ${
                      insight.type === 'positive' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-amber-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">🧘 Mindfulness Practice</h4>
              <p className="text-sm text-gray-600 mb-3">Try 5-minute meditation sessions to reduce stress</p>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Start Practice →
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">📝 Journal Prompts</h4>
              <p className="text-sm text-gray-600 mb-3">Daily prompts to improve self-awareness</p>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View Prompts →
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">💪 Coping Strategies</h4>
              <p className="text-sm text-gray-600 mb-3">Learn techniques for anxiety and stress</p>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Learn More →
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">🤝 Peer Support</h4>
              <p className="text-sm text-gray-600 mb-3">Connect with others in similar situations</p>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Join Community →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
