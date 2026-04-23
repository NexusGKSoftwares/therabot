import { useState, useEffect } from 'react'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Award, Target, Heart, Brain, Shield, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageLayout from '../components/PageLayout'

function ProfileContent() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    joinDate: 'January 15, 2024',
    totalSessions: 24,
    totalMessages: 156,
    streakDays: 7,
    moodImprovement: 35,
    achievements: [
      { id: 1, name: 'First Chat', description: 'Started your first conversation', icon: MessageSquare, earned: true },
      { id: 2, name: 'Week Warrior', description: 'Chatted for 7 days straight', icon: Calendar, earned: true },
      { id: 3, name: 'Mindful Master', description: 'Used mindfulness techniques', icon: Brain, earned: false },
      { id: 4, name: 'Crisis Helper', description: 'Helped someone in crisis', icon: Shield, earned: false }
    ],
    goals: [
      { id: 1, title: 'Daily Check-ins', progress: 85, target: '30 days' },
      { id: 2, title: 'Mood Tracking', progress: 60, target: 'Consistent logging' },
      { id: 3, title: 'Self-Care Routine', progress: 40, target: 'Weekly practice' }
    ]
  })

  const stats = [
    { label: 'Total Sessions', value: profileData.totalSessions, icon: Calendar, color: 'text-blue-600' },
    { label: 'Messages Sent', value: profileData.totalMessages, icon: MessageSquare, color: 'text-green-600' },
    { label: 'Current Streak', value: `${profileData.streakDays} days`, icon: Target, color: 'text-orange-600' },
    { label: 'Mood Improvement', value: `${profileData.moodImprovement}%`, icon: Heart, color: 'text-pink-600' }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => window.location.href = '/chat'}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-600">Your mental health journey</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {profileData.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileData.name}</h2>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {profileData.joinDate}</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
          )
        })}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${achievement.earned
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" />
          Goals Progress
        </h3>
        <div className="space-y-4">
          {profileData.goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-800">{goal.title}</h4>
                <span className="text-sm text-gray-600">{goal.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{goal.progress}% complete</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mental Health Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-600" />
          Mental Health Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Recent Mood</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Positive</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Stress Level</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Moderate</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Sleep Quality</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Good</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Profile() {
  return (
    <PageLayout title="Profile" currentPage="profile">
      <ProfileContent />
    </PageLayout>
  )
}

export default Profile
