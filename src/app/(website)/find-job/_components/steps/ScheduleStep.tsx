// src/components/steps/ScheduleStep.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FindJobDataTypes,
  ScheduleTypes,
} from "../find-job-data-type";
import { Clock, Plus, Trash2 } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DayState {
  day: string;
  selected: boolean;
  slots: string[];
}

export function ScheduleStep({
  data,
  onNext,
  onBack,
}: {
  data: FindJobDataTypes;
  onNext: (d: Partial<FindJobDataTypes>) => void;
  onBack: () => void;
}) {
  const [schedule, setSchedule] = useState<DayState[]>(() => {
    if (data.days && data.days.day.length > 0) {
      const daySlots: Record<string, string[]> = {};
      data.days.day.forEach((day, i) => {
        if (!daySlots[day]) daySlots[day] = [];
        daySlots[day].push(data.days.time[i] || "10:00-12:00");
      });

      return DAYS.map((day) => ({
        day,
        selected: !!daySlots[day],
        slots: daySlots[day] || ["10:00-12:00"],
      }));
    }

    return DAYS.map((day) => ({
      day,
      selected: false,
      slots: ["10:00-12:00"],
    }));
  });

  useEffect(() => {
    const saved = localStorage.getItem("findJobForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.days && parsed.days.day && parsed.days.day.length > 0) {
          const daySlots: Record<string, string[]> = {};
          parsed.days.day.forEach((day: string, i: number) => {
            if (!daySlots[day]) daySlots[day] = [];
            daySlots[day].push(parsed.days.time[i] || "10:00-12:00");
          });

          setSchedule(
            DAYS.map((day) => ({
              day,
              selected: !!daySlots[day],
              slots: daySlots[day] || ["10:00-12:00"],
            })),
          );
        }
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    }
  }, []);

  const toggleDay = (day: string) => {
    setSchedule((prev) =>
      prev.map((d) => (d.day === day ? { ...d, selected: !d.selected } : d)),
    );
  };

  const applyAll = (checked: boolean) => {
    setSchedule((prev) => prev.map((d) => ({ ...d, selected: checked })));
  };

  const updateSlotTime = (day: string, slotIndex: number, value: string) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        const newSlots = [...d.slots];
        newSlots[slotIndex] = value;
        return { ...d, slots: newSlots };
      }),
    );
  };

  const addSlot = (day: string) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        return { ...d, slots: [...d.slots, "14:00-18:00"] };
      }),
    );
  };

  const removeSlot = (day: string, slotIndex: number) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== day || d.slots.length <= 1) return d;
        return { ...d, slots: d.slots.filter((_, i) => i !== slotIndex) };
      }),
    );
  };

  const handleApplyAllTime = () => {
    const selectedDays = schedule.filter((d) => d.selected);
    if (selectedDays.length === 0) return;
    const firstSlots = selectedDays[0].slots;
    setSchedule((prev) =>
      prev.map((d) => (d.selected ? { ...d, slots: [...firstSlots] } : d)),
    );
  };

  const handleContinue = () => {
    const selected = schedule.filter((d) => d.selected);

    const dayArr: string[] = [];
    const timeArr: string[] = [];

    selected.forEach((d) => {
      d.slots.forEach((slot) => {
        dayArr.push(d.day);
        timeArr.push(slot);
      });
    });

    const scheduleTypes: ScheduleTypes = { day: dayArr, time: timeArr };
    onNext({ days: scheduleTypes });
  };

  const selectedDaysCount = schedule.filter((d) => d.selected).length;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-center">Which days?</h2>
        <p className="text-center text-gray-500 mb-8">
          Select the days you&apos;re available to work
        </p>

        <div className="space-y-6">
          {/* Day Selection Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {schedule.map((d) => (
              <button
                key={d.day}
                onClick={() => toggleDay(d.day)}
                className={`px-5 py-2.5 rounded-full border font-semibold text-sm transition-all duration-200 ${
                  d.selected
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-gray-50"
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => applyAll(e.target.checked)}
                checked={selectedDaysCount === DAYS.length}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Select All Days</span>
            </label>

            <button
              onClick={handleApplyAllTime}
              disabled={selectedDaysCount === 0}
              className={`text-sm flex items-center gap-1 px-3 py-1 rounded-full transition ${
                selectedDaysCount > 0
                  ? "text-primary hover:bg-primary/10"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <Clock size={14} />
              Apply same time to all
            </button>
          </div>

          {/* Selected Days with Time Slots */}
          {selectedDaysCount > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-gray-700">
                Set Working Hours ({selectedDaysCount} day
                {selectedDaysCount > 1 ? "s" : ""} selected)
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {schedule
                  .filter((d) => d.selected)
                  .map((d) => (
                    <div
                      key={d.day}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-primary">{d.day}</p>
                        <button
                          type="button"
                          onClick={() => addSlot(d.day)}
                          className="text-xs flex items-center gap-1 text-primary hover:bg-primary/10 px-2 py-1 rounded-full transition"
                        >
                          <Plus size={14} />
                          Add Time Slot
                        </button>
                      </div>
                      <div className="space-y-2">
                        {d.slots.map((slot, slotIdx) => (
                          <div key={slotIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={slot}
                              onChange={(e) =>
                                updateSlotTime(d.day, slotIdx, e.target.value)
                              }
                              placeholder="09:00-17:00"
                              className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                            />
                            {d.slots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSlot(d.day, slotIdx)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {selectedDaysCount === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Clock size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">
                Please select at least one day to continue
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 py-2.5 rounded-full font-semibold bg-transparent border-gray-300 hover:border-primary"
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={selectedDaysCount === 0}
              className="flex-1 bg-primary hover:bg-primary text-white py-2.5 rounded-full font-semibold transition-all duration-200"
            >
              Continue ({selectedDaysCount} day
              {selectedDaysCount !== 1 ? "s" : ""})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
