export default function StatCard({ title, value, badge }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between">
        <p className="text-gray-500">{title}</p>
        {badge && (
          <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
      <h2 className="text-3xl font-bold mt-4">{value}</h2>
    </div>
  );
}
