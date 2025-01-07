import { ArrowRightIcon, CalendarDaysIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid items-center p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="mt-4 text-lg">Welcome to the Supply tracker. A tool to help you keep track of your supplies and usage dates.</p>

        <div tabIndex={0} className="collapse collapse-plus border-primary border mt-4 max-w-full sm:max-w-[50%]">
          <input type="checkbox" />
          <div className="collapse-title text-sm font-medium text-primary">
            Click to view additional information
          </div>
          <div className="collapse-content text-sm text-primary">
            <p>Your information, items and settings are stored locally on this device and browser.<br></br>They will not persist across different devices or browsers.</p>
          </div>
        </div>

        {/* Inventory Link */}
        <p className="mt-4">
          Get started by adding items to your inventory.
        </p>
        <Link href="/inventory" className="btn btn-primary btn-outline font-bold mt-4">
          <TableCellsIcon className="w-5 h-5" />
          <span>Inventory</span>
          <ArrowRightIcon className="w-5 h-5" />
        </Link>

        {/* Inventory Link */}
        <p className="mt-4">
        Then track upcoming usage dates via the calendar.
        </p>
        <Link href="/inventory/calendar" className="btn btn-primary btn-outline font-bold mt-4">
          <CalendarDaysIcon className="w-5 h-5" />
          <span>Calendar</span>
          <ArrowRightIcon className="w-5 h-5" />
        </Link>

        {/* Feedback Button */}
        <p className="mt-4">
          If you have any feedback, please <a href="https://forms.gle/6RrrmDj3EZrbfCbWA" target="_blank" rel="noopener noreferrer" className="text-primary font-bold">get in touch</a>.
        </p>


      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
