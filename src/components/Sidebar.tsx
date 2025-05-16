
const Sidebar = () => {
  return (
    <div>
        <aside className="w-64 p-6 border-r border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li className="font-medium text-blue-600">All categories</li>
            <li className="ml-2">
              <p className="font-semibold">Laptop</p>
              <label className="block mt-1">
                <input type="checkbox" className="mr-2" />
                HP
              </label>
              <label className="block">
                <input type="checkbox" className="mr-2" />
                Dell
              </label>
            </li>
            <li className="ml-2 mt-2 cursor-pointer hover:underline">Tablet</li>
            <li className="ml-2 mt-2 cursor-pointer hover:underline">Headphones</li>
          </ul>
        </aside>
    </div>
  )
}

export default Sidebar