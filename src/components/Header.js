import Link from 'next/link';

export default function Header() {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-xl mx-auto p-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-indigo-700">
            Alika Activity Tracker
          </Link>
          <nav>
            <Link href="/stats" className="text-indigo-600 hover:text-indigo-800">
              Stats
            </Link>
          </nav>
        </div>
      </header>
    );
  }