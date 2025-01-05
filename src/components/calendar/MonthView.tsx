import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import styles from "./MonthView.module.css";

interface Item {
  name: string;
  color: string;
  dates: Date[];
}

const MonthView = ({
  items,
  currentMonth,
  onMonthChange,
}: {
  items: Item[];
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}) => {
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => ({ ...acc, [item.name]: false }), {}) // Ensure each item is initially visible
  );

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(start);
  const daysInMonth = eachDayOfInterval({ start, end });

  const goToPrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    onMonthChange(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    onMonthChange(nextMonth);
  };

  if (!items || items.length <= 0) {
    return <p className="p-8">Loading...</p>;
  }

  const toggleItemVisibility = (itemName: string) => {
    setVisibleItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  return (
    <div className={styles["month-view"]}>
      <div className={styles["month-navigation"]}>
        <button className="btn btn-primary btn-outline" onClick={goToPrevMonth}>
          {"<"}
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button className="btn btn-primary btn-outline" onClick={goToNextMonth}>
          {">"}
        </button>
      </div>

      <div className={styles["calendar-grid"]}>
        <div className={styles["day-names"]}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="text-center font-bold">
              {day}
            </div>
          ))}
        </div>

        <div className={styles["days"]}>
          {daysInMonth.map((day, index) => {
            const dots = items
              .filter((item) => visibleItems[item.name])
              .filter((item) => item.dates.some((date) => isSameDay(date, day)))
              .map((item) => item.color);

            return (
              <div key={index} className={styles["day"]}>
                <span>{format(day, "d")}</span>
                <div className={styles["dots"]}>
                  {dots.map((color, idx) => {
                    // Find the last dot by checking if this dot corresponds to the latest date for this item
                    const item = items.find((i) => i.color === color);
                    const lastDate = item?.dates[item.dates.length - 1];
                    const isLastDot = isSameDay(lastDate!, day);

                    return (
                      <div
                        key={idx}
                        className={`${styles["dot"]} ${isLastDot ? "animate-pulse ring-4 ring-offset-2" : ""}`}
                        style={{ backgroundColor: color }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles["key"]}>
        <h4>Key</h4>
        {items.map((item, index) => (
          <div key={index} className={styles["key-item"]}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox"
                checked={visibleItems[item.name] ?? false} // Set default to true if undefined
                onChange={() => toggleItemVisibility(item.name)}
              />
              <div
                className={styles["color-indicator"]}
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
