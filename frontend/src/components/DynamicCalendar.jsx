import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check } from 'lucide-react';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

export function DynamicCalendar({ checkInDate, checkOutDate, onDateSelect, minDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevDays - i,
        month: month - 1,
        year: year,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: year,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const isDateSelected = (dayObj) => {
    const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    return dateStr === checkInDate || dateStr === checkOutDate;
  };

  const isCheckIn = (dayObj) => {
    const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    return dateStr === checkInDate;
  };

  const isCheckOut = (dayObj) => {
    const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    return dateStr === checkOutDate;
  };

  const isInRange = (dayObj) => {
    if (!checkInDate || !checkOutDate) return false;
    const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    return dateStr > checkInDate && dateStr < checkOutDate;
  };

  const isDisabled = (dayObj) => {
    if (!minDate) return false;
    const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    return dateStr < minDate;
  };

  const handleDateClick = (dayObj) => {
    if (isDisabled(dayObj)) return;
    const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  const days = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-amber-600 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="text-primary" size={24} />
          </button>
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <p className="text-primary/80 text-sm">Sélectionnez vos dates</p>
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="text-primary" size={24} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-slate-400 text-sm font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayObj, idx) => {
            const selected = isDateSelected(dayObj);
            const checkIn = isCheckIn(dayObj);
            const checkOut = isCheckOut(dayObj);
            const inRange = isInRange(dayObj);
            const disabled = isDisabled(dayObj);

            return (
              <button
                key={idx}
                onClick={() => handleDateClick(dayObj)}
                disabled={disabled}
                className={`
                  relative h-10 w-full rounded-lg transition-all
                  ${!dayObj.isCurrentMonth ? 'text-slate-600' : 'text-white'}
                  ${disabled ? 'text-slate-700 cursor-not-allowed' : 'hover:bg-secondary/20 cursor-pointer'}
                  ${checkIn || checkOut ? 'bg-gradient-to-r from-secondary to-amber-600 text-primary font-bold' : ''}
                  ${inRange ? 'bg-secondary/20 border-t border-b border-secondary/50' : ''}
                  ${selected && !checkIn && !checkOut ? 'bg-secondary/30' : ''}
                `}
              >
                <span className="text-sm">{dayObj.day}</span>
                {checkIn && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-primary font-bold">
                    Arrivée
                  </div>
                )}
                {checkOut && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-primary font-bold">
                    Départ
                  </div>
                )}
                {checkIn && (
                  <Check className="absolute top-1 right-1 w-3 h-3 text-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-secondary to-amber-600 rounded"></div>
            <span className="text-slate-300 text-sm">Arrivée/Départ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary/20 border-y border-secondary/50 rounded"></div>
            <span className="text-slate-300 text-sm">Séjour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700 rounded"></div>
            <span className="text-slate-300 text-sm">Indisponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DateRangePicker({ checkInDate, checkOutDate, onDateChange, minDate }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (dateStr) => {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start new selection
      onDateChange({ checkInDate: dateStr, checkOutDate: '' });
    } else if (dateStr > checkInDate) {
      // Set check-out
      onDateChange({ checkInDate, checkOutDate: dateStr });
      setShowCalendar(false);
    } else {
      // New check-in
      onDateChange({ checkInDate: dateStr, checkOutDate: '' });
    }
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="relative">
      {/* Input Display */}
      <div 
        className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer hover:border-secondary/50 transition-colors"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="text-secondary" size={18} />
            <span className="text-slate-300 text-sm">Check-in</span>
          </div>
          <p className="text-white font-semibold">
            {checkInDate ? new Date(checkInDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Sélectionner'}
          </p>
        </div>
        <div className="w-px h-12 bg-slate-700"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="text-secondary" size={18} />
            <span className="text-slate-300 text-sm">Check-out</span>
          </div>
          <p className="text-white font-semibold">
            {checkOutDate ? new Date(checkOutDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Sélectionner'}
          </p>
        </div>
        {checkInDate && checkOutDate && (
          <div className="bg-secondary/20 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="text-secondary" size={18} />
              <div>
                <p className="text-secondary font-bold">{calculateNights()} nuits</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 z-50 shadow-2xl">
          <DynamicCalendar
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onDateSelect={handleDateSelect}
            minDate={minDate}
          />
        </div>
      )}
    </div>
  );
}
