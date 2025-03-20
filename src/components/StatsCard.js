export default function StatsCard({ title, icon, stats }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">{icon}</span>
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        </div>
        
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{stat.label}</span>
              <span className="text-lg font-medium text-indigo-700">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }