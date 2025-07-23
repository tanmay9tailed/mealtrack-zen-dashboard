const Navbar = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm w-full p-4 border-b border-slate-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 flex items-center justify-center bg-teal-500 text-white text-xl font-bold rounded-full">
            <span>🍽️</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">MealTrack</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user.photoURL ? (
            <img
              src={user?.photoURL || "/default-avatar.png"}
              onError={(e) => (e.target.src = "/default-avatar.png")}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
